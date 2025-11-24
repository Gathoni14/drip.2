import Valve from "../models/Valve.js";
import { sendValveCommand } from "../mqtt/mqttClient.js";

// Get all valves
export const getValves = async (req, res) => {
  try {
    const valves = await Valve.find();
    res.status(200).json(valves);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Set valve state
export const setValveState = async (req, res) => {
  try {
    const { valveId, state } = req.body; // state = true/false

    if (!valveId || typeof state !== "boolean") {
      return res.status(400).json({ message: "valveId and state required" });
    }

    const valve = await Valve.findById(valveId);
    if (!valve) return res.status(404).json({ message: "Valve not found" });


    // update valve state

    valve.status = state;
    await valve.save();

    // Send command to ESP32 via MQTT
    sendValveCommand(valveId, state);

    res.status(200).json({ message: "Valve updated", valve });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
