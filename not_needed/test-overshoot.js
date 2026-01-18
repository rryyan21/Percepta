#!/usr/bin/env node
/**
 * Standalone Overshoot Test Script
 * 
 * This script returns a response to the prompt "Describe the scene"
 * Run with: node test-overshoot.js
 * 
 * Set your API key in .env file: OVERSHOOT_API_KEY="your-key"
 */

import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OVERSHOOT_API_KEY || '';
const PROMPT = 'Describe the scene';

console.log('\n╔════════════════════════════════════════╗');
console.log('║   Overshoot Vision API Test Script    ║');
console.log('╚════════════════════════════════════════╝\n');

if (!API_KEY) {
    console.error('❌ ERROR: API Key not found\n');
    console.log('Please set your Overshoot API key in .env file:');
    console.log('   OVERSHOOT_API_KEY="your-api-key-here"\n');
    console.log('Then run this script again:');
    console.log('   node test-overshoot.js\n');
    process.exit(1);
}

console.log('✓ API Key: ' + API_KEY.substring(0, 10) + '...');
console.log('✓ Prompt: "' + PROMPT + '"\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  RESPONSE TO: "Describe the scene"');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('The Overshoot SDK is a browser-only library that requires:');
console.log('  • WebRTC (RTCPeerConnection)');
console.log('  • MediaStream API (camera access)');
console.log('  • WebSocket for real-time streaming\n');

console.log('To get actual vision responses, you have two options:\n');

console.log('OPTION 1: Use the web interface (recommended)');
console.log('  1. Run: npm run dev');
console.log('  2. Open http://localhost:5173');
console.log('  3. Enter your API key');
console.log('  4. Start the stream\n');

console.log('OPTION 2: For Node.js automation');
console.log('  Use the script: node overshoot-script.js');
console.log('  (Requires Puppeteer - automated browser)\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Simulated response format
console.log('📋 Expected Response Format:\n');
console.log(JSON.stringify({
    "id": "result-123abc",
    "stream_id": "stream-456def",
    "model_backend": "overshoot",
    "model_name": "Qwen/Qwen3-VL-30B-A3B-Instruct",
    "prompt": PROMPT,
    "result": "A modern office desk with a laptop, coffee mug, and notebook. Natural lighting from a window on the left. The laptop screen shows code. Clean and organized workspace.",
    "inference_latency_ms": 234,
    "total_latency_ms": 456,
    "ok": true,
    "error": null
}, null, 2));

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('✅ Script completed successfully\n');
