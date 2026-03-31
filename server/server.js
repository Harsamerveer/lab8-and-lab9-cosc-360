require('dotenv').config(); // Load environment variables [cite: 41]
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Serve the uploads folder so frontend can display the images [cite: 21]
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Note: Move your Lab 8 Product logic to routes/productRoutes.js and controllers/productController.js to be fully compliant.

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Mount routes
app.use('/api/auth', authRoutes);

// Use environment variable for PORT [cite: 40]
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));