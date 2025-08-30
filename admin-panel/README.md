# AI Summarizer - Admin Panel

This is the administrative dashboard for the AI Summarization Platform, built with Next.js 14 and TypeScript.

## Features

- **Admin Authentication**: Secure login with JWT tokens and role-based access control
- **User Management**: View, edit, and manage user accounts and subscriptions
- **Analytics Dashboard**: Real-time metrics and business intelligence
- **System Monitoring**: Health checks and system status monitoring
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Modern UI**: Clean, professional admin interface with custom components

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom admin theme
- **State Management**: Zustand for client state
- **Data Fetching**: React Query for server state
- **Icons**: Heroicons
- **Charts**: Recharts for analytics visualization

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure your environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AI Summarizer Admin Panel
```

### Development

Run the development server:

```bash
npm run dev
```

The admin panel will be available at [http://localhost:3001](http://localhost:3001)

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
admin-panel/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── dashboard/       # Dashboard page
│   │   ├── users/          # User management
│   │   ├── login/          # Authentication
│   │   └── ...
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Reusable UI components
│   ├── lib/                # Utilities and API client
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript type definitions
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
└── ...config files
```

## Key Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Super Admin)
- Protected routes with permission checking
- Secure token storage and management

### User Management
- View all users with search and filtering
- Edit user profiles and subscription status
- Manage user tokens and limits
- User activity monitoring

### Dashboard Analytics
- Real-time business metrics
- User growth and engagement stats
- Revenue and subscription analytics
- System performance monitoring

### Responsive Design
- Mobile-first responsive design
- Custom Tailwind CSS theme for admin interface
- Consistent design system with reusable components
- Accessible UI components

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `AI Summarizer Admin Panel` |

## API Integration

The admin panel integrates with the backend API for:
- Admin authentication and authorization
- User management operations
- Analytics and reporting data
- System configuration and monitoring

## Security Features

- Secure authentication with JWT tokens
- Role-based access control
- Protected API routes
- Input validation and sanitization
- CSRF protection
- Secure headers and HTTPS enforcement

## Contributing

1. Follow the existing code style and conventions
2. Add TypeScript types for all new components and functions
3. Include proper error handling and loading states
4. Test all new features thoroughly
5. Update documentation as needed

## License

This project is part of the AI Summarization Platform and is proprietary software.