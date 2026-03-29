# Smart Cafeteria Buddy

## Overview

Smart Cafeteria Buddy is an educational web application designed for elementary school students to build healthy eating habits and basic money awareness. Students track their cafeteria food choices, earn points and badges for healthy selections, and monitor their spending against a monthly budget. The app uses gamification (points, badges, achievements) to encourage healthy eating without restriction, focusing on education and positive reinforcement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom kid-friendly theme (bright, cheerful colors)
- **Build Tool**: Vite with React plugin

The frontend follows a page-based architecture with reusable components:
- Pages: Dashboard, FoodSelection, Badges, Spending
- Components: Food cards, badge displays, spending trackers, alerts

### Backend Architecture
- **Framework**: Express.js 5.x with TypeScript
- **Server**: HTTP server with Vite middleware for development
- **API Design**: RESTful JSON API at `/api/*` endpoints
- **Data Storage**: In-memory storage (IStorage interface) with TypeScript types

Key API endpoints:
- `GET /api/dashboard` - Student overview with stats, badges, alerts
- `GET /api/foods` - Available food items
- `POST /api/meals` - Record food selection
- `GET /api/badges` - Badge progress
- `GET /api/spending` - Monthly spending data

### Data Model
Defined in `shared/schema.ts` using Zod for validation:
- **Student**: Profile with points, budget, spending
- **FoodItem**: Cafeteria items with category, price, points, health status
- **MealRecord**: Student food selections with date and meal type
- **Badge**: Achievement definitions with requirements
- **StudentBadge**: Earned badges per student

### Build System
- Development: Vite dev server with HMR
- Production: Custom build script using esbuild for server, Vite for client
- Output: `dist/` directory with compiled server and static client files

## External Dependencies

### Database
- **Drizzle ORM**: Configured for PostgreSQL (`drizzle.config.ts`)
- **PostgreSQL**: Connection via `DATABASE_URL` environment variable
- **Note**: Currently using in-memory storage; database schema exists but storage implementation uses local arrays

### UI Framework
- **Radix UI**: Accessible primitive components (dialogs, menus, tooltips)
- **shadcn/ui**: Pre-styled component collection
- **Lucide React**: Icon library

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner (development only)
- **TypeScript**: Strict mode with path aliases (@/, @shared/)

### Session Management
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)
- **express-session**: Session middleware support