import Mood from '../models/mood.model.js';

const createMoodEntry = async (req, res, next) => {
  try {
    const { mood, stressLevel, note } = req.body;

    if (!mood || !String(mood).trim()) {
      return res.status(400).json({ message: 'mood is required.' });
    }

    if (stressLevel !== undefined) {
      const stressValue = Number(stressLevel);
      if (!Number.isInteger(stressValue) || stressValue < 1 || stressValue > 10) {
        return res.status(400).json({ message: 'stressLevel must be an integer from 1 to 10.' });
      }
    }

    const moodEntry = await Mood.create({
      userId: req.user.userId,
      mood: String(mood).trim(),
      stressLevel: stressLevel !== undefined ? Number(stressLevel) : undefined,
      note: note ? String(note).trim() : undefined,
    });

    return res.status(201).json({
      message: 'Mood entry created successfully.',
      mood: moodEntry,
    });
  } catch (err) {
    return next(err);
  }
};

const getMoodHistory = async (req, res, next) => {
  try {
    const limitParam = Number(req.query.limit);
    const limit = Number.isInteger(limitParam) && limitParam > 0 ? Math.min(limitParam, 365) : 90;

    const moods = await Mood.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      count: moods.length,
      moods,
    });
  } catch (err) {
    return next(err);
  }
};

export { createMoodEntry, getMoodHistory };
