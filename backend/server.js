import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import readingsRoutes from "./routes/readings.js";
import scheduleRoutes from "./routes/schedules.js";
import sensorsRoutes from "./routes/sensors.js";
import userRoutes from "./routes/user.js";
import valvesRoutes from "./routes/valves.js";
import "./mqtt/mqttClient.js";

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/readings", readingsRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/sensors", sensorsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/valves", valvesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
