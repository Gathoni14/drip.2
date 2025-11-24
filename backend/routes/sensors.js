import express from "express";
import { 
  getReadings, 
  getLatestReading, 
  getReadingsBySensor, 
  addReading 
} from "../controller/sensorsController.js";

const router = express.Router();

// Get all sensor readings (latest first)
router.get("/", getReadings);

// Get latest reading for each sensor
router.get("/latest", getLatestReading);

// Get readings for a specific sensor by ID
router.get("/:sensorId", getReadingsBySensor);

// Add a new sensor reading
router.post("/", addReading);

export default router;
