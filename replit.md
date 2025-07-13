# Personal Links Site

## Overview

This is a personal portfolio website showcasing Roi Shikler's professional links, projects, and achievements. The site features an interactive profile page with social media links, project showcases, and an AI-powered chatbot for visitor engagement.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend concerns:

- **Frontend**: React-based SPA built with Vite
- **Backend**: Express.js server with API routes
- **Database**: Drizzle ORM with Neon Database (PostgreSQL) support
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Animations**: Framer Motion for smooth UI transitions

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool for fast development and optimized production builds
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom theme configuration
- **Wouter** for lightweight client-side routing
- **Framer Motion** for declarative animations and page transitions

### Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** for database operations with schema validation
- **OpenAI Integration** for the interactive chatbot functionality
- **Session Management** with in-memory storage (development) and PostgreSQL sessions (production)
- **Request Rate Limiting** implemented for the OpenAI API (200 requests/day)

### UI/UX Features
- **Responsive Design** with mobile-first approach
- **Custom Cowboy Hat Cursor** for brand personality
- **Interactive Chatbot** with suggested questions and usage tracking
- **Project Carousel** showcasing key achievements
- **Gradient Backgrounds** and smooth animations throughout

## Data Flow

1. **Static Content**: Profile information and project data are embedded in components
2. **Chatbot Interactions**: 
   - User messages sent to `/api/chat` endpoint
   - OpenAI API processes requests with rate limiting
   - Responses include suggested follow-up questions
   - Usage tracking prevents API quota exhaustion
3. **Image Assets**: Hosted on GitHub raw content for reliable CDN delivery

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: Database connectivity
- **OpenAI**: AI chatbot functionality
- **@radix-ui/***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library

### Development Tools
- **Vite**: Build tooling and development server
- **TypeScript**: Type checking and developer experience
- **ESBuild**: Fast bundling for production
- **Drizzle Kit**: Database schema management

### Design System
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible components
- **Custom Theme**: Vibrant color scheme with blue primary color

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

- **Development**: `npm run dev` starts both Vite dev server and Express backend
- **Production Build**: `npm run build` creates optimized client bundle and server bundle
- **Production Start**: `npm start` serves the built application
- **Database**: Drizzle push command for schema deployment

### Environment Configuration
- Development and production modes supported
- Environment variables for OpenAI API key and database connection
- Replit-specific plugins for development experience

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```