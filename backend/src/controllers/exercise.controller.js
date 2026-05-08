import Exercise from '../models/exercise.model.js';

const getExercises = async (req, res) => {
  try {
    const category = (req.query.category || '').trim();
    const query = category ? { category: { $regex: `^${category}$`, $options: 'i' } } : {};

    const exercises = await Exercise.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Exercises fetched successfully.',
      data: exercises,
      filters: {
        category: category || null,
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

const createExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);

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
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
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

export { getExercises, createExercise, updateExercise, deleteExercise };
