# Williams & Seemen, APLC — Employment Intake System

## First-Time Setup (5 minutes)

### Step 1 — Install Node.js (one time only)
Download and install from: https://nodejs.org/en/download
Choose the "LTS" version. Click through the installer with all defaults.

### Step 2 — Add your Anthropic API key
1. Open the file called `.env` in this folder (use Notepad)
2. Replace `sk-ant-api03-PASTE-YOUR-KEY-HERE` with your actual key
3. Save the file
4. To get a key: go to https://console.anthropic.com → sign in → API Keys → Create Key

### Step 3 — Start the app
- **Windows:** Double-click `START.bat`
- **Mac/Linux:** Open Terminal, drag this folder in, type `bash start.sh`

The app will open automatically in your browser at http://localhost:3000

---

## Daily Use
Just double-click `START.bat` (Windows) or run `bash start.sh` (Mac).
Staff open http://localhost:3000 in their browser — no API key needed.

## Files in this folder
- `server.js` — the backend server
- `public/index.html` — the web app
- `Employment_Intake_Form.pdf` — the W&S intake form template
- `.env` — your API key (keep this private, never share)
- `START.bat` / `start.sh` — startup scripts

## Cost
Each AI extraction costs ~$0.01–$0.03.
$10 in Anthropic credits = 300–1000 intakes.
Add credits at: https://console.anthropic.com → Billing

## Sharing with your team
If you want the whole team to access this without running it locally,
you can host it on a simple cloud server (ask your IT person or
contact us to set this up — takes about 30 minutes).
