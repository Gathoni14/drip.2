import Schedule from "../models/Schedule.js";
import Valve from "../models/Valve.js";

// Get all schedules
export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("valveId");
    res.json(schedules);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add a new schedule
export const addSchedule = async (req, res) => {
  try {
    const { valveId, startTime, duration, days } = req.body;

    const valve = await Valve.findById(valveId);
    if (!valve) return res.status(404).json({ message: "Valve not found" });

    const schedule = await Schedule.create({ valveId, startTime, duration, days });
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an existing schedule
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { valveId, startTime, duration, days } = req.body;

    const schedule = await Schedule.findById(id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    schedule.valveId = valveId;
    schedule.startTime = startTime;
    schedule.duration = duration;
    schedule.days = days;

    await schedule.save();
    res.json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a schedule
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await Schedule.findByIdAndDelete(id);
    res.json({ message: "Schedule deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
