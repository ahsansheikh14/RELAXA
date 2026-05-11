import Exercise from '../models/exercise.model.js';

const sanitizeExercisePayload = (payload) => {
  const mediaType = ['none', 'link', 'video'].includes(payload.mediaType) ? payload.mediaType : 'none';
  const mediaUrl = String(payload.mediaUrl || '').trim();

  if (mediaType !== 'none' && !mediaUrl) {
    const error = new Error('mediaUrl is required when mediaType is link or video.');
    error.statusCode = 400;
    throw error;
  }

  return {
    title: String(payload.title || '').trim(),
    category: String(payload.category || '').trim(),
    durationMinutes: Number(payload.durationMinutes),
    description: String(payload.description || '').trim(),
    mediaType,
    mediaUrl: mediaType === 'none' ? '' : mediaUrl,
  };
};

const getExercises = async (req, res) => {
  try {
    const category = (req.query.category || '').trim();
    const search = (req.query.search || '').trim();
    const query = {};

    if (category) {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const exercises = await Exercise.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Exercises fetched successfully.',
      data: exercises,
      filters: {
        category: category || null,
        search: search || null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch exercises.',
      error: error.message,
    });
  }
};

const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Exercise fetched successfully.',
      data: exercise,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to fetch exercise.',
      error: error.message,
    });
  }
};

const createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create(sanitizeExercisePayload(req.body));

    return res.status(201).json({
      success: true,
      message: 'Exercise created successfully.',
      data: exercise,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create exercise.',
      error: error.message,
    });
  }
};

const updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, sanitizeExercisePayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Exercise updated successfully.',
      data: exercise,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update exercise.',
      error: error.message,
    });
  }
};

const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Exercise deleted successfully.',
      data: { id: req.params.id },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to delete exercise.',
      error: error.message,
    });
  }
};

export { getExercises, getExerciseById, createExercise, updateExercise, deleteExercise };
