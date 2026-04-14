# MobileBank Pro

[![CI Pipeline](https://github.com/jenniferbwamhynes-hash/mobilebank-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/jenniferbwamhynes-hash/mobilebank-pro/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/jenniferbwamhynes-hash/mobilebank-pro?include_prereleases)](https://github.com/jenniferbwamhynes-hash/mobilebank-pro/releases)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

A modern mobile banking application built with React Native for iOS and Android.

**Status:** 🚧 In Development - v1.0.0-beta released for internal testing

## Features

- 🔐 Biometric authentication (Face ID / Touch ID)
- 💰 Real-time account balance and transaction history
- 💸 Instant money transfers between accounts
- 🔔 Push notifications for account activity
- 📱 Cross-platform support (iOS & Android)

## Tech Stack

- **Mobile:** React Native, TypeScript, Redux Toolkit
- **Backend:** Node.js, Express, PostgreSQL
- **Authentication:** OAuth2, JWT
- **Cloud:** AWS (ECS, RDS)
- **Notifications:** Firebase Cloud Messaging

## Getting Started

### Prerequisites

- Node.js 20 LTS
- npm or yarn
- Xcode 14+ (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Clone the repository
git clone https://github.com/jenniferbwamhynes-hash/mobilebank-pro.git
cd mobilebank-pro

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### Running the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

### Running the Backend

```bash
cd server
npm install
npm run dev
```

## Project Structure

```
mobilebank-pro/
├── src/                  # Mobile app source
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API service calls
│   ├── store/            # Redux store
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript type definitions
├── server/               # Backend API
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── models/           # Database models
│   ├── middleware/       # Express middleware
│   └── config/           # Configuration files
└── tests/                # Test files
    ├── unit/             # Unit tests
    └── integration/      # Integration tests
```

## Development

### Code Style

- ESLint for linting
- Prettier for formatting
- TypeScript for type safety

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

### Linting

```bash
npm run lint
npm run format
```

## CI/CD

GitHub Actions workflow automatically:
- Runs linting and tests
- Builds the application
- Deploys to staging (on develop branch)
- Deploys to production (on main branch)

## Project Links

- **Jira Epic:** [SCRUM-7](https://jenniferbwamhynes.atlassian.net/browse/SCRUM-7)
- **Confluence Docs:** [MobileBank Pro Documentation](https://jenniferbwamhynes-1776180560004.atlassian.net/wiki/spaces/SD)
- **Slack Channel:** #mobilebank-pro

## Team

- **Product Owner:** Jennifer Hynes
- **Tech Lead:** Development Team
- **Developers:** Mobile & Backend Teams
- **QA:** Quality Assurance Team

## License

Proprietary - Internal use only
