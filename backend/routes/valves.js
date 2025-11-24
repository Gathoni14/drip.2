import express from "express";
import { getValves, setValveState } from "../controller/valvesController.js";

const router = express.Router();

router.get("/", getValves);
router.post("/set", setValveState);

export default router;
