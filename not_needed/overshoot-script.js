/**
 * Overshoot Vision Test Script
 * Simple Node.js script to test Overshoot API with "Describe the scene" prompt
 * 
 * Usage: node overshoot-script.js
 */

import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_KEY = process.env.OVERSHOOT_API_KEY || 'your-api-key-here';
const API_URL = 'https://cluster1.overshoot.ai/api/v0.2';
const PROMPT = 'Describe the scene';
const DURATION = 30000; // Run for 30 seconds to allow connection time

async function runOvershootVision() {
    console.log('🚀 Starting Overshoot Vision Script...\n');
    
    if (!API_KEY || API_KEY === 'your-api-key-here') {
        console.error('❌ Error: Please set OVERSHOOT_API_KEY environment variable');
        console.log('   Example: export OVERSHOOT_API_KEY="your-key"\n');
        process.exit(1);
    }

    const browser = await puppeteer.launch({
        headless: false, // Set to true for headless mode
        args: [
            '--use-fake-ui-for-media-stream', // Auto-grant camera permissions
            '--use-fake-device-for-media-stream', // Use fake camera
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    });

    const page = await browser.newPage();
    
    // Grant camera permissions
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('file://', ['camera', 'microphone']);

    let resultReceived = false;
    
    // Capture console logs and results
    page.on('console', async (msg) => {
        const text = msg.text();
        console.log('🔍 Browser:', text);
        if (text.includes('Latest Result:') || text.includes('Vision stream started')) {
            resultReceived = true;
        }
    });

    // Create a temporary HTML file with embedded script
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Overshoot Vision Test</title>
</head>
<body>
    <h1>Overshoot Vision Test</h1>
    <video id="preview" autoplay playsinline muted style="width: 640px; height: 480px; border: 2px solid #333;"></video>
    <div id="results" style="margin-top: 20px; font-family: monospace; white-space: pre-wrap;"></div>
    
    <script type="module">
        import { RealtimeVision } from 'https://cdn.jsdelivr.net/npm/@overshoot/sdk@latest/dist/index.js';
        
        const resultsDiv = document.getElementById('results');
        const videoElement = document.getElementById('preview');
        
        async function start() {
            try {
                console.log('Starting Overshoot Vision...');
                
                const vision = new RealtimeVision({
                    apiUrl: '${API_URL}',
                    apiKey: '${API_KEY}',
                    prompt: '${PROMPT}',
                    debug: true,
                    onResult: (result) => {
                        console.log('Result:', JSON.stringify(result, null, 2));
                        const output = \`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PROMPT: \${result.prompt}
💬 RESULT: \${result.result}
⏱️  Latency: \${result.total_latency_ms}ms
✅ Status: \${result.ok ? 'Success' : 'Failed'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\`;
                        resultsDiv.textContent += output;
                        
                        // Store result for retrieval
                        window.latestResult = result;
                    },
                    onError: (error) => {
                        console.error('Error:', error);
                        resultsDiv.textContent += \`\\n❌ Error: \${error.message}\\n\`;
                    }
                });
                
                await vision.start();
                console.log('✅ Vision stream started successfully');
                
                // Attach video preview
                const stream = vision.getMediaStream();
                if (stream) {
                    videoElement.srcObject = stream;
                }
                
                // Store vision instance globally for cleanup
                window.visionInstance = vision;
                
            } catch (error) {
                console.error('Failed to start:', error);
                resultsDiv.textContent = \`Failed to start: \${error.message}\`;
            }
        }
        
        start();
    </script>
</body>
</html>
    `;
    
    const tempFile = path.join(__dirname, 'temp-overshoot-test.html');
    fs.writeFileSync(tempFile, htmlContent);
    
    try {
        console.log('🌐 Loading page...');
        await page.goto(`file://${tempFile}`, { waitUntil: 'networkidle0' });
        
        console.log(`⏳ Running for ${DURATION/1000} seconds, waiting for results...\n`);
        
        // Poll for results every 2 seconds
        let attempts = 0;
        const maxAttempts = DURATION / 2000;
        
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const latestResult = await page.evaluate(() => {
                return window.latestResult;
            });
            
            if (latestResult) {
                console.log('\n✅ SUCCESS! Received Result:');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(`📋 Prompt: ${latestResult.prompt}`);
                console.log(`💬 Result: ${latestResult.result}`);
                console.log(`⏱️  Latency: ${latestResult.total_latency_ms}ms`);
                console.log(`✅ Status: ${latestResult.ok ? 'Success' : 'Failed'}`);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
                console.log('Full JSON:');
                console.log(JSON.stringify(latestResult, null, 2));
                break;
            }
            
            attempts++;
            console.log(`⏳ Waiting for results... (${attempts}/${maxAttempts})`);
        }
        
        if (attempts >= maxAttempts) {
            console.log('\n⚠️  Timeout: No results received');
            console.log('This may be due to:');
            console.log('  - Camera/WebRTC connection issues');
            console.log('  - API key problems');
            console.log('  - Network connectivity');
        }
        
    } finally {
        // Cleanup
        await browser.close();
        if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
        }
    }
    
    console.log('\n🏁 Script completed\n');
}

// Run the script
runOvershootVision().catch(console.error);
