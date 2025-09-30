const User = require('../models/User');
// const bcrypt = require('bcryptjs'); // You can comment this out

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    // Compare plain text password (for testing only)
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    res.json({ message: 'Login successful.', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};