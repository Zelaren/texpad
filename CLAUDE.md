# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Rich Text and Chart Editor** built with React + TypeScript + Vite. "Texpad" is a sophisticated document editing tool that combines rich text editing with dynamic chart generation through AI integration. The app features QuillJS for rich text editing, AntV/G2 for chart visualization, and OpenAI integration for intelligent content generation.

## Development Commands

### Core Development Workflow
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

### Build Process
The build process automatically runs TypeScript compilation (`tsc -b`) before Vite build, ensuring type safety before bundling.

## Technology Stack

### Core Dependencies
- **React 19.1.1** - Latest React version with modern features
- **React DOM 19.1.1** - DOM rendering for React
- **TypeScript ~5.8.3** - Static type checking
- **Vite 7.1.6** - Fast build tool and dev server

### Rich Text & Chart Libraries
- **Quill 2.0.3** - Rich text editor with custom blots support
- **AntV/G2 4.2.12** - Chart visualization library
- **OpenAI 5.21.0** - AI integration for chart data generation

### UI & Routing
- **TailwindCSS 4.1.13** - Utility-first CSS framework
- **React Router DOM 7.5.0** - Client-side routing
- **React Virtuoso 4.12.6** - Virtualized list components
- **Zustand 5.0.3** - State management
- **i18next 25.5.2** - Internationalization

### Development Tools
- **ESLint 9.35.0** - Code linting with modern flat config
- **@vitejs/plugin-react 5.0.2** - React plugin for Vite (uses Babel for Fast Refresh)
- **TypeScript ESLint 8.43.0** - TypeScript-specific ESLint rules

## Project Architecture

### Component Structure
```
src/
├── components/
│   ├── MainContent.tsx     # Main editor component with QuillJS integration
│   └── G2ChartComponent.tsx # Chart rendering component
├── utils/
│   └── ChartBlot.tsx       # Custom Quill blot for embedding charts
├── App.tsx                 # Main app with header and export functionality
├── main.tsx                # Application entry point
└── index.css               # Global styles with TailwindCSS
```

### Key Architecture Components

#### QuillJS Custom Blot System
- **ChartBlot** (`src/utils/ChartBlot.tsx`): Custom Quill blot extending `BlockEmbed` for chart embedding
- **Chart Integration**: Seamless integration between QuillJS editor and G2 chart components
- **Dynamic Rendering**: Charts are dynamically rendered within the rich text content

#### AI-Powered Content Generation
- **OpenAI Integration**: GPT-3.5-turbo for generating chart data from natural language prompts
- **Structured Output**: JSON response format for direct G2 chart configuration
- **Error Handling**: Robust parsing and fallback mechanisms for AI responses

#### Rich Text Editor Features
- **Custom Toolbar**: Context-sensitive formatting toolbar
- **Format Support**: Headers (H1-H3), bold, italic, ordered/unordered lists
- **Line Alignment**: Visual alignment guides with 30px line height
- **Selection Management**: Advanced cursor and selection handling

## Development Patterns

### State Management
- **Ref-based Quill Instance**: Shared Quill instance passed between components via React refs
- **Local State**: useState for UI state (toolbar visibility, current line tracking)
- **Effect Hooks**: useEffect for Quill initialization and event listener setup

### Custom Quill Extensions
- **Blot Registration**: Custom blots registered before Quill initialization
- **Format Handling**: Custom format application with preserved selection state
- **Event Integration**: Selection change listeners for UI updates

### OpenAI Integration Pattern
- **Environment Variables**: API key retrieved from environment
- **Structured Prompts**: System and user messages for consistent chart data generation
- **JSON Response Format**: Enforced JSON output for reliable parsing
- **Error Boundaries**: Try-catch blocks with fallback behavior

## Environment Setup

### Required Environment Variables
- `VITE_OPENAI_API_KEY` - OpenAI API key for chart generation (prefix required for Vite)

### TypeScript Configuration
- **Target**: ES2022 with modern JavaScript features
- **Module**: ESNext with bundler module resolution
- **Strict Mode**: Enabled with additional strict checks
- **JSX**: React-JSX transform (no React import needed)

## Key Features

### Document Management
- **New Document**: Clear editor content (handled in App.tsx header)
- **Export Functionality**: Export to HTML with automatic download
- **Demo Content**: Pre-loaded rich text examples demonstrating all formats

### Chart Generation
- **AI Prompts**: Natural language chart requests converted to G2 configurations
- **Chart Types**: Support for bar charts, line charts, and other G2 chart types
- **Inline Embedding**: Charts embedded directly within rich text content

### User Interface
- **Responsive Layout**: Flexbox-based layout with header and main content
- **Chinese Interface**: Primary interface language is Chinese
- **TailwindCSS Styling**: Utility-first approach with custom component styles

## Important Notes

- **No Dev Server**: Project configured to not auto-start dev server (`不用执行npm run dev`)
- **Chart Data Structure**: G2 charts expect `{ data: [], type: string, xField: string, yField: string }` format
- **Quill Theme**: Uses 'snow' theme with custom toolbar disabled
- **Line Height**: Consistent 30px line height for alignment system
- **Memory System**: Leverages Serena memory system for development context preservation