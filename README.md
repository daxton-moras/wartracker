```md
# WAR ROOM

An open-source conflict, energy, and market intelligence dashboard built to track fast-moving geopolitical events and their impact on financial markets, oil supply, and global risk sentiment.

## Overview

WAR ROOM is a beginner-friendly full-stack web project that transforms a static webpage into a live public dashboard.

The project is designed to:

- Track conflict-related developments from open sources
- Monitor market reactions such as the S&P 500 and defense-sector performance
- Track energy disruption signals like Brent crude price movement
- Present everything in a clean, visual, public-facing dashboard
- Stay free to build, free to host, and publicly accessible over HTTPS

This project started as a simple `index.html` page and evolved into a full-stack dashboard architecture with:

- A frontend for rendering the dashboard
- Backend API routes for refreshing and serving data
- A database for storing metrics and reports
- A scheduled refresh workflow for automated updates

---

## Live Demo

https://wartracker-gray.vercel.app

---

## Features

### Current Features

- Live dashboard UI
- Public HTTPS deployment on Vercel
- Automated market metric ingestion
- Supabase-backed data storage
- Scheduled refresh flow with GitHub Actions
- API endpoints for refresh and latest dashboard data
- Modular structure for adding more sources later

### Planned Features

- Brent crude integration from EIA
- Optional report and news ingestion from GDELT
- Clickable incident and report cards
- Alert banner with linked source articles
- Filters by category, actor, and region
- Historical charts for oil and markets
- Manual verification workflow for casualties and strike counts
- Interactive map for major incidents
- Drill-down pages for source intelligence

---

## Tech Stack

### Frontend

- HTML
- Tailwind CSS
- Vanilla JavaScript

### Backend

- Vercel Serverless Functions
- Node.js runtime

### Database

- Supabase Postgres

### External Data Sources

- Finnhub for market data
- EIA for energy and oil data
- GDELT for optional news and report ingestion

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

### How It Works

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

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FINNHUB_API_KEY=
EIA_API_KEY=
CRON_SECRET=
APP_URL=
```

### Notes

- `SUPABASE_URL` is your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` is your server-side secret key
- `FINNHUB_API_KEY` is used for market data
- `EIA_API_KEY` is used for Brent crude and energy data
- `CRON_SECRET` protects the refresh endpoint
- `APP_URL` is your live deployed site URL

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

Create a `.env.local` file and add your real values:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FINNHUB_API_KEY=your_finnhub_api_key
EIA_API_KEY=your_eia_api_key
CRON_SECRET=your_random_secret
APP_URL=https://wartracker-gray.vercel.app
```

### 4. Create the database schema

Open your Supabase SQL editor and run the schema file from:

```text
supabase/schema.sql
```

### 5. Run locally

Start your local development server and test the frontend plus API routes.

### 6. Deploy to Vercel

- Push the repository to GitHub
- Import the repository into Vercel
- Add the environment variables in Vercel Project Settings
- Deploy

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
curl -L -H "Authorization: Bearer YOUR_CRON_SECRET" "https://wartracker-gray.vercel.app/api/refresh"
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

- Title
- Summary or body
- Actor
- Region
- Status
- Source name
- Source URL
- Published timestamp

---

## Design Goals

This project is designed around a few principles:

- Simple enough for beginners to understand
- Free to build and host
- Public and accessible over HTTPS
- Transparent about data sources
- Extensible for future intelligence features
- Careful with disputed or unverified conflict claims

---

## Important Disclaimer

This project uses open-source and API-driven data.

That means:

- Market and energy data can often be automated
- Conflict reporting may be delayed, disputed, incomplete, or wrong
- Casualty figures and strike counts should be manually reviewed before being treated as verified
- This dashboard should not be considered an official intelligence source

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
- [ ] Admin and manual verification workflow
- [ ] Responsive mobile improvements

---

## Challenges and Lessons Learned

This project is also a learning journey.

Some of the biggest lessons from building it include:

- Static HTML is good for design prototypes, but not for live data
- Backend APIs are needed when secrets must stay private
- A database is useful when you want to save the latest snapshot instead of hard-coding values
- Scheduled jobs make the app feel live
- External APIs can fail, rate-limit, or return partial data, so the system must be fault-tolerant
- Conflict-related data needs human judgment, not just automation

---

## Why This Project Matters

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

For anyone learning web development, this project shows how a simple static webpage can evolve into a useful full-stack product.

---

## Screenshots

Add screenshots here as the UI evolves.

Example:

```md

```

---

## Contributing

Suggestions, improvements, and ideas are welcome.

Possible contributions include:

- Better UI and UX
- More robust report ingestion
- Historical charting
- Improved filtering
- Incident mapping
- Better accessibility
- Mobile optimization

---

## Security Notes

- Never commit real secrets to GitHub
- Keep API keys in Vercel environment variables and GitHub secrets
- Rotate any secret that was accidentally exposed during development
- Use server-side routes for protected integrations

---

## License

MIT License

---

## Author

Built by Daxton Moras

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
