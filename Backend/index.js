const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const mockDataRouter = require('./Routes/mockDataRouter');
const borrowerRoutes = require('./Routes/borrowerRoutes');
// Import routes
const authRoutes = require('./Routes/auth');

// Initialize express app
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', mockDataRouter);
app.use('/api/borrowers', borrowerRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('LendGuardAI API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }

  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
