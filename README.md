# user-panel-frontend

User-facing web panel for the Qubetics dVPN. Built with React, TypeScript, Vite and
Tailwind CSS.

## Requirements

- **Node.js 20+**
- **npm** (this repo is npm-based; `package-lock.json` is the lock file)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env
#    then edit .env and fill in real values (see .env.example for the full list)
```

## Running

```bash
npm run dev          # start the Vite dev server
npm run build        # production build to dist/
npm run preview      # preview the production build
```

## Testing

```bash
npm test             # run the Jest test suite
```

## Environment variables

All configuration is supplied through environment variables (Vite `VITE_*`). See
[`.env.example`](./.env.example) for the complete, documented list.

## Notes

- Deployment CI workflows were removed from the public repository; they referenced private
  infrastructure. Add your own deployment pipeline as needed.
- Build artefacts (`node_modules/`, `dist/`) are git-ignored and must not be committed.
