// variable to hold an instance of the p5.webserial library:
const serial = new p5.WebSerial();

// HTML button objects:
let portButton;
let disconnectButton;

let inData;     // for incoming serial data
let outByte = 0;
let vals = [];

function setup() {
  createCanvas(400, 300);

  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }

  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);

  makePortButton();

  // Setup event handlers
  serial.on("noport", makePortButton);
  serial.on("portavailable", openPort);
  serial.on("requesterror", portError);
  serial.on("data", serialEvent);
  serial.on("close", handleClose);
}

function draw() {
  background(0);
  fill(255);
  text("sensor value: " + inData, 30, 50);
}

// Create the "Choose Port" button
function makePortButton() {
  if (!portButton) {
    portButton = createButton("Choose Serial Port");
    portButton.position(10, 10);
    portButton.mousePressed(async () => {
      try {
        // Always inside the button click handler:
        await serial.requestPort();     // Opens browser port chooser
        await serial.open();            // Tries to open selected port
        console.log("Serial port opened");

        makeDisconnectButton();         // Show disconnect button
        portButton.hide();              // Hide choose button

      } catch (err) {
        console.error("Serial connection failed:", err);
        alert("Failed to open serial port. Is it already in use?");
      }
    });
  } else {
    portButton.show();
  }
}

// Create the "Disconnect" button
function makeDisconnectButton() {
  if (!disconnectButton) {
    disconnectButton = createButton("Disconnect");
    disconnectButton.position(160, 10);
    disconnectButton.mousePressed(async () => {
      try {
        // Try to close using p5.WebSerial method
        await serial.close();

        // Extra check: forcibly close the underlying Web Serial port if still connected
        if (serial._port && serial._port.readable) {
          await serial._port.close();
          console.log("Underlying Web Serial port forcibly closed.");
        }

        handleClose();
      } catch (err) {
        console.error("Error while disconnecting:", err);
      }
    });
  } else {
    disconnectButton.show();
  }
}

// Called when a port is selected and ready to open
function openPort() {
  serial.open().then(() => {
    console.log("Port opened successfully");
    if (portButton) portButton.hide();
    makeDisconnectButton(); // show disconnect button
  });
}

// Called when serial port is closed
function handleClose() {
  if (portButton) portButton.show();
  if (disconnectButton) disconnectButton.hide();
}

// Handle serial port errors:
function portError(err) {
  alert("Serial port error: " + err);
}

// Serial data received:
function serialEvent() {
  inData = serial.readLine();
  if (inData != null) {
    inData = trim(inData);
    vals = int(splitTokens(inData, ","));

    if (vals.length >= 1) {
      value1 = vals[0];
      console.log(value1);
    }
  }
}

function portConnect() {
  console.log("Port connected");
  serial.getPorts();
}

function portDisconnect() {
  console.log("Port disconnected");
  serial.close();
}


function handleClose() {
  console.log("Serial port closed.");
  if (portButton) portButton.show();
  if (disconnectButton) disconnectButton.hide();
  inData = "";  // Clear last data
}