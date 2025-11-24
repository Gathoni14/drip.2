import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },       // e.g., "moisture", "temperature"
  location: { type: String },   // e.g., "Field 1"
  value: { type: Number, required: true }, // actual sensor reading
}, { timestamps: true });

export default mongoose.model("Sensor", sensorSchema);

