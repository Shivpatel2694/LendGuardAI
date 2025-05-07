const UserModel = require('../models/Lender');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// JWT secret should be in environment variables for production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h'; // Token valid for 24 hours

const authController = {
  // User registration (signup)
  async signup(req, res) {
    try {
      const {
        company_name,
        registration_number,
        email,
        contact_person,
        designation,
        password
      } = req.body;

      // Basic validation
      if (!company_name || !email || !password) {
        return res.status(400).json({
          error: 'Company name, email, and password are required'
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Check if email already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      // Handle file upload for company logo
      let logoPath = null;
      if (req.file) {
        logoPath = `/uploads/${req.file.filename}`;
      }

      // Create new user
      const userData = {
        company_name,
        registration_number,
        email,
        contact_person,
        designation,
        password,
        logo_path: logoPath
      };

      const newUser = await UserModel.create(userData);

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return user data and token
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          company_name: newUser.company_name,
          email: newUser.email
        },
        token
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        error: error.message || 'Error creating account'
      });
    }
  },

  // User login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Validate credentials
      const user = await UserModel.validateCredentials(email, password);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          company_name: user.company_name,
          email: user.email
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get current user profile (requires authentication)
  async getCurrentUser(req, res) {
    try {
      // req.user should be available from the auth middleware
      const user = await UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Don't send the password
      const { password, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};



module.exports = authController;
