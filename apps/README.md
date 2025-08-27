# One-Click Games Apps

This directory contains all the game examples for the One-Click Games project.

## Structure

Each game should be in its own directory with the following structure:

```
apps/
├── index.html              # Auto-generated homepage showcasing all games
├── README.md              # This file
└── game-name/             # Individual game directory
    ├── index.html         # Game HTML file
    └── game.json          # Game metadata
```

## Game Metadata (game.json)

Each game must include a `game.json` file with the following structure:

```json
{
  "title": "Game Title",
  "description": "Brief description of the game",
  "author": "Author Name",
  "version": "1.0.0",
  "tags": ["tag1", "tag2", "tag3"],
  "difficulty": "easy|medium|hard",
  "playTime": "estimated play time"
}
```

## Building the Homepage

The homepage (`index.html`) is automatically generated from the game metadata. To update it:

```bash
npm run build:demo
```

This script:
1. Scans all subdirectories in `apps/`
2. Reads each `game.json` file
3. Updates the homepage with the latest game information

## Adding a New Game

1. Create a new directory: `apps/your-game-name/`
2. Add `index.html` with your game
3. Add `game.json` with metadata
4. Run `npm run build:demo` to update the homepage
5. Commit and push - GitHub Actions will deploy automatically

## Local Development

To test locally:

```bash
cd apps
python3 -m http.server 8000
```

Then visit:
- Homepage: http://localhost:8000/
- Individual game: http://localhost:8000/your-game-name/

## Deployment

The apps are automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch. The workflow:

1. Installs dependencies
2. Runs `npm run build:demo`
3. Deploys the `apps/` directory to GitHub Pages

## Available Games

- **Hello World** (`hello-world/`) - A simple interactive demo game