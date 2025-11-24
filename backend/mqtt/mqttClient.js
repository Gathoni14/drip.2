import mqtt from "mqtt";
import Valve from "../models/Valve.js";
import Reading from "../models/Reading.js";

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";
const client = mqtt.connect(MQTT_URL);

client.on("connect", () => {
  console.log("MQTT connected");

  // Topics the backend listens to
  client.subscribe("drip/sensor/+", () => {
    console.log("Subscribed to sensor topic");
  });

  client.subscribe("drip/valve/ack", () => {
    console.log("Subscribed to valve ack topic");
  });
});

// When the backend receives MQTT messages:
client.on("message", async (topic, message) => {
  const payload = message.toString();

  console.log(`MQTT msg => ${topic}: ${payload}`);

  // Topic example: drip/sensor/soil1
  if (topic.startsWith("drip/sensor/")) {
    const sensorId = topic.split("/")[2];
    const value = Number(payload);

    try {
      await Reading.create({ sensorId, value });
      console.log("Reading saved:", value);
    } catch (e) {
      console.error("Error saving reading:", e);
    }
  }

  // Acknowledgement from ESP32 when valve switches
  if (topic === "drip/valve/ack") {
    console.log("Valve update acknowledged:", payload);
  }
});

// Function to publish a valve command
export const sendValveCommand = (valveId, state) => {
  const topic = `drip/valve/${valveId}`;
  const msg = state ? "ON" : "OFF";

  client.publish(topic, msg);
  console.log(`Published => ${topic}: ${msg}`);
};

export default client;
