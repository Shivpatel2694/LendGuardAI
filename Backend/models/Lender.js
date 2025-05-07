const db = require('../config/db');
const bcrypt = require('bcryptjs');

const UserModel = {
  // Create a new user (lender)
  async create(userData) {
    const {
      company_name,
      registration_number,
      email,
      contact_person,
      designation,
      password,
      logo_path
    } = userData;

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO lenders (
        company_name,
        registration_number,
        email,
        contact_person,
        designation,
        password,
        logo_path,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, company_name, email, created_at
    `;

    const values = [
      company_name,
      registration_number,
      email.toLowerCase(),
      contact_person,
      designation,
      hashedPassword,
      logo_path || null
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      // Check for duplicate email constraint violation
      if (error.code === '23505' && error.constraint === 'lenders_email_key') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  },

  // Find user by email
  async findByEmail(email) {
    const query = 'SELECT * FROM lenders WHERE email = $1';
    const result = await db.query(query, [email.toLowerCase()]);
    return result.rows[0];
  },

  // Find user by ID
  async findById(id) {
    const query = 'SELECT * FROM lenders WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  // Update user information
  async update(id, updateData) {
    const allowedUpdates = [
      'company_name',
      'contact_person',
      'designation',
      'logo_path'
    ];

    const updates = Object.keys(updateData)
      .filter(key => allowedUpdates.includes(key) && updateData[key] !== undefined)
      .map(key => ({ field: key, value: updateData[key] }));

    if (updates.length === 0) return null;

    const setClause = updates.map((update, index) => `${update.field} = $${index + 2}`).join(', ');
    const values = updates.map(update => update.value);

    const query = `
      UPDATE lenders
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING id, company_name, email, updated_at
    `;

    const result = await db.query(query, [id, ...values]);
    return result.rows[0];
  },

  // Validate user credentials
  async validateCredentials(email, password) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    // Don't return password in the user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};

module.exports = UserModel;
