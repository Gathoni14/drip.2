import mongoose from "mongoose";

const readingSchema = new mongoose.Schema(
  {
    sensorId: { type: mongoose.Schema.Types.ObjectId, ref: "Sensor" },
    value: { type: Number, required: true } // moisture value only
  },
  { timestamps: true }
);

export default mongoose.model("Reading", readingSchema);
