import express from "express";
import { addReading, getLatestReadings } from "../controller/readingsController.js";

const router = express.Router();

router.get("/", getLatestReadings);
router.post("/", addReading);

export default router;
