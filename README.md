# Patient Directory - Next.js Application

## Overview
A comprehensive patient directory application built with Next.js, TypeScript, and TailwindCSS that provides dual-view data presentation with advanced filtering, searching, and pagination capabilities.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Lucide React (icons)
- **State Management**: React Hooks (useState, useEffect, useCallback)

## Features

### Core Functionality
- 🔍 **Advanced Search**: Debounced search across patient names, IDs, contact info, and medical issues
- 🏷️ **Smart Filtering**: Filter by medical conditions with visual tag management
- 📊 **Multiple Sort Options**: Sort by name, age, or patient ID (ascending/descending)
- 📄 **Pagination**: Efficient pagination with page navigation
- 👀 **Dual Views**: Switch between card-based and table-based layouts

### Enhanced Features
- 🌙 **Dark Mode**: Complete dark/light theme support
- ⚡ **Performance Optimized**: Debounced search, memoized callbacks
- 🎨 **Responsive Design**: Mobile-friendly interface
- 🔄 **Error Handling**: Comprehensive error states with retry functionality
- 💫 **Loading States**: Skeleton loaders and smooth transitions

## API Architecture

### Local API Endpoint: `/api/data`

**Supported Query Parameters:**
```
GET /api/data?page=1&limit=12&search=john&sortBy=patient_name&sortOrder=asc&medicalIssue=fever,headache
```

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `search`: Search query across multiple fields
- `sortBy`: Field to sort by (`patient_name`, `age`, `patient_id`)
- `sortOrder`: Sort direction (`asc`, `desc`)
- `medicalIssue`: Comma-separated list of medical conditions

**Response Format:**
```json
{
  "data": [/* patient objects */],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 120,
    "itemsPerPage": 12,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd patient-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add the data file**
   - Place your `data.json` file in the project root or `public/` directory
   - Update the API route if needed to match your data structure

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/data/
│   │   └── route.ts          # Local API endpoint with full CRUD logic
│   ├── components/
│   │   ├── CardView.tsx      # Card layout component
│   │   ├── TableView.tsx     # Table layout component
│   │   └── PatientDirectory.tsx  # Main component
│   ├── globals.css           # Global styles with dark mode
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── lib/
│   └── MOCK_DATA.json       # Patient data (1000+ records)
└── tailwind.config.js       # Tailwind configuration
```

## Key Implementation Details

### Performance Optimizations
- **Debounced Search**: 300ms delay to reduce API calls
- **Memoized Callbacks**: useCallback for query building
- **Efficient Pagination**: Server-side pagination to handle large datasets
- **Optimistic Updates**: Smooth UI interactions with loading states

### Data Management
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Boundaries**: Graceful error handling with retry mechanisms
- **State Management**: Efficient state updates with proper dependency arrays

### UI/UX Enhancements
- **Skeleton Loading**: Animated placeholders during data fetch
- **Visual Feedback**: Active states, hover effects, and transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Theme Support**: Persistent dark/light mode preference

## Architectural Decisions

### 1. Client-Side Data Fetching
**Decision**: Used `useEffect` with `fetch` for API calls
**Rationale**: Provides fine-grained control over loading states, error handling, and user interactions

### 2. Local API Endpoint
**Decision**: Implemented `/api/data` route handler
**Rationale**: Simulates real-world API integration while processing the provided JSON data

### 3. Component Architecture
**Decision**: Separation between view components (CardView, TableView) and main logic
**Rationale**: Promotes reusability and maintainability

### 4. State Management Strategy
**Decision**: React hooks for state management
**Rationale**: Sufficient for application complexity, avoiding over-engineering

## Future Enhancements

- [ ] Infinite scroll option
- [ ] Export functionality (CSV, PDF)
- [ ] Advanced filtering (date ranges, custom queries)
- [ ] Patient detail modal/page
- [ ] Bulk operations
- [ ] Real-time updates with WebSocket
- [ ] Progressive Web App (PWA) features

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository: [https://github.com/rohitmodi970/figma_design_assignment](https://github.com/rohitmodi970/figma_design_assignment)
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Issues and Support

If you encounter any issues or have questions:

- 🐛 **Report bugs**: [GitHub Issues](https://github.com/rohitmodi970/figma_design_assignment/issues)
- 💡 **Request features**: [GitHub Issues](https://github.com/rohitmodi970/figma_design_assignment/issues)
- 📧 **Contact**: Create an issue on the repository

## Repository Information

- **Repository**: [rohitmodi970/figma_design_assignment](https://github.com/rohitmodi970/figma_design_assignment)
- **Language**: TypeScript 5
- **Framework**: Next.js 15.5.2
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: TailwindCSS 4
- **License**: MIT

## Technology Highlights

This project showcases cutting-edge web development with:
- **Next.js 15.5.2**: Latest App Router features and optimizations
- **React 19**: Latest React features and performance improvements  
- **TailwindCSS 4**: Modern utility-first styling
- **shadcn/ui**: Professional component library built on Radix UI
- **TypeScript 5**: Enhanced type safety and developer experience