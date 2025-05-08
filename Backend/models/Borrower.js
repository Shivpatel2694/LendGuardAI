const { Pool } = require('pg');

const pool = new Pool({
  user: 'DevPatel',
  host: 'localhost',
  database: 'LoanDB',
  password: 'DevPatel123',
  port: 5432,
});

const Borrower = {
  async findByLenderId(lenderId) {
    try {
      // Fetch borrowers with total loan_amount
      const borrowerResult = await pool.query(
        `SELECT
          b.id,
          b.first_name || ' ' || b.last_name AS name,
          b.first_name,
          b.last_name,
          b.email,
          b.phone_number,
          b.aadhar_number,
          b.pan_number,
          b.date_of_birth,
          b.address,
          b.created_at,
          b.updated_at,
          COALESCE(SUM(l.loan_amount), 0) AS loan_amount
        FROM borrowers b
        LEFT JOIN loans l ON b.id = l.borrower_id
        WHERE b.lender_id = $1
        GROUP BY b.id, b.first_name, b.last_name, b.email, b.phone_number,
                 b.aadhar_number, b.pan_number, b.date_of_birth, b.address,
                 b.created_at, b.updated_at`,
        [lenderId]
      );

      const borrowers = borrowerResult.rows;

      // Fetch loans for all borrowers
      const loanResult = await pool.query(
        `SELECT
          id,
          borrower_id,
          loan_amount,
          interest_rate,
          tenure_months,
          emi_amount,
          loan_status,
          disbursement_date
        FROM loans
        WHERE lender_id = $1`,
        [lenderId]
      );

      // Fetch financial transactions for all borrowers
      const transactionResult = await pool.query(
        `SELECT
          id,
          borrower_id,
          account_number,
          transaction_date,
          transaction_type,
          amount,
          balance,
          category,
          description
        FROM financial_transactions
        WHERE borrower_id IN (
          SELECT id FROM borrowers WHERE lender_id = $1
        )`,
        [lenderId]
      );

      // Map loans and transactions to borrowers
      const loans = loanResult.rows;
      const transactions = transactionResult.rows;

      return borrowers.map(borrower => ({
        ...borrower,
        loans: loans.filter(loan => loan.borrower_id === borrower.id),
        financial_transactions: transactions.filter(t => t.borrower_id === borrower.id)
      }));
    } catch (error) {
      throw new Error(`Error fetching borrowers: ${error.message}`);
    }
  },

  async create(borrowerData) {
    const {
      id,
      lender_id,
      first_name,
      last_name,
      email,
      phone_number,
      aadhar_number,
      pan_number,
      date_of_birth,
      address
    } = borrowerData;

    try {
      const result = await pool.query(
        `INSERT INTO borrowers (
          id, lender_id, first_name, last_name, email, phone_number,
          aadhar_number, pan_number, date_of_birth, address
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          id, lender_id, first_name, last_name, email, phone_number,
          aadhar_number, pan_number, date_of_birth, address
        ]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating borrower: ${error.message}`);
    }
  },

  async findById(id) {
    try {
      const result = await pool.query(
        `SELECT * FROM borrowers WHERE id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching borrower: ${error.message}`);
    }
  },

  async update(id, updates) {
    const allowedFields = [
      'first_name', 'last_name', 'email', 'phone_number',
      'aadhar_number', 'pan_number', 'date_of_birth', 'address'
    ];
    const fields = Object.keys(updates).filter(f => allowedFields.includes(f));
    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    const values = [id, ...fields.map(f => updates[f])];

    try {
      const result = await pool.query(
        `UPDATE borrowers SET ${setClause}, updated_at = NOW()
        WHERE id = $1 RETURNING *`,
        values
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating borrower: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      const result = await pool.query(
        `DELETE FROM borrowers WHERE id = $1 RETURNING id`,
        [id]
      );
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Error deleting borrower: ${error.message}`);
    }
  }
};

module.exports = Borrower;
