/// <reference types="vite/client" />

export const DAILY_RATE = 550; // ₪ per day
export const GOOGLE_SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
export const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SHEETS_ID;

export const EMPLOYEES_SHEET_NAME = 'עובדים';
export const ATTENDANCE_SHEET_NAME = 'נוכחות';
export const TOTALS_SHEET_NAME = 'סה"כ תשלומים'; 


// # יצירת קובץ זמני עם מפתחות
// echo "VITE_GOOGLE_SHEETS_API_KEY=AIzaYourKeyHere" > .env.production
// echo "VITE_GOOGLE_SHEETS_ID=1AbcSheetIDHere" >> .env.production

// # בנייה ופריסה
// npm run build
// npm run deploy

// # ניקוי (לא חובה אבל מומלץ)
// rm .env.production