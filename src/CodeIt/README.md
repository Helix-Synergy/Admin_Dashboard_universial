# Code It Admin Dashboard - Developer Guide

Welcome! This folder (`src/CodeIt/`) is your dedicated workspace for building the **Code It** Admin Dashboard.

## 🛡️ Rules of Engagement

1.  **Stay in this Folder**: All your new pages, components, and logic should be created INSIDE this `src/CodeIt/` directory.
    *   Example: `src/CodeIt/components/UserTable.jsx`
    *   Example: `src/CodeIt/pages/Settings.jsx`

2.  **Do Not Touch Shared Files**:
    *   Do **NOT** modify `src/App.js` (Routing is already set up).
    *   Do **NOT** modify `src/Dashboard.jsx` (That is for Peptides).
    *   Do **NOT** modify `src/WebsiteSelector.jsx`.

3.  **Entry Point**:
    *   `src/CodeIt/Dashboard.jsx` is your main "App" file.
    *   If you need routing (e.g., clicking "Users" goes to a new page), implement it using standard React state or a sub-router inside `Dashboard.jsx`.

4.  **Styling**:
    *   You are free to use Tailwind CSS classes just like the rest of the app.
    *   If you need custom CSS, create `src/CodeIt/styles.css` and import it.

5.  **Environment Variables**:
    *   Your backend URL is stored in `.env` as `VITE_CODEIT_API_BASE`.
    *   Access it in your code like this:
        ```javascript
        const API_BASE = import.meta.env.VITE_CODEIT_API_BASE || 'http://localhost:5000/api';
        ```

## 🚀 Getting Started

Start editing `src/CodeIt/Dashboard.jsx`. Your changes will appear immediately when the "Code It" dashboard is selected.
