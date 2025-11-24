import mongoose from "mongoose";

const valveSchema = new mongoose.Schema({
  name: String,
  
  status: { type: Boolean, default: false }, // open or closed
});

export default mongoose.model("Valve", valveSchema);
