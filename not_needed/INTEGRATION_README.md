# Arduino + Overshoot Vision Integration

This setup combines the Overshoot Vision API with Arduino motor control. The browser-based UI detects movement commands from the vision stream and automatically controls the Arduino motors.

## Architecture

- **Browser UI** (`index.html` via Vite): Displays camera feed and Overshoot API results
- **Arduino Server** (`arduino-server.js`): Node.js WebSocket server that bridges browser ↔ Arduino
- **Arduino**: Receives serial commands (W/A/S/D/X) to control motors

## Setup Instructions

### 1. Upload Arduino Sketch

Make sure you've uploaded `arduino_motor_control/arduino_motor_control.ino` to your Arduino board first.

### 2. Start the Arduino Server

In one terminal, start the Arduino WebSocket server:

```bash
npm run arduino-server
```

This will:
- Connect to your Arduino via USB
- Start a WebSocket server on `ws://localhost:8080`
- Wait for browser connections

### 3. Start the Web Interface

In a **second terminal**, start the Vite development server:

```bash
npm run dev
```

This will start the browser UI at `http://localhost:5173`

### 4. Use the Application

1. Open `http://localhost:5173` in your browser
2. Enter your Overshoot API key
3. Modify the prompt to include movement commands, for example:
   - "Describe which direction I should move: forward, backward, left, or right"
   - "Tell me to go forward, backward, left or right based on what you see"
4. Click "Start Stream"

## How It Works

When the Overshoot API returns a result, the browser checks if the text contains these keywords:

- **"forward"** → Sends `W` to Arduino (move forward)
- **"backward"** or **"back"** → Sends `S` to Arduino (move backward)
- **"left"** → Sends `A` to Arduino (rotate left)
- **"right"** → Sends `D` to Arduino (rotate right)
- **"stop"** → Sends `X` to Arduino (stop motors)

The command is displayed in the results panel with a green indicator showing what was sent to the Arduino.

## Commands Reference

### Arduino Commands (Sent by Browser)
- `W` - Move Forward 🔼
- `S` - Move Backward 🔽
- `A` - Rotate Left ◀️
- `D` - Rotate Right ▶️
- `X` - Stop Motors ⏹️

## Troubleshooting

### Arduino Server Not Connecting
- Make sure Arduino is plugged in via USB
- Check that the motor control sketch is uploaded
- Verify the correct port is being used (check `arduino-server.js` output)

### Browser Not Connecting to Arduino Server
- Ensure `arduino-server.js` is running
- Check browser console for WebSocket errors
- Make sure you're accessing via `localhost` (not `127.0.0.1`)

### No Commands Being Sent
- Check that your prompt encourages the AI to use directional keywords
- Look in the browser console for command detection logs
- Verify the Arduino server terminal shows received commands

## Example Prompts

Good prompts that work well:

1. **Navigation Assistant**: 
   ```
   You are helping me navigate. Based on what you see, tell me to go forward, backward, left, or right to avoid obstacles.
   ```

2. **Simple Direction**:
   ```
   Tell me one direction to move: forward, backward, left, or right
   ```

3. **Object Avoidance**:
   ```
   If you see an obstacle ahead, tell me to go backward, left, or right. Otherwise say forward.
   ```

## Files

- `index.html` - Browser UI with Overshoot Vision integration
- `arduino-server.js` - WebSocket server for Arduino communication
- `arduino_motor_control/arduino_motor_control.ino` - Arduino motor control sketch
- `package.json` - Dependencies and scripts

## Development

The system uses three components:
1. Vite dev server (port 5173) - serves the browser UI
2. Arduino WebSocket server (port 8080) - bridges browser to Arduino
3. Arduino serial connection - controls the motors

All three must be running for the full integration to work.
