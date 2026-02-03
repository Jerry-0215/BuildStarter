# BuildStarter

**Kickstarter/Fiverr for websites and apps** — a front-end demo.

One unified experience: search and browse requests, create a request (with optional key features), and open any request to see details, propose features, and rate or comment on creator solutions.

- **Browse** — Search, create a request (with expandable “key features to include”), and click any popular request.
- **Request detail** — Existing features, propose new features, solutions from creators (rate 1–5 stars, comment), and “Post a solution” (Figma or demo link).

No data is collected or stored; all actions are UI-only.

## Run the demo

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

## Deploy to GitHub Pages

1. **Set the base path** to your repo name. If your site URL is `https://<user>.github.io/BuildStarter/`, the base path is `/BuildStarter/`.
2. **Build with that base:**
   ```bash
   BASE_URL=/BuildStarter/ npm run build
   ```
   Or use the script (edit the path in `package.json` if your repo name differs):
   ```bash
   npm run build:gh-pages
   ```
3. Deploy the `dist` folder (e.g. push to a `gh-pages` branch or use GitHub Actions). The repo name in the URL must match the `BASE_URL` you used (e.g. `/BuildStarter/` for `.../BuildStarter/`).
