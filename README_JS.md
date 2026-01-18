# Overshoot JavaScript/TypeScript Demo

This folder contains both Python and JavaScript implementations for the Overshoot SDK.

## JavaScript Setup

The Overshoot JS SDK is **browser-only** and requires:
- WebRTC support
- MediaDevices API (camera access)
- WebSocket support

### Quick Start (HTML)

1. **Open the demo directly**:
   ```bash
   open run.html
   ```
   Just open `run.html` in your browser - no build needed!

2. **Enter your API key** in the interface

3. **Customize the prompt** to tell the AI what to look for

4. **Click "Start Stream"** and allow camera permissions

### Using with a Build Tool (Recommended for Production)

If you want to integrate the SDK into a real project:

1. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser** to the URL shown (usually http://localhost:5173)

### Using the SDK in Your Own Project

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

## Python Setup

See the main README for Python setup instructions.

### Quick Python Test

```bash
python run.py
```

Change the `PROMPT` variable at the top of `run.py` to customize what the AI looks for.

## Configuration

Both implementations support:

- **Custom prompts**: Tell the AI what to detect or analyze
- **Adjustable duration**: How long to stream
- **Real-time results**: Get responses as they're generated (~1-2 per second)
- **Low latency**: Typical response times 300-600ms

## API Documentation

- JavaScript SDK: https://github.com/Overshoot-ai/overshoot-js-sdk
- API Docs: https://cluster1.overshoot.ai/api/v0.2/docs
