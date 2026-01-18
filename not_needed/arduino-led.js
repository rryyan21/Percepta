#!/usr/bin/env node
/**
 * Arduino Control Script
 * Send WASD commands to Arduino
 * 
 * Usage: node arduino-led.js
 * 
 * Controls:
 *   W - Send 'W' command
 *   A - Send 'A' command
 *   S - Send 'S' command
 *   D - Send 'D' command
 *   X - Send 'X' command (stop)
 *   Q - Quit
 * 
 * Arduino Setup:
 * Upload your Arduino sketch that handles WASD commands
 */

import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import readline from 'readline';

console.log('\n🎮 Arduino WASD Control\n');

// Configure readline for raw input
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

// List available ports
async function listPorts() {
    const ports = await SerialPort.list();
    console.log('📋 Available Serial Ports:');
    ports.forEach((port, index) => {
        console.log(`   ${index + 1}. ${port.path}`);
        if (port.manufacturer) {
            console.log(`      Manufacturer: ${port.manufacturer}`);
        }
    });
    console.log();
    return ports;
}

// Control LED with keyboard
async function controlLED(portPath) {
    console.log(`🔗 Connecting to Arduino on ${portPath}...`);
    
    const port = new SerialPort({
        path: portPath,
        baudRate: 9600
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    // Handle incoming data from Arduino
    parser.on('data', (data) => {
        console.log(`📨 Arduino: ${data}`);
    });

    // Handle port open
    port.on('open', () => {
        console.log('✅ Connected to Arduino!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎮 WASD CONTROLS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('   W - Forward   🔼');
        console.log('   A - Left      ◀️');
        console.log('   S - Backward  🔽');
        console.log('   D - Right     ▶️');
        console.log('   X - Stop      ⏹️');
        console.log('   Q - Quit      🚪');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('Ready! Press WASD to send commands...\n');
    });

    // Handle errors
    port.on('error', (err) => {
        console.error('❌ Serial port error:', err.message);
        cleanup();
        process.exit(1);
    });

    port.on('close', () => {
        console.log('🔌 Port closed\n');
        cleanup();
        process.exit(0);
    });

    // Listen for keypress events
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            console.log('\n\n👋 Ctrl+C detected, exiting...');
            sendCommand('X', port);
            setTimeout(() => {
                cleanup();
                process.exit(0);
            }, 100);
            return;
        }

        const command = key.name?.toUpperCase();
        
        if (command === 'W') {
            console.log('� Sending W (Forward)');
            sendCommand('W', port);
        } else if (command === 'A') {
            console.log('◀️  Sending A (Left)');
            sendCommand('A', port);
        } else if (command === 'S') {
            console.log('🔽 Sending S (Backward)');
            sendCommand('S', port);
        } else if (command === 'D') {
            console.log('▶️  Sending D (Right)');
            sendCommand('D', port);
        } else if (command === 'X') {
            console.log('⏹️  Sending X (Stop)');
            sendCommand('X', port);
        } else if (command === 'Q') {
            console.log('\n👋 Quitting...');
            sendCommand('X', port);
            setTimeout(() => {
                cleanup();
                process.exit(0);
            }, 200);
        }
    });

    // Cleanup function
    function cleanup() {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
        process.stdin.pause();
        if (port.isOpen) {
            port.close();
        }
    }

    // Send stop command on exit
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Sending stop command...');
        sendCommand('X', port);
        setTimeout(() => {
            cleanup();
            process.exit(0);
        }, 100);
    });
}

// Send command to Arduino
function sendCommand(command, port) {
    if (port.isOpen) {
        port.write(command, (err) => {
            if (err) {
                console.error('❌ Error sending command:', err.message);
            }
        });
    }
}

// Main function
async function main() {
    try {
        const ports = await listPorts();
        
        if (ports.length === 0) {
            console.error('❌ No serial ports found!');
            console.log('\nMake sure your Arduino is:');
            console.log('  1. Connected via USB');
            console.log('  2. Has the LED control sketch uploaded');
            console.log('  3. Is recognized by your computer\n');
            process.exit(1);
        }

        // Try to find Arduino port automatically
        let arduinoPort = ports.find(port => 
            port.manufacturer?.toLowerCase().includes('arduino') ||
            port.path.includes('usbmodem') ||
            port.path.includes('usbserial')
        );

        if (!arduinoPort) {
            console.log('⚠️  Arduino not auto-detected, using first available port');
            arduinoPort = ports[0];
        }

        console.log(`🎯 Using port: ${arduinoPort.path}\n`);
        
        // Wait for Arduino to reset after connection
        console.log('⏳ Waiting for Arduino to initialize (2 seconds)...\n');
        setTimeout(() => {
            controlLED(arduinoPort.path);
        }, 2000);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
