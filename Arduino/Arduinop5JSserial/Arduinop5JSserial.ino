#include "analogWave.h" // Include the library for analog waveform generation

analogWave wave(DAC);   // Create an instance of the analogWave class, using the DAC pin

int freq = 1000;


void setup() {
  Serial.begin(9600); // Start serial communication
  wave.sine(freq); 
}

void loop() {
  int sensorValue = analogRead(A5); // Read from analog pin A5
  Serial.println(sensorValue);      // Send to serial port
  delay(50); // Slow down output a bit (20 readings/second)
}