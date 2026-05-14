import { USER_MOOD_OPTIONS } from '../constants/moods.constants.js';

const MOOD_LEVELS = {
  Radiant: 0,
  Calm: 1,
  Steady: 2,
  Tired: 3,
  Overwhelmed: 4,
};

const FAVORABLE_CATEGORIES = {
  Radiant: ['gratitude', 'reflection', 'mindfulness'],
  Calm: ['meditation', 'gratitude', 'breathing'],
  Steady: ['mindfulness', 'meditation', 'focus'],
  Tired: ['sleep', 'rest', 'recovery', 'breathing'],
  Overwhelmed: ['breathing', 'anxiety', 'calm', 'meditation'],
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const getGoalMood = (currentMood) => {
  if (currentMood === 'Radiant' || currentMood === 'Calm') {
    return currentMood;
  }

  return 'Calm';
};

const getMoodDistance = (fromMood, toMood) => Math.abs((MOOD_LEVELS[fromMood] ?? 0) - (MOOD_LEVELS[toMood] ?? 0));

const getNextMoodTowardsGoal = (currentMood, goalMood) => {
  const currentLevel = MOOD_LEVELS[currentMood];
  const goalLevel = MOOD_LEVELS[goalMood];

  if (currentLevel === undefined || goalLevel === undefined || currentLevel <= goalLevel) {
    return currentMood;
  }

  return USER_MOOD_OPTIONS[currentLevel - 1];
};

const getCategoryBonus = (exercise, mood) => {
  const normalizedCategory = String(exercise.category || '').toLowerCase();
  const favorable = FAVORABLE_CATEGORIES[mood] || [];
  return favorable.some((item) => normalizedCategory.includes(item)) ? 0.35 : 0;
};

const getEdgeCost = (exercise, currentMood) => {
  const durationPenalty = Number(exercise.durationMinutes || 0) / 30;
  const mediaPenalty = exercise.mediaType === 'video' ? 0.2 : exercise.mediaType === 'link' ? 0.1 : 0;
  const cost = 1 + durationPenalty + mediaPenalty - getCategoryBonus(exercise, currentMood);

  return Number(Math.max(1, cost).toFixed(2));
};

const normalizeExercise = (exercise, currentMood, goalMood) => {
  const nextMood = getNextMoodTowardsGoal(currentMood, goalMood);
  const aiScore = getEdgeCost(exercise, currentMood);

  return {
    ...exercise,
    aiScore,
    aiReason: `Targets ${currentMood} mood and guides toward ${nextMood}.`,
    transition: {
      fromMood: currentMood,
      toMood: nextMood,
    },
  };
};

const buildStep = (exercise, currentMood, goalMood) => {
  const nextMood = getNextMoodTowardsGoal(currentMood, goalMood);
  return {
    fromMood: currentMood,
    toMood: nextMood,
    exerciseId: exercise._id?.toString?.() || String(exercise._id || ''),
    exerciseTitle: exercise.title,
    targetMood: exercise.targetMood,
    cost: getEdgeCost(exercise, currentMood),
  };
};

const matchesMood = (exercise, mood) =>
  normalizeText(exercise.targetMood) === normalizeText(mood) || normalizeText(exercise.category) === normalizeText(mood);

const getExercisesForMood = (exercises, mood) =>
  exercises
    .filter((exercise) => matchesMood(exercise, mood))
    .sort((left, right) => getEdgeCost(left, mood) - getEdgeCost(right, mood));

const summarizePath = (path, exploredStates, goalMood, foundPath = false) => ({
  foundPath,
  exploredStates,
  totalSteps: path.length,
  totalCost: Number(path.reduce((sum, step) => sum + step.cost, 0).toFixed(2)),
  path,
});

const generatePathUsingBFS = async ({ currentMood, goalMood, exercises }) => {
  const queue = [{ mood: currentMood, path: [], exploredStates: [currentMood] }];
  const visited = new Set([currentMood]);
  const discovered = [];
  let bestPartial = [];

  while (queue.length) {
    const current = queue.shift();
    discovered.push(current.mood);

    if (current.path.length > bestPartial.length) {
      bestPartial = current.path;
    }

    if (current.mood === goalMood) {
      return summarizePath(current.path, discovered, goalMood, true);
    }

    const availableExercises = getExercisesForMood(exercises, current.mood);
    if (!availableExercises.length) {
      continue;
    }

    const nextMood = getNextMoodTowardsGoal(current.mood, goalMood);
    if (visited.has(nextMood)) {
      continue;
    }

    visited.add(nextMood);
    queue.push({
      mood: nextMood,
      path: [...current.path, buildStep(availableExercises[0], current.mood, goalMood)],
      exploredStates: [...current.exploredStates, nextMood],
    });
  }

  return summarizePath(bestPartial, discovered, goalMood, false);
};

const generatePathUsingAStar = async ({ currentMood, goalMood, exercises }) => {
  const openSet = [
    {
      mood: currentMood,
      gScore: 0,
      fScore: getMoodDistance(currentMood, goalMood),
      path: [],
      exploredStates: [currentMood],
    },
  ];
  const bestScores = new Map([[currentMood, 0]]);
  const discovered = [];
  let bestPartial = [];

  while (openSet.length) {
    openSet.sort((left, right) => left.fScore - right.fScore || left.gScore - right.gScore);
    const current = openSet.shift();
    discovered.push(current.mood);

    if (current.path.length > bestPartial.length) {
      bestPartial = current.path;
    }

    if (current.mood === goalMood) {
      return summarizePath(current.path, discovered, goalMood, true);
    }

    const availableExercises = getExercisesForMood(exercises, current.mood);
    if (!availableExercises.length) {
      continue;
    }

    const nextMood = getNextMoodTowardsGoal(current.mood, goalMood);
    const bestExercise = availableExercises[0];
    const tentativeG = Number((current.gScore + getEdgeCost(bestExercise, current.mood)).toFixed(2));

    if (tentativeG >= (bestScores.get(nextMood) ?? Number.POSITIVE_INFINITY)) {
      continue;
    }

    bestScores.set(nextMood, tentativeG);
    openSet.push({
      mood: nextMood,
      gScore: tentativeG,
      fScore: tentativeG + getMoodDistance(nextMood, goalMood),
      path: [...current.path, buildStep(bestExercise, current.mood, goalMood)],
      exploredStates: [...current.exploredStates, nextMood],
    });
  }

  return summarizePath(bestPartial, discovered, goalMood, false);
};

const buildRecommendationResponse = ({ currentMood, exercises, limit = 3 }) => {
  const goalMood = getGoalMood(currentMood);
  const moodMatchedExercises = getExercisesForMood(exercises, currentMood)
    .slice(0, Math.max(Number(limit) || 3, 1))
    .map((exercise) => normalizeExercise(exercise, currentMood, goalMood));

  return {
    currentMood,
    goalMood,
    recommendedExercises: moodMatchedExercises,
    problemFormulation: {
      initialState: currentMood,
      goalState: goalMood,
      actions: 'Choose an exercise tagged for the user current mood.',
      transition: 'Each selected exercise moves the user one step toward the calmer goal mood.',
    },
  };
};

export { buildRecommendationResponse, generatePathUsingBFS, generatePathUsingAStar, getGoalMood };
