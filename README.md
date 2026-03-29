# School Cafe Buddy

A fun, gamified cafeteria companion app for elementary school students. Kids track their food choices, earn points and badges for healthy eating, and learn basic money management — all in a colorful, kid-friendly interface.

![School Cafe Buddy](https://img.shields.io/badge/built%20for-elementary%20kids-brightgreen) ![Stack](https://img.shields.io/badge/stack-React%20%2B%20Express-blue) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

### Food Selection & Cart
- Browse cafeteria items by category (Fruits, Vegetables, Main Foods, Snacks, Drinks)
- Add items to a cart with live item list and remove option
- Food cards show "In Cart" state with a green checkmark when selected

### Healthy Choice Recommendations
- When a student picks an unhealthy item (chips, soda, candy), a friendly popup suggests healthier alternatives
- Selectable alternative badges — clicking **Add to Cart** swaps the unhealthy item for the chosen alternative

### Kid-Friendly Checkout
- Shows the student's monthly wallet: budget, already spent, and available balance
- Displays the full order with item prices
- Big, clear "money left after buying" number — green if good, red if over budget
- Two-color budget bar: orange for already spent, green/yellow/red for this order
- Points earned displayed prominently

### Success Celebration Screen
- Full-screen animated confetti explosion after every successful purchase
- Bouncing gold star with points earned
- Order receipt with each item's points contribution
- Newly unlocked badges highlighted with a purple card
- "Next badge" progress bar showing how many points remain

### Points & Badges
- Earn points for every healthy food choice
- 6 badges to unlock: Veggie Hero, Fruit Explorer, Balanced Plate Star, Hydration Champion, Smart Saver, Super Star
- Badge progress tracked across sessions

### Spending Tracker
- Monthly budget overview with progress bar
- Weekly spending and daily average
- Spending breakdown by food category
- Smart alerts when approaching budget limit

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Routing | Wouter |
| Server State | TanStack React Query |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Backend | Express.js 5 + TypeScript |
| Build | Vite (client) + esbuild (server) |
| Deployment | Vercel (serverless) |

---

## Project Structure

```
school-cafe-buddy/
├── api/
│   └── index.ts          # Vercel serverless API handler
├── client/
│   └── src/
│       ├── components/
│       │   ├── CheckoutDialog.tsx     # Kid-friendly payment screen
│       │   ├── SuccessDialog.tsx      # Celebration + confetti
│       │   ├── RecommendationPopup.tsx
│       │   ├── FoodCard.tsx
│       │   └── ...
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   ├── FoodSelection.tsx
│       │   ├── Badges.tsx
│       │   └── Spending.tsx
│       └── lib/
│           └── data.ts               # Food items, badges, recommendations
├── server/
│   └── index.ts          # Express dev server
├── shared/
│   └── schema.ts         # Shared TypeScript types + Zod schemas
└── vercel.json           # Vercel deployment config
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Run Locally

```bash
# Install dependencies
npm install

# Start development server (defaults to port 5000, use PORT to override)
PORT=3000 npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Deployment (Vercel)

This project is pre-configured for Vercel:

```bash
npm install -g vercel
vercel
```

The `vercel.json` config sets:
- **Build command**: `vite build`
- **Output directory**: `dist/public`
- **API routes**: `/api/*` → `api/index.ts` serverless function

> **Note:** The app uses in-memory storage — data resets on each serverless cold start. For persistence, connect a PostgreSQL database via `DATABASE_URL` (Drizzle ORM is already configured).

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Student overview, stats, badges, alerts |
| GET | `/api/foods` | All available food items |
| POST | `/api/meals` | Record a food selection |
| GET | `/api/meals` | Meal history |
| GET | `/api/badges` | Badge definitions and earned badges |
| GET | `/api/spending` | Monthly spending breakdown |

---

## Data Model

```ts
FoodItem   { id, name, category, price, isHealthy, points, icon }
Student    { id, name, totalPoints, monthlyBudget, monthlySpent }
MealRecord { id, studentId, foodId, date, mealType }
Badge      { id, name, description, requirement, pointsRequired }
```

---

## License

MIT
