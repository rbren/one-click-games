# One-Click Games Repository

A TypeScript-based game engine and platform for creating simple, interactive browser games.

## Directory Structure

```
├── src/                    # Core engine source code
│   └── index.ts           # Main engine entry point
├── apps/                  # Game applications
│   ├── hello-world/       # Sample game implementation
│   │   ├── game.json     # Game metadata and configuration
│   │   └── index.html    # Game HTML interface
│   └── index.html        # Apps listing page
├── scripts/               # Build and utility scripts
│   └── build-demo.js     # Demo build script
├── test/                  # Test files
│   └── engine.test.ts    # Engine unit tests
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vitest.config.ts      # Testing configuration
└── eslint.config.js      # Linting configuration
```

## Key Features

- TypeScript-based game engine
- JSON-based game configuration
- HTML/browser-based game interface
- Testing with Vitest
- ESLint for code quality


DO NOT RUN `npm test --silent` it will break your terminal
