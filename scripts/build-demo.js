#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APPS_DIR = path.join(__dirname, '..', 'apps');
const TEMPLATE_PATH = path.join(APPS_DIR, 'index.html');
const OUTPUT_PATH = path.join(APPS_DIR, 'index.html');

function scanGames() {
    const games = [];
    
    if (!fs.existsSync(APPS_DIR)) {
        console.log('Apps directory not found');
        return games;
    }
    
    const entries = fs.readdirSync(APPS_DIR, { withFileTypes: true });
    
    for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
            const gameDir = path.join(APPS_DIR, entry.name);
            const gameJsonPath = path.join(gameDir, 'game.json');
            const indexHtmlPath = path.join(gameDir, 'index.html');
            
            // Check if both game.json and index.html exist
            if (fs.existsSync(gameJsonPath) && fs.existsSync(indexHtmlPath)) {
                try {
                    const gameData = JSON.parse(fs.readFileSync(gameJsonPath, 'utf8'));
                    gameData.path = entry.name;
                    games.push(gameData);
                    console.log(`Found game: ${gameData.title}`);
                } catch (error) {
                    console.warn(`Error reading game.json for ${entry.name}:`, error.message);
                }
            }
        }
    }
    
    return games;
}

function generateHomepage(games) {
    // Read the template
    let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    
    // Replace the GAMES_DATA placeholder with actual data
    const gamesDataString = JSON.stringify(games, null, 12);
    template = template.replace(
        /const GAMES_DATA = \[[\s\S]*?\];/,
        `const GAMES_DATA = ${gamesDataString};`
    );
    
    return template;
}

function main() {
    console.log('🎮 Building One-Click Games demo homepage...');
    
    try {
        // Scan for games
        const games = scanGames();
        console.log(`Found ${games.length} games`);
        
        // Generate homepage
        const homepage = generateHomepage(games);
        
        // Write the updated homepage
        fs.writeFileSync(OUTPUT_PATH, homepage, 'utf8');
        
        console.log('✅ Demo homepage built successfully!');
        console.log(`📁 Output: ${OUTPUT_PATH}`);
        
        if (games.length > 0) {
            console.log('\n🎯 Available games:');
            games.forEach(game => {
                console.log(`  - ${game.title} (${game.path})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error building demo homepage:', error.message);
        process.exit(1);
    }
}

main();