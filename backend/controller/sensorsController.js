import Sensor from "../models/Sensor.js";

// Get all sensor readings
export const getReadings = async (req, res) => {
  try {
    const readings = await Sensor.find().sort({ createdAt: -1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get latest reading for each sensor
export const getLatestReading = async (req, res) => {
  try {
    const latestReadings = await Sensor.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$name",
          sensorId: { $first: "$_id" },
          type: { $first: "$type" },
          location: { $first: "$location" },
          value: { $first: "$value" },
          createdAt: { $first: "$createdAt" },
        }
      }
    ]);

    res.json(latestReadings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get readings by specific sensor ID
export const getReadingsBySensor = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const readings = await Sensor.find({ _id: sensorId }).sort({ createdAt: -1 });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new sensor reading
export const addReading = async (req, res) => {
  try {
    const { name, type, location, value } = req.body;

    if (!name || value === undefined) {
      return res.status(400).json({ message: "Sensor name and value are required" });
    }

    const newReading = new Sensor({
      name,
      type,
      location,
      value,
      createdAt: new Date()
    });

    await newReading.save();
    res.status(201).json(newReading);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
