# Overshoot Vision API - Node.js Test Script

Simple Node.js script to test the Overshoot Vision API with the prompt "Describe the scene".

## Quick Start

### 1. Set your API key
```bash
export OVERSHOOT_API_KEY="your-api-key-here"
```

### 2. Run the test script
```bash
node test-overshoot.js
```

Or use npm:
```bash
npm start
```

## About Overshoot SDK

The Overshoot SDK is a **browser-only** library that requires:
- WebRTC (RTCPeerConnection)  
- MediaStream API (camera access)
- WebSocket for real-time streaming

This means it cannot run directly in Node.js without a browser environment.

## Full Testing Options

### Option 1: Web Interface (Recommended)
```bash
npm run dev
```
Then open http://localhost:5173 in your browser

### Option 2: Automated Browser Testing
Use Puppeteer/Playwright for headless browser automation:
```bash
node overshoot-script.js
```
(Requires Puppeteer installation)

## Response Format

The API returns results in this format:
```json
{
  "id": "result-123abc",
  "stream_id": "stream-456def",
  "model_backend": "overshoot",
  "model_name": "Qwen/Qwen3-VL-30B-A3B-Instruct",
  "prompt": "Describe the scene",
  "result": "Description of what the AI sees...",
  "inference_latency_ms": 234,
  "total_latency_ms": 456,
  "ok": true,
  "error": null
}
```

## Next Steps

For Arduino communication integration, see:
- `arduino-bridge.js` (coming next)
- Serial port communication examples
- WebSocket server for real-time data transfer

## Documentation

- [Overshoot JS SDK](https://github.com/Overshoot-ai/overshoot-js-sdk)
- [API Documentation](https://cluster1.overshoot.ai/docs)
