import mongoose from 'mongoose';
import Mood from '../models/mood.model.js';

const getMoodReport = async (req, res) => {
  try {
    const days = Math.max(Number(req.query.days) || 30, 1);
    const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const match = { createdAt: { $gte: fromDate } };
    if (req.user?._id) {
      match.userId = new mongoose.Types.ObjectId(req.user._id);
    }

    const trends = await Mood.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            mood: '$mood',
          },
          averageStressLevel: { $avg: '$stressLevel' },
          entries: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          mood: '$_id.mood',
          entries: 1,
          averageStressLevel: { $round: ['$averageStressLevel', 2] },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Mood trends fetched successfully.',
      data: trends,
      filters: {
        days,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch mood trends.',
      error: error.message,
    });
  }
};

export { getMoodReport };
