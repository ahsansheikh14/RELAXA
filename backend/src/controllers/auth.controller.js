const registerUser = (req, res) => {
  // TODO: Validate input, hash password, create user, return token.
  res.status(501).json({ message: 'registerUser not implemented yet.' });
};

const loginUser = (req, res) => {
  // TODO: Verify credentials and return access token.
  res.status(501).json({ message: 'loginUser not implemented yet.' });
};

export { registerUser, loginUser };
