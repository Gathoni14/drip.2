import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  valveId: { type: mongoose.Schema.Types.ObjectId, ref: "Valve" },
  startTime: { type: String, required: true},
  duration: { type: Number, required: true},
  days: [{ type: String, required: true}],

}, { timestamps: true });

export default mongoose.model("Schedule", scheduleSchema);
