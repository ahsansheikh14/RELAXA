import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    description: { type: String },
    mediaType: { type: String, enum: ['none', 'link', 'video'], default: 'none' },
    mediaUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
