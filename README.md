# DevLog 📝

A modern, beautiful web application for developers to track daily work, ideas, and notes. Built with React, TypeScript, and Tailwind CSS.

## Features

- ✨ **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- 🔍 **Powerful Search**: Find entries by keywords, tags, or categories
- 🏷️ **Tags & Categories**: Organize entries with tags and categories
- 📅 **Date Grouping**: Entries automatically grouped by date
- 📊 **Statistics**: Get insights about your logging habits
- 💾 **Local Storage**: All data stored locally in your browser
- 🌙 **Dark Mode**: Built-in dark mode support
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- 🔒 **Security First**: Zero-trust architecture with input validation, CSP headers, and secure storage

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **date-fns** - Date formatting utilities

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/devlog.git
cd devlog
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
devlog/
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Layout.tsx   # Main layout with navigation
│   │   ├── EntryCard.tsx # Entry display component
│   │   └── EntryForm.tsx # Form for adding entries
│   ├── pages/           # Page components
│   │   ├── Home.tsx     # Main entries page
│   │   ├── Search.tsx    # Search page
│   │   └── Stats.tsx     # Statistics page
│   ├── context/         # React Context providers
│   │   └── LogContext.tsx # Global state management
│   ├── utils/           # Utility functions
│   │   └── storage.ts   # LocalStorage management
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts     # Shared types
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .github/             # GitHub workflows
└── package.json         # Dependencies and scripts
```

## Usage

### Adding Entries

1. Click "Add Entry" in the navigation
2. Enter your message
3. Optionally add tags and category
4. Click "Save Entry"

### Viewing Entries

- All entries are displayed on the home page
- Entries are automatically grouped by date
- Click the X button to delete an entry

### Searching

- Use the Search page to find entries by keyword
- Filter by tags or categories
- Search is case-insensitive

### Statistics

- View your logging statistics on the Stats page
- See most used tags and categories
- Track your progress over time

## Security

DevLog implements a **zero-trust security architecture** with comprehensive security measures:

- ✅ **Input Validation & Sanitization** - All user inputs are validated and sanitized
- ✅ **Content Security Policy (CSP)** - Strict CSP headers prevent XSS attacks
- ✅ **Secure Headers** - X-Frame-Options, X-Content-Type-Options, and more
- ✅ **Cryptographically Secure IDs** - Uses Web Crypto API for secure ID generation
- ✅ **Rate Limiting** - Client-side rate limiting prevents abuse
- ✅ **Storage Quota Management** - Prevents DoS attacks through storage limits
- ✅ **Dependency Auditing** - Regular security audits with `npm audit`

See [SECURITY.md](SECURITY.md) for detailed security information.

### Security Commands

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check security level
npm run security:check
```

## Future Backend Integration

This project is designed to be frontend-first. Future contributors will add:

- Node.js/Express backend API
- Database integration (PostgreSQL/MongoDB)
- User authentication
- Cloud sync capabilities
- API endpoints for CRUD operations
- Server-side rate limiting and security

The current implementation uses localStorage with secure validation, making it easy to migrate to a backend API later.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Follow the existing code style
- Write tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created with ❤️ for developers who want to track their journey.

## Acknowledgments

- Built with React and modern web technologies
- Designed for developers, by developers
