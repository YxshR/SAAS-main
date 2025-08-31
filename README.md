# SAAS

# AI Summarizer - Full Stack SaaS Application

A comprehensive AI-powered content summarization platform built with modern web technologies. This application allows users to upload various content types (YouTube videos, articles, documents) and receive intelligent summaries with interactive chat capabilities.

## 🚀 Features

### Core Functionality
- **Multi-format Content Processing**: Support for YouTube videos, articles, and document uploads
- **AI-Powered Summarization**: Generate short summaries, detailed analysis, and key points
- **Interactive Chat**: Chat with your content using AI for deeper insights
- **Real-time Processing**: Live updates and progress tracking during content analysis
- **Export Options**: Export summaries in PDF, Word, and text formats

### User Management
- **Authentication System**: Secure login/registration with JWT tokens
- **User Profiles**: Comprehensive profile management with avatar uploads
- **Phone Verification**: Two-factor authentication support
- **Subscription Management**: Free and Premium tier support

### Subscription & Billing
- **Flexible Plans**: Free (5 requests/month) and Premium (100 requests/month)
- **Payment Integration**: Razorpay and Stripe payment processing
- **Usage Tracking**: Real-time monitoring of API usage and limits
- **Billing History**: Complete transaction history with invoice downloads
- **Credit System**: Additional token purchases for extended usage

### Advanced Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant with screen reader support
- **Performance Optimized**: Code splitting, lazy loading, and caching
- **SEO Optimized**: Meta tags, structured data, and sitemap generation
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🏗️ Architecture

### Frontend (Next.js 14)
```
frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── chat/              # Chat interface
│   │   ├── dashboard/         # User dashboard
│   │   ├── profile/           # User profile management
│   │   ├── subscription/      # Billing and plans
│   │   ├── summary/           # Content summaries
│   │   └── ...
│   ├── components/            # Reusable UI components
│   │   ├── features/          # Feature-specific components
│   │   ├── layout/            # Layout components
│   │   ├── navigation/        # Navigation components
│   │   ├── profile/           # Profile components
│   │   ├── subscription/      # Subscription components
│   │   └── ui/                # Base UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and configurations
│   │   ├── animations/        # Framer Motion animations
│   │   ├── accessibility/     # A11y utilities
│   │   └── hooks/             # Utility hooks
│   ├── providers/             # Context providers
│   ├── store/                 # Zustand state management
│   └── types/                 # TypeScript type definitions
```

### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── middleware/            # Express middleware
│   ├── routes/                # API route handlers
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   └── server.ts              # Main server file
├── logs/                      # Application logs
└── dist/                      # Compiled JavaScript
```

### Admin Panel (Next.js 14)
```
admin-panel/
├── src/
│   ├── app/                   # Admin interface pages
│   ├── components/            # Admin-specific components
│   ├── hooks/                 # Admin hooks
│   ├── lib/                   # Admin utilities
│   ├── providers/             # Admin providers
│   ├── store/                 # Admin state management
│   └── types/                 # Admin type definitions
```

## 🛠️ Technology Stack

### Frontend Technologies
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT tokens
- **Payment Processing**: Razorpay, Stripe
- **File Processing**: Multer
- **Logging**: Winston
- **Development**: Nodemon, ts-node

### Development Tools
- **Testing**: Jest, Playwright, Testing Library
- **Linting**: ESLint
- **Code Quality**: Prettier
- **Performance**: Lighthouse, Web Vitals
- **Accessibility**: Axe-core
- **Bundle Analysis**: Next.js Bundle Analyzer

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SAAS-main
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables in .env:
# - Database connection
# - JWT secrets
# - Payment gateway keys
# - API keys

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create environment file
cp .env.example .env.local

# Configure your environment variables:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Start development server
npm run dev
```

### 4. Admin Panel Setup (Optional)
```bash
cd ../admin-panel
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
DATABASE_URL=your_database_url

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# File Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_region
```

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# SEO
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
NEXT_PUBLIC_BING_VERIFICATION=your_bing_verification
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### Backend Deployment (Railway/Heroku)
```bash
# For Railway
railway login
railway init
railway up

# For Heroku
heroku create your-app-name
git push heroku main
```

### Environment Setup for Production
1. Update all environment variables for production
2. Configure domain names and CORS settings
3. Set up SSL certificates
4. Configure CDN for static assets
5. Set up monitoring and logging

## 📱 Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run test         # Run Jest tests
npm run test:e2e     # Run Playwright tests
npm run analyze      # Bundle analysis
```

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run build        # Compile TypeScript
npm run lint         # Run ESLint
npm run test         # Run tests
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-phone` - Phone verification

### Content Processing
- `POST /api/content/upload` - Upload content for processing
- `GET /api/content/:id` - Get processed content
- `POST /api/content/youtube` - Process YouTube URL
- `POST /api/content/article` - Process article URL

### Summaries
- `GET /api/summaries` - Get user summaries
- `GET /api/summaries/:id` - Get specific summary
- `POST /api/summaries/:id/export` - Export summary
- `DELETE /api/summaries/:id` - Delete summary

### Chat
- `POST /api/chat/sessions` - Create chat session
- `GET /api/chat/sessions/:id` - Get chat session
- `POST /api/chat/sessions/:id/messages` - Send message
- `GET /api/chat/sessions/:id/messages` - Get messages

### Subscriptions
- `GET /api/subscriptions/plans` - Get available plans
- `POST /api/subscriptions/subscribe` - Subscribe to plan
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/subscriptions/usage` - Get usage statistics

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/webhook` - Payment webhook

## 🎨 UI Components

### Base Components
- **Button**: Customizable button with variants
- **Input**: Form input with validation
- **Modal**: Accessible modal dialogs
- **Toast**: Notification system
- **Loading**: Loading states and spinners
- **Error Boundary**: Error handling wrapper

### Feature Components
- **Chat Interface**: Real-time chat with AI
- **Document Preview**: Content preview with metadata
- **Summary Cards**: Structured summary display
- **Payment Form**: Secure payment processing
- **Usage Tracking**: Visual usage statistics
- **Subscription Plans**: Plan comparison and selection

### Layout Components
- **Header**: Navigation and user menu
- **Sidebar**: Collapsible navigation sidebar
- **Footer**: Site footer with links
- **Main Layout**: Responsive layout wrapper

## 🔍 Key Features Explained

### Content Processing Pipeline
1. **Input Validation**: Validate URLs and file uploads
2. **Content Extraction**: Extract text from various sources
3. **AI Processing**: Generate summaries using AI models
4. **Storage**: Save processed content and summaries
5. **Delivery**: Serve content through API endpoints

### Authentication Flow
1. **Registration**: Email/password with validation
2. **Login**: JWT token generation
3. **Token Refresh**: Automatic token renewal
4. **Phone Verification**: Optional 2FA setup
5. **Session Management**: Secure session handling

### Subscription System
1. **Plan Selection**: Free vs Premium tiers
2. **Payment Processing**: Razorpay/Stripe integration
3. **Usage Tracking**: Real-time limit monitoring
4. **Billing**: Automated billing and invoicing
5. **Upgrades/Downgrades**: Seamless plan changes

### Chat System
1. **Session Creation**: Link chat to content
2. **Message Processing**: AI-powered responses
3. **Context Awareness**: Reference original content
4. **Citation System**: Source attribution
5. **History Management**: Persistent chat history

## 🧪 Testing

### Frontend Testing
```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Accessibility Tests
npm run test:a11y

# Performance Tests
npm run lighthouse
```

### Backend Testing
```bash
# API Tests
npm run test

# Integration Tests
npm run test:integration

# Load Tests
npm run test:load
```

## 📊 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Aggressive caching strategies
- **Bundle Analysis**: Regular bundle size monitoring
- **Web Vitals**: Core Web Vitals optimization

### Backend Optimizations
- **Response Caching**: Redis-based caching
- **Database Optimization**: Query optimization
- **Rate Limiting**: API rate limiting
- **Compression**: Gzip compression
- **CDN Integration**: Static asset delivery

## 🔒 Security Features

### Frontend Security
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based protection
- **Secure Headers**: Security headers implementation
- **Input Validation**: Client-side validation
- **Authentication**: Secure token handling

### Backend Security
- **JWT Security**: Secure token implementation
- **Rate Limiting**: Brute force protection
- **Input Sanitization**: SQL injection prevention
- **CORS Configuration**: Proper CORS setup
- **Helmet Integration**: Security headers

## 🌐 Accessibility

### WCAG Compliance
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliance
- **Focus Management**: Proper focus handling
- **Semantic HTML**: Proper HTML structure

### Testing Tools
- **Axe-core**: Automated accessibility testing
- **Lighthouse**: Accessibility auditing
- **Screen Readers**: Manual testing support
- **Keyboard Testing**: Navigation verification

## 📈 Monitoring & Analytics

### Performance Monitoring
- **Web Vitals**: Core performance metrics
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: Usage pattern analysis
- **API Monitoring**: Endpoint performance tracking

### Business Metrics
- **User Engagement**: Feature usage tracking
- **Conversion Rates**: Subscription conversions
- **Revenue Tracking**: Payment and billing metrics
- **Support Metrics**: User support analytics

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format
- **Code Reviews**: Mandatory peer reviews

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Documentation**: Available at `/api/docs`
- **Component Storybook**: UI component documentation
- **User Guide**: End-user documentation

### Getting Help
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Email**: support@aisummarizer.com
- **Discord**: Community Discord server

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile app development
- [ ] Advanced AI models integration
- [ ] Team collaboration features
- [ ] API for third-party integrations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Voice input/output capabilities
- [ ] Advanced export formats

### Technical Improvements
- [ ] Microservices architecture
- [ ] GraphQL API implementation
- [ ] Real-time collaboration
- [ ] Advanced caching strategies
- [ ] Machine learning model training
- [ ] Advanced security features

---

## 📞 Contact

**Project Maintainer**: [Your Name]
**Email**: [your.email@example.com]
**Website**: [https://aisummarizer.com](https://aisummarizer.com)
**GitHub**: [https://github.com/yourusername/ai-summarizer](https://github.com/yourusername/ai-summarizer)

---

*Built with ❤️ using Next.js, TypeScript, and modern web technologies.*
