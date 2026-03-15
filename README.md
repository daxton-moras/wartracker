Yes — here is a polished `README.md` tailored to your current project: a Vercel-hosted conflict and market tracker with a frontend dashboard, backend API routes, Supabase storage, Finnhub market data, and planned EIA/GDELT integration. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/75890996/e37919bc-b39e-4a92-a987-0e12d4bd515d/Screenshot-2026-03-15-at-14.59.46.jpg)

You can copy-paste this directly into your repo as `README.md`.

```md
# WAR ROOM

An open-source conflict, energy, and market intelligence dashboard built to track fast-moving geopolitical events and their impact on financial markets, oil supply, and global risk sentiment.

## Overview

WAR ROOM is a beginner-friendly full-stack web project that turns a static webpage into a live public dashboard.

The goal of the project is to:

- Track conflict-related developments from open sources.
- Monitor market reactions such as the S&P 500 and defense-sector performance.
- Track energy disruption signals like Brent crude price movement.
- Present everything in a simple, visual, public-facing dashboard.
- Stay free to build, free to host, and publicly accessible over HTTPS.

This project started as a simple `index.html` page and evolved into a real-time dashboard architecture with:

- **Frontend** for displaying the dashboard.
- **Backend API routes** for refreshing and serving data.
- **Database** for storing metrics and reports.
- **Scheduled refresh workflow** for automated updates.

---

## Live Demo

Add your live URL here:

```bash
https://wartracker-gray.vercel.app
```

---

## Features

### Current features

- Live dashboard UI
- Public HTTPS deployment on Vercel
- Automated market metric ingestion
- Supabase-backed data storage
- Scheduled refresh flow with GitHub Actions
- API endpoints for refresh and latest dashboard data
- Modular structure for adding more sources later

### Planned features

- Brent crude integration from EIA
- Optional report/news ingestion from GDELT
- Clickable incident/report cards
- Alert banner with linked source articles
- Filters by category, actor, and region
- Historical charts for oil and markets
- Manual verification workflow for casualties and strike counts
- Interactive map for major incidents
- Better drill-down pages for source intelligence

---

## Tech Stack

### Frontend
- HTML
- Tailwind CSS
- Vanilla JavaScript

### Backend
- Vercel Serverless Functions (`/api` routes)
- Node.js runtime

### Database
- Supabase Postgres

### External Data Sources
- Finnhub for market data
- EIA for energy/oil data
- GDELT for optional news/report ingestion

### Deployment
- GitHub
- Vercel
- GitHub Actions

---

## Architecture

```text
Browser
   |
   v
Frontend Dashboard (index.html + app.js)
   |
   v
/api/latest  <----  Supabase (metrics, reports)
/api/refresh <----  External APIs (Finnhub, EIA, GDELT)
   ^
   |
GitHub Actions Scheduler
```

### How it works

1. A scheduled workflow calls the refresh endpoint.
2. The backend fetches fresh data from external APIs.
3. The backend stores the latest values in Supabase.
4. The frontend requests `/api/latest`.
5. The dashboard renders the latest saved metrics and reports.

---

## Project Structure

```text
wartracker/
├── api/
│   ├── latest.js
│   └── refresh.js
├── supabase/
│   └── schema.sql
├── .github/
│   └── workflows/
│       └── refresh.yml
├── index.html
├── app.js
├── package.json
└── .env.example
```

---

## Environment Variables

Create a local `.env.local` file for development.

Example:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FINNHUB_API_KEY=
EIA_API_KEY=
CRON_SECRET=
APP_URL=
```

### Notes

- `SUPABASE_URL` is your Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` is your server-side secret key.
- `FINNHUB_API_KEY` is used for market data.
- `EIA_API_KEY` is used for Brent crude / energy data.
- `CRON_SECRET` protects the refresh endpoint.
- `APP_URL` is your live deployed site URL.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/wartracker.git
cd wartracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file and add your real values.

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FINNHUB_API_KEY=your_finnhub_api_key
EIA_API_KEY=your_eia_api_key
CRON_SECRET=your_random_secret
APP_URL=https://your-live-site.vercel.app
```

### 4. Create the database schema

Open your Supabase SQL editor and run the schema file from:

```text
supabase/schema.sql
```

### 5. Run locally

If you use a local dev server, start it and test the frontend plus API routes.

### 6. Deploy to Vercel

- Push the repo to GitHub.
- Import the repo into Vercel.
- Add the environment variables in Vercel Project Settings.
- Deploy.

---

## API Endpoints

### `GET /api/latest`

Returns the latest dashboard data.

Example response:

```json
{
  "ok": true,
  "generatedAt": "2026-03-15T15:07:06.374Z",
  "metrics": {},
  "reports": []
}
```

### `GET /api/refresh`

Protected endpoint used by GitHub Actions or manual testing.

Example:

```bash
curl -L -H "Authorization: Bearer YOUR_CRON_SECRET" "https://your-site.vercel.app/api/refresh"
```

---

## Database Tables

### `metrics`

Stores dashboard numeric values such as:

- S&P 500 ETF (SPY)
- Defense ETF (ITA)
- Brent crude
- Other market or energy metrics

### `reports`

Stores source-linked intelligence items such as:

- Headline
- Summary/body
- Actor
- Region
- Status
- Source name
- Source URL
- Published timestamp

---

## Design Goals

This project is designed around a few principles:

- **Simple** enough for beginners to understand
- **Free** to build and host
- **Public** and accessible over HTTPS
- **Transparent** about data sources
- **Extensible** for future intelligence features
- **Careful** with disputed or unverified conflict claims

---

## Important Data Disclaimer

This project uses open-source and API-driven data.

That means:

- Market and energy data can often be automated.
- Conflict reporting may be delayed, disputed, incomplete, or wrong.
- Casualty figures and strike counts should be manually reviewed before being treated as verified.
- This dashboard should not be considered an official intelligence source.

Always cross-check major claims with primary reporting and trusted outlets.

---

## Roadmap

- [x] Static landing page
- [x] Public Vercel deployment
- [x] Supabase database setup
- [x] Finnhub market metrics integration
- [x] Scheduled refresh workflow
- [ ] EIA Brent crude integration
- [ ] Optional GDELT report ingestion
- [ ] Interactive report cards
- [ ] Rich filtering and search
- [ ] Charts and historical views
- [ ] Incident map
- [ ] Admin/manual verification workflow
- [ ] Responsive mobile improvements

---

## Challenges and Lessons Learned

This project is also a learning journey.

Some of the main lessons from building it include:

- Static HTML is good for design prototypes, but not for live data.
- Backend APIs are needed when secrets must stay private.
- A database is useful when you want to save the latest snapshot instead of hard-coding values.
- Scheduled jobs make the app feel live.
- External APIs can fail, rate-limit, or return partial data, so the system must be fault-tolerant.
- Conflict-related data needs human judgment, not just automation.

---

## Why this project matters

WAR ROOM is more than a frontend experiment.

It is a practical full-stack portfolio project that demonstrates:

- API integration
- Backend development
- Database design
- Deployment workflows
- Environment variable management
- Scheduled automation
- Dashboard UI design
- Real-world data reliability thinking

For anyone learning web development, this is a strong example of how a simple static webpage can evolve into a useful full-stack product.

---

## Screenshots

Add screenshots here once your UI improves further.

Example:

```md

```

---

## Contributing

Suggestions, improvements, and ideas are welcome.

Possible contributions include:

- Better UI/UX
- More robust report ingestion
- Historical charting
- Improved filtering
- Incident mapping
- Better accessibility
- Mobile optimization

---

## Security Notes

- Never commit real secrets to GitHub.
- Keep API keys in Vercel environment variables and GitHub secrets.
- Rotate any secret that was accidentally exposed during development.
- Use server-side routes for protected integrations.

---

## License

Choose a license for your repo, such as:

- MIT
- Apache-2.0

Example:

```md
MIT License
```

---

## Author

Built by **Daxton Moras**

If you're using this project as part of your portfolio, you can also add:

- GitHub profile
- LinkedIn
- Personal portfolio site

---

## Acknowledgments

Thanks to the public tools and platforms that make projects like this possible:

- Vercel
- Supabase
- GitHub
- Finnhub
- EIA
- GDELT
```

## Nice additions

A few parts of that README reflect your current setup and recent progress, including the live Vercel deployment, working Finnhub-backed metrics, and planned EIA/GDELT expansion. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/75890996/3b8a5e3b-4428-4b20-a6df-78b235bd021d/Screenshot-2026-03-15-at-15.58.10.jpg)

If you want, I can next generate:
1. a **shorter professional README** for recruiters,  
2. a **flashy open-source README** with badges and screenshots, or  
3. a **portfolio-grade README** with architecture diagrams and setup gifs.
