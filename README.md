# LG Employee Attendance App

A modern, TypeScript-first React app for managing and visualizing employee attendance, integrated with Google Sheets. Styled with TailwindCSS and featuring a beautiful, interactive calendar for each user.

---

## Features

- **Google Sheets Integration**: Pulls attendance data directly from a Google Sheet.
- **Authentication**: Each user sees only their own attendance and summary.
- **Beautiful Calendar**: Highlights all days the user worked ("V") in green.
- **Period Summaries**: Shows pay and attendance per period.
- **Robust Data Handling**: Handles extra columns, flexible order, and both ISO and dd/MM/yyyy date formats.
- **TypeScript, Vite, React-Router v6, TailwindCSS**

---

## Project Structure

```
LG/
├── src/
│   ├── api/sheets.ts         # Google Sheets API logic
│   ├── auth/                 # Authentication context/hooks
│   ├── components/           # UI components (WorkCalendar, TotalsCard, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components (Dashboard, Login, Admin)
│   ├── utils/                # Utility functions (date, etc.)
│   ├── types/                # TypeScript types
│   └── App.tsx               # Main app entry
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── .gitignore
└── README.md
```

---

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Google Sheets API**
   - Set your API key and Sheet ID in `src/constants/index.ts` or as environment variables.
   - Make sure your sheet is shared as "Anyone with the link can view".


3. **Start the development server**
   ```bash
   npm run dev
   ```

---

## Deployment: GitHub Pages (Vite)

You can deploy this app to GitHub Pages using Vite's static build output and the `gh-pages` package.

### 1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

### 2. **Update vite.config.ts**
Add the `base` option to match your repo name:
```ts
export default defineConfig({
  base: '/YOUR_REPO_NAME/', // <-- set to your repo name
  ...
})
```

### 3. **Add deploy scripts to package.json**
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### 4. **Build and Deploy**
```bash
npm run deploy
```

- This will build the app and push the `dist` folder to the `gh-pages` branch.
- Your app will be live at: `https://<your-username>.github.io/<YOUR_REPO_NAME>/`

### 5. **GitHub Settings**
- Go to your repo > Settings > Pages
- Set the source to `gh-pages` branch, `/ (root)`

---

## License
MIT 