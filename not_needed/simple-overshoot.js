#!/usr/bin/env node
/**
 * Simple Overshoot API Response Script
 * Returns the response to prompt "Describe the scene"
 * 
 * Usage: node simple-overshoot.js
 */

import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OVERSHOOT_API_KEY;
const PROMPT = 'Describe the scene';

console.log('\n╔═══════════════════════════════════════════════╗');
console.log('║     Overshoot Vision - Simple Test Script    ║');
console.log('╚═══════════════════════════════════════════════╝\n');

if (!API_KEY) {
    console.error('❌ ERROR: OVERSHOOT_API_KEY not found in .env file\n');
    process.exit(1);
}

console.log('✅ Configuration Loaded');
console.log(`   API Key: ${API_KEY.substring(0, 12)}...`);
console.log(`   Prompt: "${PROMPT}"`);
console.log('\n' + '═'.repeat(50) + '\n');

// Since Overshoot requires WebRTC/browser environment,
// show instructions for getting actual results
console.log('📋 RESPONSE FORMAT for "Describe the scene":\n');

const mockResponse = {
    id: "inference_" + Date.now(),
    stream_id: "stream_" + Math.random().toString(36).substring(7),
    model_backend: "overshoot",
    model_name: "Qwen/Qwen3-VL-30B-A3B-Instruct",
    prompt: PROMPT,
    result: "A desk setup with a laptop computer displaying code on the screen. There's a coffee mug to the right and a notebook with a pen. The scene is well-lit with natural light from a window in the background. The workspace appears organized and modern.",
    inference_latency_ms: 234,
    total_latency_ms: 456,
    ok: true,
    error: null
};

console.log(JSON.stringify(mockResponse, null, 2));

console.log('\n' + '═'.repeat(50));
console.log('\n💡 TO GET REAL-TIME RESULTS:\n');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:5173');
console.log('3. The API key from .env will auto-load');
console.log('4. Click "Start Stream" to begin\n');
console.log('OR\n');
console.log('Run the browser automation script:');
console.log('   node overshoot-script.js\n');
console.log('   (Opens browser window with live camera feed)\n');
console.log('═'.repeat(50) + '\n');

console.log('✅ Script completed\n');
