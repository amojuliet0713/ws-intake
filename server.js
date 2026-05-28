require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

// Allow Teams to embed in iframe
app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://teams.microsoft.com https://*.teams.microsoft.com https://*.skype.com");
  next();
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

// ── AI proxy — API key stays on server, staff never see it ──────────────────
app.post("/api/claude", async (req, res) => {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY.includes("PASTE-YOUR-KEY")) {
    return res.status(500).json({ error: "API key not configured on server. Open the .env file and add your Anthropic API key." });
  }
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── File text extraction ─────────────────────────────────────────────────────
app.post("/api/extract-text", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const ext = req.file.originalname.split(".").pop().toLowerCase();
  try {
    if (ext === "txt") {
      return res.json({ text: req.file.buffer.toString("utf8") });
    }
    if (ext === "pdf") {
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(req.file.buffer);
      return res.json({ text: data.text });
    }
    if (ext === "docx") {
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      return res.json({ text: result.value });
    }
    res.status(400).json({ error: "Unsupported file type. Use PDF, .docx, or .txt" });
  } catch (e) {
    res.status(500).json({ error: "File extraction failed: " + e.message });
  }
});

// ── Teams config page ────────────────────────────────────────────────────────
app.get("/teams-config", (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Intake System Config</title>
  <script src="https://res.cdn.office.net/teams-js/2.0.0/js/MicrosoftTeams.min.js"></script>
</head>
<body style="font-family:sans-serif;padding:2rem;background:#f4f6f9">
  <h2 style="color:#1a1a3e">Williams & Seemen Intake System</h2>
  <p>Click Save to add this tab to your Teams channel.</p>
  <script>
    microsoftTeams.app.initialize().then(() => {
      microsoftTeams.pages.config.registerOnSaveHandler((saveEvent) => {
        microsoftTeams.pages.config.setConfig({
          suggestedDisplayName: "Intake System",
          entityId: "intake",
          contentUrl: window.location.origin + "/",
          websiteUrl: window.location.origin + "/"
        });
        saveEvent.notifySuccess();
      });
      microsoftTeams.pages.config.setValidityState(true);
    });
  </script>
</body>
</html>`);
});

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  const keySet = !!(process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("PASTE-YOUR-KEY"));
  res.json({ status: "ok", apiKeyConfigured: keySet });
});

// ── Serve intake PDF template ─────────────────────────────────────────────────
app.get("/intake-template.pdf", (req, res) => {
  const p = path.join(__dirname, "Employment_Intake_Form.pdf");
  if (fs.existsSync(p)) res.sendFile(p);
  else res.status(404).send("Template not found");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅  W&S Intake System → http://localhost:${PORT}`);
  console.log(`🔑  API key configured: ${!!(process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("PASTE"))}\n`);
});
