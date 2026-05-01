# GraphQL Profile Page

A personal profile page built with vanilla JavaScript that connects to the Zone01 Oujda GraphQL API to display your school journey and statistics.

## Live Demo

> 🔗 [https://graphql-z01.netlify.app](https://graphql-z01.netlify.app)

---

## Features

- **JWT Authentication** — Secure login with username/email and password
- **Profile Overview** — Displays user info, XP, level, and rank
- **Statistics Dashboard** — Interactive SVG graphs showing your progress
- **Responsive UI** — Clean, modern design that works on all screen sizes
- **Logout** — Session management with token clearing

---

## Project Structure

```
graphql/
├── index.html              # Entry point
├── style.css               # Global styles
└── js/
    ├── main.js             # App bootstrap & routing
    ├── api/
    │   ├── auth.js         # Login / JWT handling (Basic & Bearer auth)
    │   └── graphql.js      # GraphQL query functions
    ├── components/
    │   ├── loginUI.js      # Login page component
    │   ├── profileUI.js    # Profile page component
    │   └── graphsUI.js     # SVG graph components
    └── utils/
        ├── convertXp.js    # XP unit conversion (bytes → KB/MB)
        ├── formatDate.js   # Date formatting helpers
        ├── getRank.js      # Level → rank label mapping
        └── toast.js        # Toast notification utility
```

---

## Tech Stack

- **Vanilla JavaScript** (ES Modules, no framework)
- **HTML5 / CSS3**
- **SVG** for all graphs
- **GraphQL** via `fetch` (POST requests)
- **JWT** for authentication

---

## Authentication Flow

1. User enters `username:password` or `email:password`
2. Credentials are Base64-encoded and sent to the signin endpoint with `Basic` auth
3. A JWT is returned and stored in `localStorage`
4. All GraphQL queries use the JWT via `Bearer` authentication
5. The JWT payload is decoded to extract the authenticated user's ID

```
POST https://learn.zone01oujda.ma/api/auth/signin
Authorization: Basic base64(credentials)
```

```
POST https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql
Authorization: Bearer <jwt>
```

---

## GraphQL Queries Used

The app uses three types of GraphQL querying as required:

### 1. Normal Query
```graphql
{
  user {
    id
    login
  }
}
```

### 2. Query with Arguments
```graphql
{
  transaction(where: { userId: { _eq: $userId }, type: { _eq: "xp" } }) {
    amount
    createdAt
    path
  }
}
```

### 3. Nested Query
```graphql
{
  result {
    id
    grade
    user {
      id
      login
    }
  }
}
```

---

## Statistics Graphs (SVG)

Two main graphs are generated using raw SVG:

### 1. XP Progress Over Time
A line chart plotting cumulative XP earned across time, showing your growth throughout the curriculum.

### 2. Pass / Fail Ratio
A donut/pie chart showing the ratio of passed vs failed projects/exercises.

> Both graphs are built without any external charting library — pure SVG with JavaScript-driven data binding.

---

## Rank System

| Level Range | Rank |
|-------------|------|
| 0 – 9 | Aspiring developer |
| 10 – 19 | Beginner developer |
| 20 – 29 | Apprentice developer |
| 30 – 39 | Assistant developer |
| 40 – 49 | Basic developer |
| 50 – 54 | Junior developer |
| 55 – 59 | Confirmed developer |
| 60 | Full-Stack developer |

---

## Getting Started

### Prerequisites
- A modern browser (Chrome, Firefox, Edge)
- A valid Zone01 Oujda account

### Usage

Visit 🔗 [https://graphql-z01.netlify.app](https://graphql-z01.netlify.app) and log in using your Zone01 Oujda credentials:
- `username` + password
- or `email` + password

---

## Hosting

This project is hosted on **Netlify**: [https://graphql-z01.netlify.app](https://graphql-z01.netlify.app)

---

## Error Handling

- Invalid credentials → toast error message displayed
- Network failures → caught and shown to user
- Expired JWT → user is redirected to login

---

## Author

**[mohammed el ghamari]**
Zone01 Oujda — `[melghama]`