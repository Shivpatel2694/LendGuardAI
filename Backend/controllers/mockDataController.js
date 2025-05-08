const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const Borrower = require('../models/Borrower');

const pool = new Pool({
  user: 'DevPatel',
  host: 'localhost',
  database: 'LoanDB',
  password: 'DevPatel123',
  port: 5432,
});

function calculateEMI(loanAmount, interestRate, tenureMonths) {
  const monthlyRate = interestRate / 12 / 100;
  const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
  const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;
  return Math.round((numerator / denominator) * 100) / 100;
}

async function generateUniqueValue(client, table, column, generator, maxRetries = 5) {
  let value;
  let retries = 0;
  while (retries < maxRetries) {
    value = generator();
    const result = await client.query(`SELECT 1 FROM ${table} WHERE ${column} = $1`, [value]);
    if (result.rowCount === 0) return value;
    retries++;
  }
  throw new Error(`Failed to generate unique ${column} after ${maxRetries} attempts`);
}

async function generateMockData(lenderId) {
  console.log('Generating mock data for lender:', lenderId);
  if (!lenderId || typeof lenderId !== 'string') {
    throw new Error('Invalid or missing lenderId');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Checking lender existence...');
    const lenderCheck = await client.query('SELECT id FROM lenders WHERE id = $1', [lenderId]);
    if (lenderCheck.rowCount === 0) {
      throw new Error(`Lender with id ${lenderId} not found`);
    }

    console.log('Generating borrowers...');
    const borrowers = [];
    for (let i = 0; i < 5; i++) {
      const borrower = {
        id: uuidv4(),
        lender_id: lenderId,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: await generateUniqueValue(client, 'borrowers', 'email', () => faker.internet.email()),
        phone_number: faker.phone.number(),
        aadhar_number: await generateUniqueValue(client, 'borrowers', 'aadhar_number', () => faker.string.numeric({ length: 12 })),
        pan_number: await generateUniqueValue(client, 'borrowers', 'pan_number', () => faker.string.alphanumeric({ length: 10 }).toUpperCase()),
        date_of_birth: faker.date.past({ years: 50, refDate: new Date(2000, 0, 1) }),
        address: faker.location.streetAddress(),
      };
      borrowers.push(borrower);
      console.log(`Creating borrower ${borrower.id}...`);
      await Borrower.create(borrower);
    }

    console.log('Generating loans...');
    const loans = [];
    for (const borrower of borrowers) {
      const numLoans = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < numLoans; i++) {
        const loanAmount = faker.finance.amount({ min: 5000, max: 100000, dec: 2 });
        const interestRate = faker.finance.amount({ min: 5, max: 15, dec: 2 });
        const tenureMonths = faker.number.int({ min: 12, max: 60 });
        const emiAmount = calculateEMI(loanAmount, interestRate, tenureMonths);
        loans.push({
          id: uuidv4(),
          borrower_id: borrower.id,
          lender_id: lenderId,
          loan_amount: loanAmount,
          interest_rate: interestRate,
          tenure_months: tenureMonths,
          emi_amount: emiAmount,
          loan_status: faker.helpers.arrayElement(['Active', 'Pending', 'Closed']),
          disbursement_date: faker.date.past({ years: 2 }),
        });
      }
    }

    console.log('Inserting loans...');
    for (const loan of loans) {
      await client.query(`
        INSERT INTO loans (id, borrower_id, lender_id, loan_amount, interest_rate, tenure_months, emi_amount, loan_status, disbursement_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        loan.id,
        loan.borrower_id,
        loan.lender_id,
        loan.loan_amount,
        loan.interest_rate,
        loan.tenure_months,
        loan.emi_amount,
        loan.loan_status,
        loan.disbursement_date
      ]);
    }

    console.log('Generating transactions...');
    const transactions = [];
    for (const borrower of borrowers) {
      const numTransactions = faker.number.int({ min: 5, max: 10 });
      for (let i = 0; i < numTransactions; i++) {
        transactions.push({
          id: uuidv4(),
          borrower_id: borrower.id,
          account_number: faker.finance.accountNumber(),
          transaction_date: faker.date.past({ years: 1 }),
          transaction_type: faker.helpers.arrayElement(['Credit', 'Debit']),
          amount: faker.finance.amount({ min: 100, max: 10000, dec: 2 }),
          balance: faker.finance.amount({ min: 1000, max: 50000, dec: 2 }),
          category: faker.finance.transactionType(),
          description: faker.finance.transactionDescription(),
        });
      }
    }

    console.log('Inserting transactions...');
    for (const transaction of transactions) {
      await client.query(`
        INSERT INTO financial_transactions (id, borrower_id, account_number, transaction_date, transaction_type, amount, balance, category, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        transaction.id,
        transaction.borrower_id,
        transaction.account_number,
        transaction.transaction_date,
        transaction.transaction_type,
        transaction.amount,
        transaction.balance,
        transaction.category,
        transaction.description
      ]);
    }

    console.log('Committing transaction...');
    await client.query('COMMIT');
    console.log('Mock data generated successfully');
  } catch (err) {
    console.error('Error in generateMockData:', err.stack);
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

exports.generateMockDataController = async (req, res) => {
  const { lenderId } = req.body;
  try {
    console.log('Received request to generate mock data for lenderId:', lenderId);
    if (!lenderId) {
      return res.status(400).json({ error: 'lenderId is required' });
    }
    await generateMockData(lenderId);
    res.status(200).json({ message: 'Mock data generated successfully' });
  } catch (err) {
    console.error('Error in generateMockDataController:', err.stack);
    res.status(500).json({ error: err.message || 'Failed to generate mock data' });
  }
};
