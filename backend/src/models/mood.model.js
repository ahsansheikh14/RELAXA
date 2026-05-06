import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, required: true },
    stressLevel: { type: Number, min: 1, max: 10 },
    note: { type: String },
  },
  { timestamps: true }
);

const Mood = mongoose.model('Mood', moodSchema);

export default Mood;
