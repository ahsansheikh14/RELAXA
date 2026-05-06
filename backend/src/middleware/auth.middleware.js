const protect = (req, res, next) => {
  // TODO: Verify JWT token and attach authenticated user data to req.user.
  next();
};

const adminOnly = (req, res, next) => {
  // TODO: Check req.user role and allow only admins.
  next();
};

export { protect, adminOnly };
