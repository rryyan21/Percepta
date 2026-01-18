#!/usr/bin/env node
/**
 * Overshoot Vision CLI Script
 * Runs Overshoot vision streaming and returns responses
 * 
 * Usage: 
 *   export OVERSHOOT_API_KEY="your-key"
 *   node overshoot-cli.js
 * 
 * This script opens the browser interface for testing.
 * For Arduino integration, see arduino-bridge.js
 */

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_KEY = process.env.OVERSHOOT_API_KEY;
const PROMPT = 'Describe the scene';

console.log('🚀 Overshoot Vision CLI\n');

if (!API_KEY) {
    console.error('❌ Error: OVERSHOOT_API_KEY environment variable not set');
    console.log('   Set it with: export OVERSHOOT_API_KEY="your-key"');
    console.log('   Then run: node overshoot-cli.js\n');
    process.exit(1);
}

console.log('✅ API Key found');
console.log(`📋 Default Prompt: "${PROMPT}"`);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('Since the Overshoot SDK is browser-only (requires WebRTC),');
console.log('we need to use the browser interface.\n');
console.log('Starting development server...\n');

// Start the dev server
console.log('Running: npm run dev\n');
console.log('Once the server starts:');
console.log('1. Open http://localhost:5173 in your browser');
console.log('2. Enter your API key (already copied to clipboard if possible)');
console.log(`3. The prompt will be: "${PROMPT}"`);
console.log('4. Click "Start Stream" to begin\n');
console.log('Press Ctrl+C to stop the server\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Try to copy API key to clipboard (macOS)
exec(`echo "${API_KEY}" | pbcopy`, (err) => {
    if (!err) {
        console.log('📋 API Key copied to clipboard!\n');
    }
});

// Start the development server
const devServer = exec('npm run dev', { cwd: __dirname });

devServer.stdout.on('data', (data) => {
    process.stdout.write(data);
});

devServer.stderr.on('data', (data) => {
    process.stderr.write(data);
});

devServer.on('exit', (code) => {
    console.log(`\nDevelopment server exited with code ${code}`);
    process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down...');
    devServer.kill();
    process.exit(0);
});
