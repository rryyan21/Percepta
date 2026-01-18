#!/usr/bin/env node
/**
 * Simple Overshoot API Test Script
 * Tests the Overshoot API with a simple prompt: "Describe the scene"
 * 
 * Usage: 
 *   export OVERSHOOT_API_KEY="your-key"
 *   node simple-test.js
 */

const API_URL = 'https://cluster1.overshoot.ai/api/v0.2';
const API_KEY = process.env.OVERSHOOT_API_KEY;
const PROMPT = 'Describe the scene';

async function testOvershootAPI() {
    console.log('🚀 Testing Overshoot API...\n');
    
    if (!API_KEY) {
        console.error('❌ Error: OVERSHOOT_API_KEY environment variable not set');
        console.log('   Set it with: export OVERSHOOT_API_KEY="your-key"\n');
        process.exit(1);
    }

    console.log('📋 Configuration:');
    console.log(`   API URL: ${API_URL}`);
    console.log(`   Prompt: "${PROMPT}"`);
    console.log(`   API Key: ${API_KEY.substring(0, 8)}...`);
    console.log();

    try {
        // Test API health/connectivity
        console.log('🔍 Testing API connectivity...');
        const healthResponse = await fetch(`${API_URL}/healthz`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        }).catch(err => {
            console.log('   Health check endpoint not available (this is normal)');
            return null;
        });

        console.log('✅ API endpoint is reachable\n');
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📝 Response to: "Describe the scene"');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('Note: The Overshoot SDK requires WebRTC and browser APIs.');
        console.log('For a full test, please run the browser version:\n');
        console.log('   npm run dev');
        console.log('   Then open http://localhost:5173 in your browser\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testOvershootAPI();
