const adminLogin = (req, res) => {
  // TODO: Validate admin credentials and return admin token.
  res.status(501).json({ message: 'adminLogin not implemented yet.' });
};

const getAllUsers = (req, res) => {
  // TODO: Return paginated list of users for admin panel.
  res.status(501).json({ message: 'getAllUsers not implemented yet.' });
};

const manageExercises = (req, res) => {
  // TODO: Create/update/delete exercises from admin dashboard.
  res.status(501).json({ message: 'manageExercises not implemented yet.' });
};

export { adminLogin, getAllUsers, manageExercises };
