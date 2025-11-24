import express from "express";
import Valve from "../models/Valve.js";

import { getValves, setValveState } from "../controller/valvesController.js"

const router = express.Router();

// Get all valves
router.get("/", async (req, res) => {
  try {
    const valves = await Valve.find();
    res.json(valves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle / Set valve
router.post("/set", async (req, res) => {
  try {
    const { valveId, state } = req.body;

    const valve = await Valve.findByIdAndUpdate(
      valveId,
      { status: state },
      { new: true }
    );

    res.json(valve);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
