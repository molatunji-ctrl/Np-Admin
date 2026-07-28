# Nuges Admin Dashboard

Admin control panel for Nuges Pharmacy, built with React + Vite + Tailwind CSS.

## Project structure

```
src/
├── App.jsx                 # Root component: layout shell + page router
├── main.jsx                 # React entry point
├── index.css                 # Global styles / Tailwind import
├── assets/                   # Static assets bundled by Vite (logos, images)
├── components/
│   └── layout/
│       └── Sidebar.jsx       # App shell navigation
├── constants/
│   └── navigation.js         # Sidebar / mobile nav item definitions
├── data/                     # Placeholder/mock data (swap for API calls later)
│   ├── customers.js
│   ├── products.js
│   └── stats.js
└── pages/                    # One file per route/screen
    ├── DashboardPage.jsx
    ├── ProductsPage.jsx
    ├── OrdersPage.jsx
    ├── CustomersPage.jsx
    └── MessagesPage.jsx
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
