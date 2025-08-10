# AI-Augmented Prototyping Experiment Toolkit

## Overview

This is a React-based web application designed to help researchers and product teams manage AI prototyping experiments through structured workflows. The application provides four main tools: a Master Experiment Checklist for comprehensive experiment planning, a Blank Experiment Brief for documenting experiment parameters, a Post-Experiment Summary for capturing results and learnings, and a Go/No-Go Checklist for making informed decisions about experiment progression.

The toolkit emphasizes user experience with responsive design that adapts to both desktop and mobile interfaces, local data persistence to prevent data loss, and PDF export capabilities for documentation and sharing purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and better development experience
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui styling system for consistent, accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: React Hook Form for form handling with local component state
- **Data Fetching**: TanStack Query (React Query) for server state management, though currently primarily used for client-side data handling

### Backend Architecture
- **Server Framework**: Express.js with TypeScript running on Node.js
- **Database Integration**: Drizzle ORM configured for PostgreSQL with Neon Database serverless connection
- **Storage Layer**: Dual storage approach with in-memory storage for development and PostgreSQL schema for production
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **Development Setup**: Vite for fast development builds and hot module replacement

### Data Storage Strategy
- **Local Storage**: Browser localStorage for form data persistence across sessions
- **Database Schema**: Minimal user management schema with extensible design for experiment data
- **Data Migration**: Drizzle Kit for database schema management and migrations
- **Backup Strategy**: Local data export via PDF generation for offline access and sharing

### External Dependencies
- **Database**: Neon Database serverless PostgreSQL for scalable data storage
- **PDF Generation**: jsPDF for client-side PDF export functionality
- **Font Assets**: Google Fonts (Inter) for consistent typography
- **Development Tools**: 
  - Replit integration for cloud-based development
  - ESBuild for production bundling
  - Vite plugins for enhanced development experience
- **UI Libraries**: Comprehensive Radix UI ecosystem for accessible components
- **Form Validation**: Zod with Drizzle integration for schema validation
- **Date Handling**: date-fns for date formatting and manipulation