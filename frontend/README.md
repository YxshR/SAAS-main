# AI Summarizer Frontend

This is the frontend application for the AI-powered YouTube and web article summarization platform built with Next.js 14.

## Features

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for styling and responsive design
- **React Query** for server state management
- **Zustand** for client state management
- **Framer Motion** for animations (ready to use)
- **Backend Switching** - Automatically detects and connects to active backend (Node.js or Rust)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components (Header, Footer, etc.)
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and configurations
│   ├── api.ts           # API client with backend switching
│   ├── constants.ts     # App constants
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Utility functions
├── providers/            # React context providers
│   └── query-provider.tsx # React Query provider
└── store/               # Zustand stores
    ├── app.ts          # App state (theme, backend status, etc.)
    └── auth.ts         # Authentication state
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Backend Integration

The frontend automatically detects which backend is running:

- **Node.js Backend**: `http://localhost:8000`
- **Rust Backend**: `http://localhost:8001`

The API client (`src/lib/api.ts`) handles backend switching automatically by checking health endpoints.

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_NODEJS_API_URL=http://localhost:8000
NEXT_PUBLIC_RUST_API_URL=http://localhost:8001
NEXT_PUBLIC_BACKEND_TYPE=nodejs
```

## State Management

### Authentication State (Zustand)
- User authentication status
- User profile data
- JWT tokens (persisted in localStorage)

### App State (Zustand)
- Active backend selection
- Backend health status
- UI state (theme, sidebar, etc.)

### Server State (React Query)
- API data fetching and caching
- Background refetching
- Optimistic updates

## Styling

- **Tailwind CSS** for utility-first styling
- **Responsive design** with mobile-first approach
- **Custom components** in `src/components/ui/`
- **Consistent design system** with reusable components

## Next Steps

This frontend is ready for integration with the backend APIs. The next tasks in the implementation plan will:

1. Build the backend services (Node.js and Rust)
2. Implement authentication and user management
3. Add content processing features
4. Integrate payment systems
5. Add chat and TTS functionality

## Development Notes

- All components use TypeScript for type safety
- ESLint and Prettier are configured for code quality
- The build process includes type checking and linting
- Components are organized by feature and reusability
- State management is split between client state (Zustand) and server state (React Query)