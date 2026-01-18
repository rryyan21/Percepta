#!/usr/bin/env node
/**
 * Arduino DC Motor Control Script
 * Controls 4-wheel robot with WASD keys
 * 
 * Usage: node arduino-motors.js
 * 
 * Controls:
 *   W - Move Forward
 *   S - Move Backward
 *   A - Rotate Left
 *   D - Rotate Right
 *   X - Stop
 *   Q - Quit
 * 
 * Upload arduino_motor_control.ino to your Arduino first!
 */

import { SerialPort } from 'serialport';
import readline from 'readline';

console.log('\n🤖 Arduino DC Motor Control\n');

// Configure readline for raw input (no need to press Enter)
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

// Control motors
async function controlMotors(portPath) {
    console.log(`🔗 Connecting to Arduino on ${portPath}...`);
    
    const port = new SerialPort({
        path: portPath,
        baudRate: 9600
    });

    // Handle port open
    port.on('open', () => {
        console.log('✅ Connected to Arduino!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎮 MOTOR CONTROLS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('   W - Move Forward   🔼');
        console.log('   S - Move Backward  🔽');
        console.log('   A - Rotate Left    ◀️');
        console.log('   D - Rotate Right   ▶️');
        console.log('   X - Stop Motors    ⏹️');
        console.log('   Q - Quit Program   🚪');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('Ready for commands! Press keys to control...\n');
    });

    // Handle errors
    port.on('error', (err) => {
        console.error('❌ Serial port error:', err.message);
        cleanup();
        process.exit(1);
    });

    port.on('close', () => {
        console.log('🔌 Port closed');
        cleanup();
        process.exit(0);
    });

    // Listen for keypress events
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            console.log('\n\n👋 Ctrl+C detected, stopping...');
            sendCommand('X', port);
            setTimeout(() => {
                cleanup();
                process.exit(0);
            }, 100);
            return;
        }

        const command = key.name?.toUpperCase();
        
        switch (command) {
            case 'W':
                sendCommand('W', port);
                console.log('🔼 Moving FORWARD');
                break;
            case 'S':
                sendCommand('S', port);
                console.log('🔽 Moving BACKWARD');
                break;
            case 'A':
                sendCommand('A', port);
                console.log('◀️  Rotating LEFT');
                break;
            case 'D':
                sendCommand('D', port);
                console.log('▶️  Rotating RIGHT');
                break;
            case 'X':
                sendCommand('X', port);
                console.log('⏹️  STOP - Motors stopped');
                break;
            case 'Q':
                console.log('\n👋 Quitting...');
                sendCommand('X', port);
                setTimeout(() => {
                    cleanup();
                    process.exit(0);
                }, 200);
                break;
            default:
                // Ignore other keys
                break;
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
        console.log('\n\n🛑 Stopping motors...');
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
            console.log('  2. Has the motor control sketch uploaded');
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
            controlMotors(arduinoPort.path);
        }, 2000);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
