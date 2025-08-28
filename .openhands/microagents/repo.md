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

## Local Dev Server for apps/

A minimal Node server is included to serve the repo in a way compatible with GitHub Pages, so apps/ can import from ../dist/src/index.js without changes.

Quick start:
- Install deps and build once:
  - npm ci
  - npm run build
- Populate the apps homepage (optional):
  - npm run build:demo
- Start the server on 0.0.0.0:12000:
  - npm run serve:apps

Behavior:
- / maps to apps/index.html (apps homepage)
- /dino-jump/ and /hello-world/ load those apps from apps/
- /dist/* serves built files from the repo’s dist/
- CORS is open and iframe embedding is allowed for easy embedding

Remote access:
- The server binds to 0.0.0.0; in this environment use the provided host:
  - https://work-1-pcnqinjkcisigsbh.prod-runtime.all-hands.dev:12000/


