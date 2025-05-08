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

// Updated Risk scoring constants
const RISK_PROFILES = {
  VERY_HIGH_RISK: 'Very High Risk',
  HIGH_RISK: 'High Risk',
  MODERATE_RISK: 'Moderate Risk',
  LOW_RISK: 'Low Risk'
};

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

// Generate risk profile characteristics for a borrower
function generateRiskProfile(riskType) {
  switch (riskType) {
    case RISK_PROFILES.VERY_HIGH_RISK:
      return {
        credit_score: faker.number.int({ min: 300, max: 450 }),
        income: faker.number.int({ min: 8000, max: 15000 }),
        employment_status: faker.helpers.arrayElement(['Unemployed', 'Temporary']),
        debt_to_income: faker.number.float({ min: 0.7, max: 0.95, precision: 0.01 }),
        payment_pattern: 'Highly Irregular',
        late_payments: faker.number.int({ min: 6, max: 12 }),
        existing_loans: faker.number.int({ min: 3, max: 6 })
      };
    case RISK_PROFILES.HIGH_RISK:
      return {
        credit_score: faker.number.int({ min: 451, max: 550 }),
        income: faker.number.int({ min: 15001, max: 25000 }),
        employment_status: faker.helpers.arrayElement(['Unemployed', 'Part-time', 'Contract']),
        debt_to_income: faker.number.float({ min: 0.5, max: 0.7, precision: 0.01 }),
        payment_pattern: 'Irregular',
        late_payments: faker.number.int({ min: 3, max: 5 }),
        existing_loans: faker.number.int({ min: 2, max: 4 })
      };
    case RISK_PROFILES.MODERATE_RISK:
      return {
        credit_score: faker.number.int({ min: 551, max: 670 }),
        income: faker.number.int({ min: 25001, max: 50000 }),
        employment_status: faker.helpers.arrayElement(['Full-time', 'Self-employed']),
        debt_to_income: faker.number.float({ min: 0.3, max: 0.5, precision: 0.01 }),
        payment_pattern: 'Mostly regular',
        late_payments: faker.number.int({ min: 1, max: 2 }),
        existing_loans: faker.number.int({ min: 1, max: 2 })
      };
    case RISK_PROFILES.LOW_RISK:
      return {
        credit_score: faker.number.int({ min: 671, max: 850 }),
        income: faker.number.int({ min: 50001, max: 150000 }),
        employment_status: 'Full-time',
        debt_to_income: faker.number.float({ min: 0.1, max: 0.3, precision: 0.01 }),
        payment_pattern: 'Regular',
        late_payments: 0,
        existing_loans: faker.number.int({ min: 0, max: 1 })
      };
    default:
      return generateRiskProfile(RISK_PROFILES.LOW_RISK);
  }
}

// Generate transaction patterns based on risk profile
function generateTransactionPatterns(riskProfile) {
  const patterns = {
    transactionFrequency: 0,
    averageBalance: 0,
    volatility: 0,
    bounceRate: 0,
    savingTendency: 0,
    largeWithdrawals: 0
  };

  switch (riskProfile) {
    case RISK_PROFILES.VERY_HIGH_RISK:
      patterns.transactionFrequency = faker.number.int({ min: 20, max: 40 });
      patterns.averageBalance = faker.number.float({ min: 100, max: 1500, precision: 0.01 });
      patterns.volatility = faker.number.float({ min: 0.6, max: 0.9, precision: 0.01 });
      patterns.bounceRate = faker.number.float({ min: 0.25, max: 0.4, precision: 0.01 });
      patterns.savingTendency = 0;
      patterns.largeWithdrawals = faker.number.int({ min: 3, max: 7 });
      break;
    case RISK_PROFILES.HIGH_RISK:
      patterns.transactionFrequency = faker.number.int({ min: 15, max: 30 });
      patterns.averageBalance = faker.number.float({ min: 500, max: 3000, precision: 0.01 });
      patterns.volatility = faker.number.float({ min: 0.4, max: 0.6, precision: 0.01 });
      patterns.bounceRate = faker.number.float({ min: 0.15, max: 0.25, precision: 0.01 });
      patterns.savingTendency = faker.number.float({ min: 0, max: 0.1, precision: 0.01 });
      patterns.largeWithdrawals = faker.number.int({ min: 2, max: 4 });
      break;
    case RISK_PROFILES.MODERATE_RISK:
      patterns.transactionFrequency = faker.number.int({ min: 8, max: 15 });
      patterns.averageBalance = faker.number.float({ min: 3000, max: 10000, precision: 0.01 });
      patterns.volatility = faker.number.float({ min: 0.2, max: 0.4, precision: 0.01 });
      patterns.bounceRate = faker.number.float({ min: 0.05, max: 0.15, precision: 0.01 });
      patterns.savingTendency = faker.number.float({ min: 0.1, max: 0.3, precision: 0.01 });
      patterns.largeWithdrawals = faker.number.int({ min: 1, max: 2 });
      break;
    case RISK_PROFILES.LOW_RISK:
      patterns.transactionFrequency = faker.number.int({ min: 3, max: 8 });
      patterns.averageBalance = faker.number.float({ min: 10000, max: 50000, precision: 0.01 });
      patterns.volatility = faker.number.float({ min: 0.05, max: 0.2, precision: 0.01 });
      patterns.bounceRate = faker.number.float({ min: 0, max: 0.05, precision: 0.01 });
      patterns.savingTendency = faker.number.float({ min: 0.3, max: 0.5, precision: 0.01 });
      patterns.largeWithdrawals = faker.number.int({ min: 0, max: 1 });
      break;
  }

  return patterns;
}

// Generate transactions that reflect a borrower's risk profile
function generateRiskBasedTransactions(borrowerId, riskProfile, numMonths = 12) {
  const transactionPatterns = generateTransactionPatterns(riskProfile);
  const transactions = [];

  let currentBalance = transactionPatterns.averageBalance * (1.0 + faker.number.float({ min: -0.2, max: 0.2 }));
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - numMonths);

  if (riskProfile !== RISK_PROFILES.VERY_HIGH_RISK || faker.datatype.boolean(0.4)) {
    const salaryAmount = riskProfile === RISK_PROFILES.VERY_HIGH_RISK ?
      faker.number.float({ min: 8000, max: 15000, precision: 0.01 }) :
      riskProfile === RISK_PROFILES.HIGH_RISK ?
        faker.number.float({ min: 15000, max: 25000, precision: 0.01 }) :
        riskProfile === RISK_PROFILES.MODERATE_RISK ?
          faker.number.float({ min: 25000, max: 45000, precision: 0.01 }) :
          faker.number.float({ min: 50000, max: 120000, precision: 0.01 });

    for (let i = 0; i < numMonths; i++) {
      const transactionDate = new Date(startDate);
      transactionDate.setMonth(startDate.getMonth() + i);
      transactionDate.setDate(faker.number.int({ min: 1, max: 5 }));

      if ((riskProfile === RISK_PROFILES.VERY_HIGH_RISK && faker.datatype.boolean(0.4)) ||
          (riskProfile === RISK_PROFILES.HIGH_RISK && faker.datatype.boolean(0.2))) {
        continue;
      }

      const actualSalary = salaryAmount * (1.0 + faker.number.float({ min: -0.1, max: 0.1 }));
      currentBalance += actualSalary;

      transactions.push({
        id: uuidv4(),
        borrower_id: borrowerId,
        account_number: faker.finance.accountNumber(),
        transaction_date: transactionDate,
        transaction_type: 'Credit',
        amount: actualSalary.toFixed(2),
        balance: currentBalance.toFixed(2),
        category: 'Salary',
        description: 'Monthly Salary Credit'
      });
    }
  }

  const expenseCategories = ['Rent/Mortgage', 'Utilities', 'Groceries', 'Transportation', 'Entertainment', 'Shopping'];

  for (let i = 0; i < numMonths; i++) {
    const monthDate = new Date(startDate);
    monthDate.setMonth(startDate.getMonth() + i);

    const numExpenses = faker.number.int({ min: 3, max: 6 });

    for (let j = 0; j < numExpenses; j++) {
      const expenseDate = new Date(monthDate);
      expenseDate.setDate(faker.number.int({ min: 5, max: 28 }));

      const category = faker.helpers.arrayElement(expenseCategories);
      let expenseAmount;

      switch (category) {
        case 'Rent/Mortgage':
          expenseAmount = riskProfile === RISK_PROFILES.VERY_HIGH_RISK ?
            currentBalance * faker.number.float({ min: 0.5, max: 0.8 }) :
            riskProfile === RISK_PROFILES.HIGH_RISK ?
              currentBalance * faker.number.float({ min: 0.4, max: 0.6 }) :
              currentBalance * faker.number.float({ min: 0.2, max: 0.4 });
          break;
        default:
          expenseAmount = currentBalance * faker.number.float({ min: 0.05, max: 0.2 });
      }

      if (currentBalance - expenseAmount < 500 &&
         (riskProfile === RISK_PROFILES.LOW_RISK || riskProfile === RISK_PROFILES.MODERATE_RISK)) {
        expenseAmount = currentBalance - 500;
      }

      if (expenseAmount > 0) {
        currentBalance -= expenseAmount;

        transactions.push({
          id: uuidv4(),
          borrower_id: borrowerId,
          account_number: faker.finance.accountNumber(),
          transaction_date: expenseDate,
          transaction_type: 'Debit',
          amount: expenseAmount.toFixed(2),
          balance: currentBalance.toFixed(2),
          category: category,
          description: `Payment - ${category}`
        });
      }
    }

    if ((riskProfile === RISK_PROFILES.VERY_HIGH_RISK && faker.datatype.boolean(0.5)) ||
        (riskProfile === RISK_PROFILES.HIGH_RISK && faker.datatype.boolean(0.3))) {
      const bounceDate = new Date(monthDate);
      bounceDate.setDate(faker.number.int({ min: 15, max: 28 }));

      const bounceAmount = riskProfile === RISK_PROFILES.VERY_HIGH_RISK ?
        faker.number.float({ min: 500, max: 3000 }) :
        faker.number.float({ min: 500, max: 2000 });

      transactions.push({
        id: uuidv4(),
        borrower_id: borrowerId,
        account_number: faker.finance.accountNumber(),
        transaction_date: bounceDate,
        transaction_type: 'Debit',
        amount: bounceAmount.toFixed(2),
        balance: currentBalance.toFixed(2),
        category: 'Fees',
        description: 'Payment Reversal Fee'
      });
    }

    if (riskProfile === RISK_PROFILES.LOW_RISK && faker.datatype.boolean(0.7)) {
      const savingsDate = new Date(monthDate);
      savingsDate.setDate(faker.number.int({ min: 1, max: 10 }));

      const savingsAmount = currentBalance * faker.number.float({ min: 0.05, max: 0.15 });
      currentBalance -= savingsAmount;

      transactions.push({
        id: uuidv4(),
        borrower_id: borrowerId,
        account_number: faker.finance.accountNumber(),
        transaction_date: savingsDate,
        transaction_type: 'Debit',
        amount: savingsAmount.toFixed(2),
        balance: currentBalance.toFixed(2),
        category: 'Transfer',
        description: 'Transfer to Savings Account'
      });
    }

    if ((riskProfile === RISK_PROFILES.VERY_HIGH_RISK && i > numMonths - 3 && faker.datatype.boolean(0.8)) ||
        (riskProfile === RISK_PROFILES.HIGH_RISK && i > numMonths - 3 && faker.datatype.boolean(0.6))) {
      const withdrawalDate = new Date(monthDate);
      withdrawalDate.setDate(faker.number.int({ min: 1, max: 28 }));

      const withdrawalAmount = riskProfile === RISK_PROFILES.VERY_HIGH_RISK ?
        currentBalance * faker.number.float({ min: 0.6, max: 0.9 }) :
        currentBalance * faker.number.float({ min: 0.4, max: 0.7 });
      currentBalance -= withdrawalAmount;

      transactions.push({
        id: uuidv4(),
        borrower_id: borrowerId,
        account_number: faker.finance.accountNumber(),
        transaction_date: withdrawalDate,
        transaction_type: 'Debit',
        amount: withdrawalAmount.toFixed(2),
        balance: currentBalance.toFixed(2),
        category: 'ATM',
        description: 'ATM Withdrawal'
      });
    }
  }

  if ((riskProfile !== RISK_PROFILES.VERY_HIGH_RISK || faker.datatype.boolean(0.2)) &&
      (riskProfile !== RISK_PROFILES.HIGH_RISK || faker.datatype.boolean(0.4))) {
    const loanRepaymentAmount = riskProfile === RISK_PROFILES.VERY_HIGH_RISK ?
      faker.number.float({ min: 3000, max: 7000 }) :
      riskProfile === RISK_PROFILES.HIGH_RISK ?
        faker.number.float({ min: 2000, max: 5000 }) :
        faker.number.float({ min: 5000, max: 20000 });

    for (let i = 0; i < numMonths; i++) {
      const repaymentDate = new Date(startDate);
      repaymentDate.setMonth(startDate.getMonth() + i);
      repaymentDate.setDate(faker.number.int({ min: 10, max: 15 }));

      if ((riskProfile === RISK_PROFILES.VERY_HIGH_RISK && faker.datatype.boolean(0.6)) ||
          (riskProfile === RISK_PROFILES.HIGH_RISK && faker.datatype.boolean(0.4))) {
        continue;
      }

      currentBalance -= loanRepaymentAmount;

      transactions.push({
        id: uuidv4(),
        borrower_id: borrowerId,
        account_number: faker.finance.accountNumber(),
        transaction_date: repaymentDate,
        transaction_type: 'Debit',
        amount: loanRepaymentAmount.toFixed(2),
        balance: Math.max(currentBalance, 0).toFixed(2),
        category: 'Loan',
        description: 'Loan EMI Payment'
      });
    }
  }

  return transactions.sort((a, b) => a.transaction_date - b.transaction_date);
}

// This ensures all required tables and columns exist before starting data generation
async function ensureSchemaExists() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE borrowers
      ADD COLUMN IF NOT EXISTS credit_score INTEGER,
      ADD COLUMN IF NOT EXISTS income NUMERIC,
      ADD COLUMN IF NOT EXISTS employment_status VARCHAR(50),
      ADD COLUMN IF NOT EXISTS debt_to_income NUMERIC,
      ADD COLUMN IF NOT EXISTS payment_pattern VARCHAR(50),
      ADD COLUMN IF NOT EXISTS late_payments INTEGER,
      ADD COLUMN IF NOT EXISTS existing_loans INTEGER,
      ADD COLUMN IF NOT EXISTS risk_profile VARCHAR(50)
    `);

    await client.query(`ALTER TABLE loans ADD COLUMN IF NOT EXISTS risk_score INTEGER`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS financial_transactions (
        id UUID PRIMARY KEY,
        borrower_id UUID REFERENCES borrowers(id),
        account_number VARCHAR(50),
        transaction_date DATE,
        transaction_type VARCHAR(20),
        amount NUMERIC,
        balance NUMERIC,
        category VARCHAR(50),
        description TEXT
      )
    `);

    console.log('Schema checks completed - all required tables and columns exist');
  } catch (error) {
    console.error('Error ensuring schema exists:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function generateMockData(lenderId) {
  console.log('Generating mock data for lender:', lenderId);
  if (!lenderId || typeof lenderId !== 'string') {
    throw new Error('Invalid or missing lenderId');
  }

  await ensureSchemaExists();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Checking lender existence...');
    const lenderCheck = await client.query('SELECT id FROM lenders WHERE id = $1', [lenderId]);
    if (lenderCheck.rowCount === 0) {
      throw new Error(`Lender with id ${lenderId} not found`);
    }

    console.log('Generating borrowers with more realistic risk distribution...');
    const totalBorrowers = 10;

    const includeVeryHighRisk = faker.datatype.boolean(0.3); // Reduced probability of very high risk
    const veryHighRiskCount = includeVeryHighRisk ? 1 : 0;
    const highRiskCount = faker.number.int({ min: 1, max: 2 });
    const moderateRiskCount = faker.number.int({ min: 1, max: 2 }); // Reduced upper limit for moderate risk
    const lowRiskCount = totalBorrowers - veryHighRiskCount - highRiskCount - moderateRiskCount;

    console.log(`Creating ${veryHighRiskCount} very high risk, ${highRiskCount} high risk, ${moderateRiskCount} moderate risk, and ${lowRiskCount} low risk borrowers`);

    const riskProfiles = [
      ...Array(veryHighRiskCount).fill(RISK_PROFILES.VERY_HIGH_RISK),
      ...Array(highRiskCount).fill(RISK_PROFILES.HIGH_RISK),
      ...Array(moderateRiskCount).fill(RISK_PROFILES.MODERATE_RISK),
      ...Array(lowRiskCount).fill(RISK_PROFILES.LOW_RISK)
    ];

    const shuffledRiskProfiles = [...riskProfiles].sort(() => 0.5 - Math.random());

    const borrowers = [];
    for (let i = 0; i < totalBorrowers; i++) {
      const riskProfile = shuffledRiskProfiles[i];
      const riskCharacteristics = generateRiskProfile(riskProfile);

      const borrower = {
        id: uuidv4(),
        lender_id: lenderId,
        risk_profile: riskProfile,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: await generateUniqueValue(client, 'borrowers', 'email', () => faker.internet.email()),
        phone_number: faker.phone.number(),
        aadhar_number: await generateUniqueValue(client, 'borrowers', 'aadhar_number', () => faker.string.numeric({ length: 12 })),
        pan_number: await generateUniqueValue(client, 'borrowers', 'pan_number', () => faker.string.alphanumeric({ length: 10 }).toUpperCase()),
        date_of_birth: faker.date.past({ years: 50, refDate: new Date(2000, 0, 1) }),
        address: faker.location.streetAddress(),
        credit_score: riskCharacteristics.credit_score,
        income: riskCharacteristics.income,
        employment_status: riskCharacteristics.employment_status,
        debt_to_income: riskCharacteristics.debt_to_income,
        payment_pattern: riskCharacteristics.payment_pattern,
        late_payments: riskCharacteristics.late_payments,
        existing_loans: riskCharacteristics.existing_loans
      };

      borrowers.push(borrower);
      console.log(`Creating ${riskProfile} borrower ${borrower.id}: ${borrower.first_name} ${borrower.last_name}`);

      await client.query(`
        INSERT INTO borrowers (
          id, lender_id, first_name, last_name, email, phone_number, aadhar_number,
          pan_number, date_of_birth, address, credit_score, income, employment_status,
          debt_to_income, payment_pattern, late_payments, existing_loans, risk_profile
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `, [
        borrower.id, borrower.lender_id, borrower.first_name, borrower.last_name,
        borrower.email, borrower.phone_number, borrower.aadhar_number, borrower.pan_number,
        borrower.date_of_birth, borrower.address, borrower.credit_score, borrower.income,
        borrower.employment_status, borrower.debt_to_income, borrower.payment_pattern,
        borrower.late_payments, borrower.existing_loans, borrower.risk_profile
      ]);
    }

    console.log('Generating loans with risk-appropriate characteristics...');
    const loans = [];
    for (const borrower of borrowers) {
      const numLoans = borrower.risk_profile === RISK_PROFILES.VERY_HIGH_RISK ?
        faker.number.int({ min: 3, max: 4 }) :
        borrower.risk_profile === RISK_PROFILES.HIGH_RISK ?
          faker.number.int({ min: 2, max: 3 }) :
          borrower.risk_profile === RISK_PROFILES.MODERATE_RISK ?
            faker.number.int({ min: 1, max: 2 }) :
            faker.number.int({ min: 0, max: 1 });

      for (let i = 0; i < numLoans; i++) {
        let loanAmount, interestRate, tenureMonths, loanStatus;

        switch (borrower.risk_profile) {
          case RISK_PROFILES.VERY_HIGH_RISK:
            loanAmount = faker.finance.amount({ min: 80000, max: 150000, dec: 0 });
            interestRate = faker.finance.amount({ min: 20, max: 30, dec: 2 });
            tenureMonths = faker.number.int({ min: 36, max: 72 });
            loanStatus = faker.helpers.arrayElement(['Active', 'Overdue', 'Default']);
            break;
          case RISK_PROFILES.HIGH_RISK:
            loanAmount = faker.finance.amount({ min: 50000, max: 100000, dec: 0 });
            interestRate = faker.finance.amount({ min: 15, max: 22, dec: 2 });
            tenureMonths = faker.number.int({ min: 24, max: 60 });
            loanStatus = faker.helpers.arrayElement(['Active', 'Pending', 'Overdue', 'Default']);
            break;
          case RISK_PROFILES.MODERATE_RISK:
            loanAmount = faker.finance.amount({ min: 30000, max: 80000, dec: 0 });
            interestRate = faker.finance.amount({ min: 10, max: 15, dec: 2 });
            tenureMonths = faker.number.int({ min: 12, max: 36 });
            loanStatus = faker.helpers.arrayElement(['Active', 'Pending', 'Closed']);
            break;
          case RISK_PROFILES.LOW_RISK:
            loanAmount = faker.finance.amount({ min: 10000, max: 50000, dec: 0 });
            interestRate = faker.finance.amount({ min: 7, max: 12, dec: 2 });
            tenureMonths = faker.number.int({ min: 6, max: 24 });
            loanStatus = faker.helpers.arrayElement(['Active', 'Closed']);
            break;
          default:
            loanAmount = faker.finance.amount({ min: 10000, max: 50000, dec: 0 });
            interestRate = faker.finance.amount({ min: 7, max: 15, dec: 2 });
            tenureMonths = faker.number.int({ min: 12, max: 36 });
            loanStatus = faker.helpers.arrayElement(['Active', 'Closed']);
        }

        const emiAmount = calculateEMI(loanAmount, interestRate, tenureMonths);

        const disbursementDate = borrower.risk_profile === RISK_PROFILES.VERY_HIGH_RISK ?
          faker.date.recent(90) :
          borrower.risk_profile === RISK_PROFILES.HIGH_RISK ?
            faker.date.recent(180) :
            faker.date.past({ years: 2 });

        loans.push({
          id: uuidv4(),
          borrower_id: borrower.id,
          lender_id: lenderId,
          loan_amount: loanAmount,
          interest_rate: interestRate,
          tenure_months: tenureMonths,
          emi_amount: emiAmount,
          loan_status: loanStatus,
          disbursement_date: disbursementDate,
          risk_score: borrower.risk_profile === RISK_PROFILES.VERY_HIGH_RISK ?
            faker.number.int({ min: 85, max: 100 }) :
            borrower.risk_profile === RISK_PROFILES.HIGH_RISK ?
              faker.number.int({ min: 65, max: 84 }) :
              borrower.risk_profile === RISK_PROFILES.MODERATE_RISK ?
                faker.number.int({ min: 35, max: 64 }) :
                faker.number.int({ min: 10, max: 34 })
        });

        console.log(`Creating loan ${loans.length} for borrower ${borrower.id}: ${loanAmount} at ${interestRate}% for ${tenureMonths} months`);

        await client.query(`
          INSERT INTO loans (
            id, borrower_id, lender_id, loan_amount, interest_rate, tenure_months,
            emi_amount, loan_status, disbursement_date, risk_score
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          loans[loans.length - 1].id, borrower.id, lenderId, loanAmount, interestRate, tenureMonths,
          emiAmount, loanStatus, disbursementDate, loans[loans.length - 1].risk_score
        ]);
      }
    }

    console.log('Generating financial transactions...');
    for (const borrower of borrowers) {
      console.log(`Generating transactions for borrower ${borrower.id}`);
      const transactions = generateRiskBasedTransactions(borrower.id, borrower.risk_profile);

      for (const transaction of transactions) {
        await client.query(`
          INSERT INTO financial_transactions (
            id, borrower_id, account_number, transaction_date, transaction_type,
            amount, balance, category, description
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          transaction.id, transaction.borrower_id, transaction.account_number,
          transaction.transaction_date, transaction.transaction_type, transaction.amount,
          transaction.balance, transaction.category, transaction.description
        ]);
      }
    }

    await client.query('COMMIT');
    console.log('Mock data generation completed successfully');
    return { borrowersCount: borrowers.length, loansCount: loans.length };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error generating mock data:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Controller for the /api/generate-mock-data endpoint
async function generateMockDataController(req, res) {
  console.log('Received request to generate mock data:', req.body);
  try {
    // Handle both lenderId and LenderID for compatibility
    const lenderId = req.body.lenderId || req.body.LenderID;
    console.log('Extracted lenderId:', lenderId);
    if (!lenderId || typeof lenderId !== 'string') {
      throw new Error('Invalid or missing lenderId in request body');
    }
    const result = await generateMockData(lenderId);
    res.status(200).json({
      message: 'Mock data generated successfully',
      borrowersCount: result.borrowersCount,
      loansCount: result.loansCount
    });
  } catch (error) {
    console.error('Error in generateMockDataController:', error);
    res.status(500).json({ error: error.message });
  }
}

// Export the functions
module.exports = {
  calculateEMI,
  generateMockData,
  generateMockDataController,
  RISK_PROFILES
};

// Command line execution support
if (require.main === module) {
  const lenderId = process.argv[2];
  if (!lenderId) {
    console.error('Please provide a lender ID as command line argument');
    process.exit(1);
  }

  generateMockData(lenderId)
    .then(result => {
      console.log(`Created ${result.borrowersCount} borrowers and ${result.loansCount} loans`);
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to generate mock data:', error);
      process.exit(1);
    });
}
