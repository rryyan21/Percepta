/*
 * Arduino LED Control Sketch
 * 
 * Upload this to your Arduino first!
 * 
 * This sketch:
 * - Listens for commands over Serial
 * - '1' = Turn LED ON (pin 13)
 * - '0' = Turn LED OFF (pin 13)
 * - Sends confirmation back to computer
 * 
 * Board: Arduino Uno/Nano/Mega (any with built-in LED on pin 13)
 * Baud Rate: 9600
 */

const int LED_PIN = 13;

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Set LED pin as output
  pinMode(LED_PIN, OUTPUT);
  
  // Turn off LED initially
  digitalWrite(LED_PIN, LOW);
  
  // Send ready message
  Serial.println("Arduino Ready!");
}

void loop() {
  // Check if data is available to read
  if (Serial.available() > 0) {
    // Read the incoming byte
    char command = Serial.read();
    
    // Execute command
    if (command == '1') {
      digitalWrite(LED_PIN, HIGH);
      Serial.println("LED ON");
    } 
    else if (command == '0') {
      digitalWrite(LED_PIN, LOW);
      Serial.println("LED OFF");
    }
  }
}
