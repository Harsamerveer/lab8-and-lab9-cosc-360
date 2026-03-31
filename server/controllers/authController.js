const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  console.log("=== BACKEND: Signup Route Hit ===");
  console.log("Req Body:", req.body);
  console.log("Req File (Image):", req.file ? "File received!" : "No file attached");

  try {
    const { email, password } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed successfully.");
    
    const imagePath = req.file ? req.file.path : null;

    const newUser = await User.create({
      email,
      password: hashedPassword,
      imagePath
    });

    console.log("User successfully saved to DB:", newUser._id);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  console.log("=== BACKEND: Login Route Hit ===");
  console.log("Attempting login for:", req.body.email);

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("Login Failed: User not found in DB.");
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login Failed: Passwords do not match.");
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log("Login Successful for:", user.email);
    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};