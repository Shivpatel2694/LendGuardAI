from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import joblib
import pandas as pd
import numpy as np
from datetime import datetime, date
import uvicorn
from enum import Enum

# Load the pre-trained model
model = joblib.load('loan_default_risk_model.pkl')

# Load the features used for training
with open('model_features.txt', 'r') as f:
    model_features = f.read().split(',')

print(f"Model features: {model_features}")

# Load risk interpretation guide
risk_interpretations = {}
with open('risk_interpretation.txt', 'r') as f:
    for line in f:
        range_str, description = line.strip().split(':', 1)
        risk_interpretations[range_str] = description.strip()

# Define API app
app = FastAPI(
    title="Loan Default Risk Prediction API",
    description="API for predicting borrower risk scores for early loan default detection",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define request models
class LoanStatus(str, Enum):
    ACTIVE = "Active"
    LATE = "Late"
    DEFAULT = "Default"

class Transaction(BaseModel):
    id: str
    borrower_id: str
    account_number: str
    transaction_date: str
    transaction_type: str
    category: Optional[str] = None
    amount: float
    balance: Optional[float] = None
    description: Optional[str] = None

class Loan(BaseModel):
    id: str
    borrower_id: str
    loan_amount: float
    interest_rate: float
    tenure_months: int
    emi_amount: float
    disbursement_date: str
    loan_status: LoanStatus

class BorrowerRequest(BaseModel):
    id: str
    name: str
    first_name: str
    last_name: str
    email: str
    phone_number: str
    address: str
    date_of_birth: str
    aadhar_number: Optional[str] = None
    pan_number: Optional[str] = None
    loan_amount: Optional[float] = None
    loans: List[Loan]
    financial_transactions: List[Transaction]

class RiskResponse(BaseModel):
    borrower_id: str
    borrower_name: str
    risk_score: float
    risk_level: str
    risk_description: str
    risk_factors: List[Dict[str, Any]]
    recommendations: List[str]

# Helper functions
def get_age(dob_str):
    """Calculate age from date of birth string."""
    try:
        dob = datetime.fromisoformat(dob_str.replace('Z', '+00:00'))
        today = date.today()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return age
    except Exception:
        return 30  # Default age if parsing fails

def extract_features(borrower_data):
    """Extract features from borrower data for model prediction."""

    # Basic borrower info
    age = get_age(borrower_data.date_of_birth)

    # Loan info (using the first loan if multiple)
    if borrower_data.loans and len(borrower_data.loans) > 0:
        loan = borrower_data.loans[0]
        loan_amount = loan.loan_amount
        interest_rate = loan.interest_rate
        tenure_months = loan.tenure_months
        emi_amount = loan.emi_amount
        loan_status_str = loan.loan_status
    else:
        # Default values if no loan data
        loan_amount = borrower_data.loan_amount or 0
        interest_rate = 10.0
        tenure_months = 24
        emi_amount = 0
        loan_status_str = "Active"

    # Transaction analysis
    transactions = borrower_data.financial_transactions

    # Count unique accounts
    unique_accounts = len(set(t.account_number for t in transactions))

    # Count transactions by type
    withdrawal_count = sum(1 for t in transactions if t.category == "withdrawal")
    deposit_count = len(transactions) - withdrawal_count

    # Calculate withdrawal to deposit ratio
    withdrawal_deposit_ratio = withdrawal_count / max(1, deposit_count)

    # Calculate transaction stats
    transaction_amounts = [float(t.amount) for t in transactions]
    avg_transaction_amount = np.mean(transaction_amounts) if transaction_amounts else 0

    # Calculate balance volatility
    if transactions and all(t.balance is not None for t in transactions):
        balances = [float(t.balance) for t in transactions if t.balance is not None]
        balance_volatility = np.std(balances) / (np.mean(balances) if np.mean(balances) > 0 else 1)
    else:
        balance_volatility = 0.2  # Default value

    # Calculate balance trend
    if transactions and all(t.balance is not None for t in transactions):
        # Sort transactions by date
        sorted_transactions = sorted(
            transactions,
            key=lambda t: datetime.fromisoformat(t.transaction_date.replace('Z', '+00:00'))
        )

        if len(sorted_transactions) > 1 and all(t.balance is not None for t in sorted_transactions):
            first_balance = float(sorted_transactions[0].balance)
            last_balance = float(sorted_transactions[-1].balance)
            balance_trend = (last_balance - first_balance) / (first_balance if first_balance > 0 else 1)
        else:
            balance_trend = 0
    else:
        balance_trend = 0

    # Calculate days since last transaction
    if transactions:
        try:
            transaction_dates = [datetime.fromisoformat(t.transaction_date.replace('Z', '+00:00')) for t in transactions]
            latest_transaction = max(transaction_dates)
            days_since_last_transaction = (datetime.now() - latest_transaction).days
        except Exception:
            days_since_last_transaction = 7  # Default value
    else:
        days_since_last_transaction = 30  # Default if no transactions

    # Estimate income based on deposits or EMI
    deposits = [float(t.amount) for t in transactions if t.transaction_type == "Credit"]
    if deposits:
        # Estimate monthly income from average deposits
        estimated_monthly_income = sum(deposits) / 3  # Assuming 3 months of data
    else:
        # Fallback to estimating from EMI (typically 30-40% of income)
        estimated_monthly_income = emi_amount * 3  # Rough estimate

    # Estimate missed payments
    missed_payments = 0
    if loan_status_str == "Late":
        missed_payments = 1
    elif loan_status_str == "Default":
        missed_payments = 3

    # Create feature dictionary with all features that our model might use
    # We'll filter these based on what the model was actually trained on
    all_features = {
        'age': age,
        'estimated_monthly_income': estimated_monthly_income,
        'loan_amount': loan_amount,
        'interest_rate': interest_rate,
        'tenure_months': tenure_months,
        'emi_amount': emi_amount,
        'num_accounts': unique_accounts,
        'withdrawal_count': withdrawal_count,
        'deposit_count': deposit_count,
        'withdrawal_deposit_ratio': withdrawal_deposit_ratio,
        'avg_transaction_amount': avg_transaction_amount,
        'balance_volatility': balance_volatility,
        'missed_payments': missed_payments,
        'days_since_last_transaction': days_since_last_transaction,
        'balance_trend': balance_trend
    }

    # Only return features that the model was trained on
    features = {k: all_features.get(k, 0) for k in model_features}

    return features

def identify_risk_factors(features, risk_score):
    """Identify key risk factors for the prediction."""
    risk_factors = []

    # High loan-to-income ratio
    if 'loan_amount' in features and 'estimated_monthly_income' in features:
        loan_to_income_ratio = features['loan_amount'] / (features['estimated_monthly_income'] * 12)
        if loan_to_income_ratio > 0.4:
            severity = "High" if loan_to_income_ratio > 0.6 else "Medium"
            risk_factors.append({
                "factor": "High Loan-to-Income Ratio",
                "value": f"{loan_to_income_ratio:.2f}",
                "severity": severity,
                "description": "Loan amount is high relative to income, increasing debt burden."
            })

    # High withdrawal-to-deposit ratio
    if 'withdrawal_deposit_ratio' in features and features['withdrawal_deposit_ratio'] > 1.2:
        severity = "High" if features['withdrawal_deposit_ratio'] > 1.5 else "Medium"
        risk_factors.append({
            "factor": "High Withdrawal-to-Deposit Ratio",
            "value": f"{features['withdrawal_deposit_ratio']:.2f}",
            "severity": severity,
            "description": "More money going out than coming in, potential cash flow issues."
        })

    # High balance volatility
    if 'balance_volatility' in features and features['balance_volatility'] > 0.3:
        severity = "High" if features['balance_volatility'] > 0.4 else "Medium"
        risk_factors.append({
            "factor": "High Balance Volatility",
            "value": f"{features['balance_volatility']:.2f}",
            "severity": severity,
            "description": "Irregular account balance fluctuations, indicating unstable finances."
        })

    # Missed payments
    if 'missed_payments' in features and features['missed_payments'] > 0:
        severity = "High" if features['missed_payments'] > 1 else "Medium"
        risk_factors.append({
            "factor": "Missed Payments",
            "value": str(features['missed_payments']),
            "severity": severity,
            "description": "History of missed or delayed loan payments."
        })

    # Infrequent transactions
    if 'days_since_last_transaction' in features and features['days_since_last_transaction'] > 15:
        severity = "Medium" if features['days_since_last_transaction'] > 25 else "Low"
        risk_factors.append({
            "factor": "Infrequent Account Activity",
            "value": f"{features['days_since_last_transaction']} days since last transaction",
            "severity": severity,
            "description": "Low account activity may indicate financial challenges or account abandonment."
        })

    # Negative balance trend
    if 'balance_trend' in features and features['balance_trend'] < -0.1:
        severity = "High" if features['balance_trend'] < -0.3 else "Medium"
        risk_factors.append({
            "factor": "Declining Account Balance",
            "value": f"{features['balance_trend']:.2f}",
            "severity": severity,
            "description": "Account balances decreasing over time, indicating potential financial distress."
        })

    # Sort by severity
    severity_order = {"High": 0, "Medium": 1, "Low": 2}
    risk_factors.sort(key=lambda x: severity_order[x["severity"]])

    return risk_factors

def generate_recommendations(risk_factors, risk_score):
    """Generate recommendations based on risk factors."""
    recommendations = []

    if any(rf["factor"] == "High Loan-to-Income Ratio" for rf in risk_factors):
        recommendations.append("Consider restructuring the loan to lower EMI payments")

    if any(rf["factor"] == "High Withdrawal-to-Deposit Ratio" for rf in risk_factors):
        recommendations.append("Monitor cash flow patterns more closely")

    if any(rf["factor"] == "Missed Payments" for rf in risk_factors):
        recommendations.append("Set up automated payment reminders")
        recommendations.append("Evaluate potential for flexible payment schedule")

    if any(rf["factor"] == "Declining Account Balance" for rf in risk_factors):
        recommendations.append("Schedule financial counseling session with the borrower")

    # General recommendations based on risk score
    if risk_score > 80:
        recommendations.append("Flag for immediate review by risk management team")
        recommendations.append("Consider requiring additional collateral or guarantor")
    elif risk_score > 60:
        recommendations.append("Increase monitoring frequency for this account")
        recommendations.append("Proactively reach out to discuss financial situation")

    return recommendations

def get_risk_level_and_description(risk_score):
    """Map risk score to risk level and description."""
    if risk_score <= 20:
        level = "Very Low Risk"
        range_key = "Very Low Risk (0-20)"
    elif risk_score <= 40:
        level = "Low Risk"
        range_key = "Low Risk (21-40)"
    elif risk_score <= 60:
        level = "Moderate Risk"
        range_key = "Moderate Risk (41-60)"
    elif risk_score <= 80:
        level = "High Risk"
        range_key = "High Risk (61-80)"
    else:
        level = "Very High Risk"
        range_key = "Very High Risk (81-100)"

    description = risk_interpretations.get(range_key, "Risk level description not available")

    return level, description

# API endpoint for risk prediction
@app.post("/api/predict", response_model=RiskResponse)
async def predict_risk(borrower: BorrowerRequest):
    try:
        # Extract features from borrower data
        features = extract_features(borrower)

        # Convert features to DataFrame for prediction
        features_df = pd.DataFrame([features])

        # Make prediction
        risk_score = model.predict(features_df)[0]

        # Ensure risk score is within 0-100 range
        risk_score = max(0, min(100, risk_score))

        # Get risk level and description
        risk_level, risk_description = get_risk_level_and_description(risk_score)

        # Identify risk factors
        risk_factors = identify_risk_factors(features, risk_score)

        # Generate recommendations
        recommendations = generate_recommendations(risk_factors, risk_score)

        # Create response
        response = RiskResponse(
            borrower_id=borrower.id,
            borrower_name=borrower.name,
            risk_score=float(risk_score),
            risk_level=risk_level,
            risk_description=risk_description,
            risk_factors=risk_factors,
            recommendations=recommendations
        )

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_version": "1.0.0"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Loan Default Risk Prediction API",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/api/predict - POST request to predict risk score",
            "health": "/health - GET request to check API health"
        }
    }

# Run the API server when the script is executed directly
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
