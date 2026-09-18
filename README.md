<div align="center">

# 🍽️ Smart Meal Management System

A hostel / mess meal, bazar, and expense tracker for shared student living.

**No backend. No build step. No dependencies to install.**
Open `index.html` and it runs — or host it for free on GitHub Pages.

[Live demo](#-getting-started) · [Features](#-features) · [Tech stack](#-tech-stack) · [Project structure](#-project-structure)

</div>

<br/>

## 📖 About

Most university hostels/mess halls in Bangladesh (and elsewhere) still track daily meals, grocery spend, and who-owes-what on a paper register or a shared spreadsheet. It's slow, error-prone, and nobody trusts the math at month-end.

**Smart Meal Management System For Students** replaces that register with a small web app that:

- Lets a manager log each member's daily meal count
- Tracks grocery ("bazar") spending
- Automatically calculates the **per-meal rate** (`total bazar cost ÷ total meals eaten`)
- Works out exactly what every member owes or has in credit
- Gives members their own login to check their own meals and balance — without bothering the manager

## ✨ Features

| Area | What it does |
|---|---|
| 🔐 **Two roles** | A manager account (full control) and per-member accounts (read-only, personal data only) |
| 🍛 **Meal tracking** | Manager sets each member's meal count per day via a quick-entry grid; full history is kept |
| 🛒 **Bazar log** | Every grocery purchase is recorded with item, amount, date, and who bought it |
| 💰 **Deposits** | Track advance payments from each member |
| 🧮 **Auto-calculated ledger** | Meal rate, cost owed, and balance (due / advance / settled) computed live for every member |
| 📊 **Reports & charts** | Monthly summary, a 14-day meal trend chart, a 6-week bazar spend chart, and a per-member meal-share chart |
| 📤 **CSV export** | Download the monthly balance sheet as a spreadsheet-ready CSV |
| 📢 **Notice board** | Manager posts announcements everyone sees on login |
| 📱 **Responsive** | Usable on a phone in the middle of the kitchen, not just a desktop |

## 🖥️ Screenshots

> Add your own screenshots here after running the app — drop PNG/GIF files into `docs/screenshots/` and reference them below, e.g.:
> `![Overview](docs/screenshots/overview.png)`

## 🚀 Getting Started

No installation required.

**Option A — just open it**
1. Download or clone this repository
2. Double-click `index.html` (or right-click → Open with → your browser)

**Option B — host it for free (recommended for your portfolio)**
1. Push this repo to GitHub
2. Go to **Settings → Pages**, set the source branch to `main` and folder to `/ (root)`
3. Your live app will be at `https://<your-username>.github.io/<repo-name>/`

### Demo logins

| Role | How to sign in |
|---|---|
| Manager | Password: `admin123` |
| Member | Pick any name from the dropdown — no password in this demo |

The app seeds itself with 5 demo members and 21 days of realistic meal/bazar/deposit history the first time it runs, so there's something to look at immediately. Use **Reset demo data** on the login page to start fresh at any time.

## 🧱 Tech Stack

- **HTML5 / CSS3** — hand-written, no framework, no build tool
- **Vanilla JavaScript (ES6+)** — modular, one file per concern
- **[Chart.js](https://www.chartjs.org/)** (via CDN) — the only external dependency, used for the report charts
- **Browser `localStorage`** — acts as the database for this version (see [Roadmap](#-roadmap) for a real backend)
- **Google Fonts** — Sora (headings), Inter (body), JetBrains Mono (numbers)

## 📁 Project Structure

```
smart-meal-management-system/
├── index.html                 # Login / landing page
├── dashboard.html              # Main app shell (all sections, role-based views)
├── assets/
│   ├── css/
│   │   └── style.css           # Full design system (colors, type, components)
│   └── js/
│       ├── storage.js          # Data layer — all localStorage reads/writes live here
│       ├── utils.js            # Formatting & small helpers (dates, money, CSV export, toasts)
│       ├── calc.js             # All mess-accounting math (meal rate, ledgers, chart series)
│       ├── app.js              # App boot: session check, sidebar nav, Overview section
│       ├── auth.js             # Login page logic (index.html only)
│       ├── members.js          # Members section
│       ├── meals.js            # Meals section
│       ├── bazar.js            # Bazar (grocery) section
│       ├── deposits.js         # Deposits section
│       ├── reports.js          # Reports section, charts, CSV export
│       └── notices.js          # Notice board section
└── docs/
    └── screenshots/            # Put your own screenshots here
```

Each JS module follows the same pattern: an IIFE that exposes a small public API (`render()`, plus a form handler), so every section is self-contained and easy to read in isolation.

## 🧮 How the accounting works

```
meal rate  =  total bazar spend ÷ total meals eaten (whole mess, per month)

for each member:
  cost owed   =  their meals eaten  ×  meal rate
  balance     =  their deposits  −  cost owed

  balance > 0  →  in credit (Advance)
  balance < 0  →  owes money (Due)
  balance = 0  →  Settled
```

This is the standard "equal-rate" method used by most Bangladeshi hostel messes: everyone pays the same price per meal, and the price is only known once the month's bazar spend is totalled.

## 🗺️ Roadmap

Ideas for extending this into a full-stack project:

- [ ] Replace `localStorage` with a real backend (Node.js/Express + SQLite/PostgreSQL) and real authentication
- [ ] Let members submit their own "meal off" requests for future dates, with manager approval
- [ ] Multi-mess support (one deployment, many hostels)
- [ ] Email/SMS reminder before the daily meal-off deadline
- [ ] PDF export of the monthly bill (in addition to CSV)
- [ ] Dark/light theme toggle

## 🤝 Contributing

This is a learning project, but suggestions and pull requests are welcome — feel free to open an issue first to discuss what you'd like to change.

## 📄 License

Released under the [MIT License](LICENSE).

---

<div align="center">

Built by **[Md Rakibul Islam](https://github.com/Baadal891310)** — CSE student, Daffodil International University

</div>
### Latest Update
Working on improving the Smart Meal Management System.
YOLO Badge Test pull
