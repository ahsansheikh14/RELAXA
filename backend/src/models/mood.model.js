import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    stressLevel: { type: Number, min: 1, max: 10 },
    note: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

moodSchema.index({ userId: 1, createdAt: -1 });

const Mood = mongoose.model('Mood', moodSchema);

export default Mood;
