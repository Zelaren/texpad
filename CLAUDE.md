# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TexPad** is a rich text editor application focused on document creation with integrated chart visualization capabilities. Built with modern React stack, it provides a sophisticated editing experience with smart line alignment, inline toolbar, and real-time chart insertion.

### Core Technology Stack
- **Frontend**: React 19.1.1 + TypeScript 5.8.3
- **Build Tool**: Vite 7.1.6 with React plugin
- **Styling**: TailwindCSS 4.1.13 for utility-first CSS
- **Editor**: Quill 2.0.3 for rich text editing capabilities
- **Charts**: @antv/g2 4.2.12 for data visualization
- **State Management**: Zustand 5.0.3
- **Internationalization**: i18next 25.5.2 with React integration

### Key Features
- **Smart Line Alignment**: Intelligent positioning system that handles headers (H1 spans 3 lines, H2 spans 2 lines) and regular text alignment
- **Dynamic Inline Toolbar**: Context-aware formatting toolbar that appears based on mouse position and text selection
- **Chart Integration**: Seamless insertion and editing of data charts within the document
- **Export Functionality**: HTML document export with proper formatting
- **Responsive Design**: Mobile-friendly interface using TailwindCSS

## Development Commands

### Essential Commands
```bash
# Development server with hot reload
npm run dev

# Production build (includes TypeScript compilation)
npm run build

# Code linting and style checking
npm run lint

# Code formatting with Prettier
npm run format

# Check code formatting without fixing
npm run format:check

# Preview production build locally
npm run preview
```

### Type Checking
The project uses strict TypeScript with separate config files:
- `tsconfig.json`: Project references configuration
- `tsconfig.app.json`: Application-specific TypeScript settings
- `tsconfig.node.json`: Build tool configuration

### Code Quality
```bash
# Run TypeScript compiler without emitting files
npx tsc --noEmit

# Check for ESLint violations
npm run lint

# Format code with Prettier
npm run format

# Check code formatting without fixing
npm run format:check
```

## Architecture Overview

### Component Structure
```
src/
├── components/
│   ├── Layout.tsx           # Main application layout with sidebar
│   ├── Sidebar.tsx          # Collapsible navigation sidebar
│   ├── MainContent.tsx      # Core editor container with toolbar logic
│   ├── InlineToolbar.tsx    # Context-aware formatting toolbar
│   ├── AlignmentGuides.tsx  # Visual alignment guides
│   ├── G2ChartComponent.tsx # Chart visualization component
│   └── ErrorBoundary.tsx    # React error boundary for error handling
├── pages/
│   ├── EditorPage.tsx       # Main editor page
│   ├── SettingsPage.tsx     # Application settings
│   └── HistoryPage.tsx      # Document history management
├── hooks/
│   ├── useQuillEditor.ts    # Quill editor instance management
│   └── useLineAlignment.ts  # Smart line positioning system
├── store/
│   └── editorStore.ts       # Zustand state management
├── router/
│   └── index.tsx            # React Router configuration
├── types/
│   ├── chart.ts            # Chart data type definitions
│   └── quill.d.ts          # Quill editor type extensions
└── utils/
    └── ChartBlot.tsx       # Custom Quill blot for chart embedding
```

### Key Architectural Patterns

**State Management**:
- Zustand for global application state (toolbar visibility, current line tracking, document title)
- React hooks for local component state
- Refs for persistent editor instances
- React Router for navigation and page routing

**Editor Architecture**:
- Quill editor with custom modules and blots
- Custom ChartBlot for embedding charts in content
- Toolbar integration with format selection

**Line Alignment System**:
- Sophisticated line mapping that accounts for header spanning
- Dynamic toolbar positioning based on content structure
- Mouse position tracking for context-aware UI

### Data Flow
1. **Editor State**: Managed through Quill instance with React ref
2. **Toolbar State**: Controlled by mouse position and content analysis via Zustand store
3. **Chart Data**: Embedded directly in editor content via custom blots
4. **Line Information**: Calculated in real-time based on editor content
5. **Navigation**: Handled by React Router with routes for editor, settings, and history
6. **Error Handling**: Wrapped in ErrorBoundary component for graceful error recovery

## Development Guidelines

### Code Conventions
- **Components**: PascalCase (e.g., `MainContent`, `InlineToolbar`)
- **Hooks**: camelCase prefixed with `use` (e.g., `useQuillEditor`)
- **Types**: PascalCase interfaces (e.g., `ChartData`, `LineInfo`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `LINE_HEIGHT_PX`)
- **Comments**: Chinese comments with detailed explanations for complex logic

### TypeScript Usage
- Strict type checking enabled
- All components and functions require proper type definitions
- Use interfaces for object shapes, types for unions and utilities
- Generic types used where appropriate for reusability

### React Patterns
- Function components with hooks
- Custom refs for editor instance management
- Effect hooks for side effects and cleanup
- Callback hooks for event handlers with memoization

### Performance Considerations
- Line alignment calculations are memoized to prevent unnecessary recalculations
- Toolbar rendering is optimized with conditional display
- Chart components are only rendered when data changes
- Efficient event handling with proper cleanup

## Testing and Quality Assurance

### Required Checks Before Commit
1. **Type Safety**: `npm run build` must complete without errors
2. **Code Quality**: `npm run lint` must pass with zero warnings
3. **Code Formatting**: `npm run format:check` must pass without issues
4. **Manual Testing**: Verify new features work correctly in development environment
5. **Regression Testing**: Ensure existing functionality remains intact

### Common Issues to Watch
- Type mismatches in chart data structures
- Line alignment calculation edge cases
- Toolbar positioning in complex document structures
- Chart rendering and interaction consistency

## Dependencies and External Libraries

### Critical Dependencies
- **react** & **react-dom**: Core UI framework
- **quill**: Rich text editing engine
- **@antv/g2**: Chart visualization library
- **zustand**: Lightweight state management
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **typescript**: Type safety and tooling
- **vite**: Modern build tool
- **eslint**: Code quality and consistency
- **@types/react**: React type definitions

## Build and Deployment

### Build Process
1. TypeScript compilation with strict type checking
2. Vite bundling with React optimization
3. Asset optimization and minification
4. Production-ready output in `dist/` directory

### Environment Considerations
- Development: Hot module replacement with Vite dev server
- Production: Optimized builds with tree-shaking and minification
- Testing: Development server for manual verification