import Reading from "../models/Reading.js";
import Sensor from "../models/Sensor.js";

// Add a new moisture reading
export const addReading = async (req, res) => {
  try {
    const { sensorId, value } = req.body;

    if (!sensorId || value === undefined) {
      return res.status(400).json({ message: "Missing sensorId or value" });
    }

    const sensor = await Sensor.findById(sensorId);
    if (!sensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    const reading = await Reading.create({ sensorId, value });

    res.status(201).json({
      message: "Moisture reading saved successfully",
      reading
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get latest 20 readings
export const getLatestReadings = async (req, res) => {
  try {
    const readings = await Reading.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("sensorId");

    res.status(200).json(readings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
