# Overshoot JavaScript/TypeScript Demo

This folder contains a browser-based demo for the Overshoot SDK.

## Quick Start

**Easiest way** - just open the HTML file in your browser:
```bash
open run.html
```

The demo includes:
- 🎯 Easy prompt customization (just like the Python `run.py`)
- ⏱️ Adjustable duration control
- 📹 Live camera preview
- 📊 Real-time results display with latency metrics
- 💾 API key saved in browser storage

## Using with a Build Tool (Recommended)

For proper SDK integration:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser** to the URL shown (usually http://localhost:5173)

4. **Uncomment the SDK code** in `run.html` (lines 218-250)

## SDK Usage Example

```typescript
import { RealtimeVision } from 'overshoot';

const vision = new RealtimeVision({
  apiUrl: 'https://cluster1.overshoot.ai/api/v0.2',
  apiKey: 'your-api-key',
  prompt: 'Describe what you see in one sentence',
  onResult: (result) => {
    console.log(result.result);
    console.log(`Latency: ${result.total_latency_ms}ms`);
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});

// Start streaming
await vision.start();

// Update prompt dynamically
await vision.updatePrompt('Count people in the frame');

// Stop streaming
await vision.stop();
```

## Configuration

The demo supports:

- **Custom prompts**: Tell the AI what to detect or analyze
- **Adjustable duration**: How long to stream
- **Real-time results**: Get responses as they're generated (~1-2 per second)
- **Low latency**: Typical response times 300-600ms

## Browser Requirements

The Overshoot JS SDK requires:
- WebRTC support
- MediaDevices API (camera access)
- WebSocket support
- Modern browser (Chrome, Firefox, Safari, Edge)

## Resources

- [JavaScript SDK GitHub](https://github.com/Overshoot-ai/overshoot-js-sdk)
- [API Documentation](https://cluster1.overshoot.ai/api/v0.2/docs)
- [Python SDK](../overshoot/) - Python implementation in parent directory
