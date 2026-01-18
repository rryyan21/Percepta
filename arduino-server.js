#!/usr/bin/env node
/**
 * Arduino WebSocket Server
 * Provides WebSocket interface for browser to control Arduino motors
 */

import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { WebSocketServer } from 'ws';

const WS_PORT = 8080;

console.log('\n🤖 Arduino WebSocket Server\n');

let arduinoPort = null;
let connectedClients = new Set();

// List and connect to Arduino
async function connectArduino() {
    const ports = await SerialPort.list();
    console.log('📋 Available Serial Ports:');
    ports.forEach((port, index) => {
        console.log(`   ${index + 1}. ${port.path}`);
        if (port.manufacturer) {
            console.log(`      Manufacturer: ${port.manufacturer}`);
        }
    });
    console.log();

    if (ports.length === 0) {
        console.error('❌ No serial ports found!');
        return null;
    }

    // Try to find Arduino port automatically
    let targetPort = ports.find(port => 
        port.manufacturer?.toLowerCase().includes('arduino') ||
        port.path.includes('usbmodem') ||
        port.path.includes('usbserial')
    );

    if (!targetPort) {
        console.log('⚠️  Arduino not auto-detected, using first available port');
        targetPort = ports[0];
    }

    console.log(`🎯 Connecting to: ${targetPort.path}\n`);
    
    const port = new SerialPort({
        path: targetPort.path,
        baudRate: 9600
    });

    return new Promise((resolve, reject) => {
        port.on('open', () => {
            console.log('✅ Connected to Arduino!\n');
            
            // Set up parser to read line-by-line from Arduino
            const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
            
            // Listen for data from Arduino (ultrasonic sensor readings)
            parser.on('data', (data) => {
                const message = data.trim();
                if (message) {                    
                    // Broadcast sensor data to all connected clients
                    connectedClients.forEach(ws => {
                        if (ws.readyState === 1) { // WebSocket.OPEN
                            ws.send(JSON.stringify({ 
                                type: 'sensorData', 
                                data: message 
                            }));
                        }
                    });
                }
            });
            
            resolve(port);
        });

        port.on('error', (err) => {
            console.error('❌ Serial port error:', err.message);
            reject(err);
        });

        port.on('close', () => {
            console.log('🔌 Arduino port closed');
            arduinoPort = null;
        });
    });
}

// Send command to Arduino
function sendCommand(command) {
    if (arduinoPort && arduinoPort.isOpen) {
        arduinoPort.write(command, (err) => {
            if (err) {
                console.error('❌ Error sending command:', err.message);
            } else {
                console.log(`📤 Sent to Arduino: ${command}`);
            }
        });
        return true;
    }
    return false;
}

// Broadcast status to all connected clients
function broadcastStatus(message) {
    connectedClients.forEach(ws => {
        if (ws.readyState === 1) { // WebSocket.OPEN
            ws.send(JSON.stringify({ type: 'status', message }));
        }
    });
}

// Start WebSocket server
async function startServer() {
    // Connect to Arduino first
    try {
        arduinoPort = await connectArduino();
        console.log('⏳ Waiting for Arduino to initialize (2 seconds)...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
        console.error('Failed to connect to Arduino:', error);
        process.exit(1);
    }

    // Create WebSocket server
    const wss = new WebSocketServer({ port: WS_PORT });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 WebSocket server running on ws://localhost:${WS_PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Waiting for browser connections...\n');

    wss.on('connection', (ws) => {
        connectedClients.add(ws);
        console.log('🔗 Browser connected');
        
        // Send connection confirmation
        ws.send(JSON.stringify({ 
            type: 'connected', 
            message: 'Connected to Arduino server',
            arduinoConnected: arduinoPort !== null 
        }));

        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                
                if (message.type === 'command' && message.command) {
                    const command = message.command.toUpperCase();
                    if (['W', 'A', 'S', 'D', 'X'].includes(command)) {
                        const success = sendCommand(command);
                        const directions = {
                            'W': '🔼 FORWARD',
                            'S': '🔽 BACKWARD',
                            'A': '◀️  LEFT',
                            'D': '▶️  RIGHT',
                            'X': '⏹️  STOP'
                        };
                        console.log(`${directions[command]} (from browser)`);
                        ws.send(JSON.stringify({ 
                            type: 'commandResult', 
                            success,
                            command 
                        }));
                    }
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        ws.on('close', () => {
            connectedClients.delete(ws);
            console.log('🔌 Browser disconnected');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            connectedClients.delete(ws);
        });
    });

    // Cleanup on exit
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Shutting down...');
        if (arduinoPort && arduinoPort.isOpen) {
            sendCommand('X'); // Stop motors
            setTimeout(() => {
                arduinoPort.close();
                wss.close();
                process.exit(0);
            }, 200);
        } else {
            wss.close();
            process.exit(0);
        }
    });
}

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
