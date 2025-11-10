# Triathlon Event Manager

A modern web application for managing triathlon events, built with React, TypeScript, and Vite. This application helps organizers manage participants, races, and results for triathlon events efficiently.

## Features

- 🏃‍♂️ Comprehensive race management
- 👥 Participant registration and tracking
- ⏱️ Race timing and result recording
- 📊 Real-time event statistics
- 🔄 Undo/Redo functionality
- 💾 Persistent data storage using IndexedDB
- 🌓 Dark mode support
- 📱 Responsive design

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- IndexedDB for data persistence

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TrekEllwood/vite-react-ts-triathlon.git
cd vite-react-ts-triathlon
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Local HTTPS (optional)

If you want to use the local HTTPS server (`npm run start`), you must provide your own
localhost certificate and key. Create them locally and place them in the `security/`
directory as `localhost.crt` and `localhost.key`. These files are intentionally ignored
by git and should never be committed.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/     # React components
├── models/         # Data models
├── providers/      # Data providers (IndexedDB, localStorage)
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── viewmodels/    # View models for state management
└── assets/        # Static assets
```

## ESLint Configuration

The project uses a comprehensive ESLint setup with TypeScript support. The configuration can be found in `eslint.config.js`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- UI Components inspired by [shadcn/ui](https://ui.shadcn.com/)
