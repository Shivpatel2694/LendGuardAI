const jwt = require('jsonwebtoken');
const UserModel = require('../models/Lender');

// JWT secret should be in environment variables for production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const auth = async (req, res, next) => {
  try {
    // Get the token from the header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the user
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    // Add the user to the request object
    req.user = {
      id: user.id,
      email: user.email
    };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
};

module.exports = auth;
