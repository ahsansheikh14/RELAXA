import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    description: { type: String },
  },
  { timestamps: true }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
