const createMoodEntry = (req, res) => {
  // TODO: Save daily mood entry for the logged in user.
  res.status(501).json({ message: 'createMoodEntry not implemented yet.' });
};

const getMoodHistory = (req, res) => {
  // TODO: Return mood timeline data for charts/reports.
  res.status(501).json({ message: 'getMoodHistory not implemented yet.' });
};

export { createMoodEntry, getMoodHistory };
