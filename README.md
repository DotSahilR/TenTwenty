# ⏱️ Timesheet Management App

A simple timesheet management app built using React and TailwindCSS.

## 🛠️ Tech Stack

- **React** (Vite + TypeScript)
- **TailwindCSS** (utility-first CSS)
- **React Router** (client-side routing)
- **Lucide-react** (icons)
- **Context API** (for auth)

---

## 📄 Pages & Features

### 🔐 `/login`
- Email + password inputs
- Dummy authentication logic
- Stores token in `sessionStorage`
- On success, redirects to `/timesheet-table`

### 📊 `/timesheet-table`
- Dashboard displaying a table of timesheet entries
- Table columns:
  - Week 
  - Date
  - Status
  - Actions (e.g. Edit)
- Protected route (redirects if not logged in)

### ✏️ `/timesheet-modal`
- Modal/form to add or edit a timesheet entry\
- Accessible via action buttons in table

---

## 🧩Dummy authentication ID

- email: test@tentwenty.com
- password: 123456

---

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Deploy to GitHub Pages
npm run deploy
