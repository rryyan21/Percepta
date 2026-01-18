# Arduino LED Control - Setup Guide

## Step 1: Upload Arduino Sketch

1. Open Arduino IDE
2. Open the file: `arduino_led_control.ino`
3. Select your Arduino board (Tools → Board)
4. Select the correct port (Tools → Port)
5. Click Upload button

## Step 2: Run the JavaScript Script

Once the Arduino sketch is uploaded:

```bash
npm run arduino
```

Or directly:

```bash
node arduino-led.js
```

## What It Does

The script will:
- 🔍 Auto-detect your Arduino
- 🔗 Connect via serial port (9600 baud)
- 💡 Flash the built-in LED on pin 13
- 🔄 10 flashes (on/off every 500ms)
- ✅ Turn off LED when complete

## Expected Output

```
🔌 Arduino LED Control Script

📋 Available Serial Ports:
   1. /dev/cu.usbmodem14301
      Manufacturer: Arduino

🎯 Using port: /dev/cu.usbmodem14301

⏳ Waiting for Arduino to initialize (2 seconds)...

🔗 Connecting to Arduino on /dev/cu.usbmodem14301...
✅ Connected to Arduino!

💡 Flashing LED on pin 13...

📨 Arduino: Arduino Ready!
💡 LED ON (1/5)
📨 Arduino: LED ON
⚫ LED OFF (1/5)
📨 Arduino: LED OFF
...

✅ Flashing complete!
🔌 Closing connection...
```

## Troubleshooting

### Arduino not found?
- Make sure Arduino is connected via USB
- Check that the Arduino sketch is uploaded
- Try unplugging and replugging the Arduino

### Permission denied?
On macOS/Linux:
```bash
sudo chmod 666 /dev/ttyUSB0  # or your port
```

### Wrong port?
Edit `arduino-led.js` and manually set the port:
```javascript
const portPath = '/dev/cu.usbmodem14301'; // Your Arduino port
```

## Next Steps

Now you can integrate this with the Overshoot vision system to control Arduino based on what the camera sees!
