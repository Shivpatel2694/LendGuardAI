const { Pool } = require('pg');
require('dotenv').config();

// Better to use environment variables for production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://DevPatel:DevPatel123@localhost:5432/LoanDB',
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
