export const mockBorrowers = [
    { id: "B1024", name: "Rahul Patel", loanAmount: 1200000, emi: 21500, loanType: "Home Loan", hasConsent: true },
    { id: "B1183", name: "Priya Sharma", loanAmount: 450000, emi: 12800, loanType: "Personal Loan", hasConsent: true },
    { id: "B1067", name: "Varun Gupta", loanAmount: 350000, emi: 9800, loanType: "Auto Loan", hasConsent: false },
    { id: "B1112", name: "Lakshmi Reddy", loanAmount: 800000, emi: 15300, loanType: "Business Loan", hasConsent: true },
    { id: "B1204", name: "Meera Choudhury", loanAmount: 250000, emi: 8500, loanType: "Personal Loan", hasConsent: true },
    { id: "B1356", name: "Amit Singh", loanAmount: 1500000, emi: 28900, loanType: "Home Loan", hasConsent: false },
    { id: "B1489", name: "Sanjay Kumar", loanAmount: 600000, emi: 16800, loanType: "Business Loan", hasConsent: true },
    { id: "B1520", name: "Kavita Joshi", loanAmount: 180000, emi: 6200, loanType: "Personal Loan", hasConsent: true }
  ];
  
  // Mock risk data
  export const mockRiskData = {
    "B1024": {
      riskScore: 82, creditScore: 621,
      incomeAnalysis: {
        currentMonthly: 52000, trend: -40, stability: "Low",
        history: [85000, 82000, 78000, 65000, 58000, 52000]
      },
      spendingAnalysis: {
        currentMonthly: 45000, 
        essentialRatio: 62, 
        luxuryRatio: 38, 
        highestCategory: "Healthcare",
        categories: [
          { name: "Healthcare", value: 38 },
          { name: "Housing", value: 24 },
          { name: "Food", value: 18 },
          { name: "Transport", value: 12 },
          { name: "Entertainment", value: 8 }
        ]
      },
      paymentHistory: { 
        missedPayments: 2, 
        latePayments: 3, 
        onTimeRatio: 70,
        monthlyData: [
          { month: "Dec", status: "on-time" },
          { month: "Jan", status: "on-time" },
          { month: "Feb", status: "late" },
          { month: "Mar", status: "late" },
          { month: "Apr", status: "missed" },
          { month: "May", status: "missed" }
        ]
      },
      riskFactors: [
        { factor: "Income Reduction", severity: "High", impact: 75 },
        { factor: "Increased Healthcare Expenses", severity: "High", impact: 65 }
      ],
      timeline: [
        { date: "Mar 15, 2025", event: "Income reduced by 15%", type: "warning" },
        { date: "Apr 03, 2025", event: "Late EMI payment", type: "danger" },
        { date: "Apr 25, 2025", event: "Income reduced by additional 10%", type: "danger" }
      ],
      recommendation: "This borrower shows significant financial distress with consistent income reduction and increasing healthcare expenses. Consider offering a 3-month EMI holiday with restructured payment plan."
    },
    "B1183": {
      riskScore: 45, creditScore: 710,
      incomeAnalysis: {
        currentMonthly: 65000, trend: 5, stability: "High",
        history: [62000, 62000, 63000, 64000, 65000, 65000]
      },
      spendingAnalysis: {
        currentMonthly: 40000, 
        essentialRatio: 75, 
        luxuryRatio: 25, 
        highestCategory: "Housing",
        categories: [
          { name: "Housing", value: 40 },
          { name: "Food", value: 25 },
          { name: "Transport", value: 10 },
          { name: "Education", value: 15 },
          { name: "Entertainment", value: 10 }
        ]
      },
      paymentHistory: { 
        missedPayments: 0, 
        latePayments: 1, 
        onTimeRatio: 95,
        monthlyData: [
          { month: "Dec", status: "on-time" },
          { month: "Jan", status: "on-time" },
          { month: "Feb", status: "on-time" },
          { month: "Mar", status: "late" },
          { month: "Apr", status: "on-time" },
          { month: "May", status: "on-time" }
        ]
      },
      riskFactors: [
        { factor: "Recent Job Change", severity: "Low", impact: 30 },
        { factor: "Increased Debt-to-Income", severity: "Medium", impact: 45 }
      ],
      timeline: [
        { date: "Feb 12, 2025", event: "Changed employment", type: "info" },
        { date: "Mar 28, 2025", event: "Slight delay in EMI payment", type: "warning" },
        { date: "Apr 15, 2025", event: "Income stabilized", type: "success" }
      ],
      recommendation: "This borrower has a stable financial profile with minor risk factors. Monitor for 2 months to ensure employment transition stability."
    },
    "B1112": {
      riskScore: 35, creditScore: 760,
      incomeAnalysis: {
        currentMonthly: 88000, trend: 15, stability: "High",
        history: [75000, 78000, 80000, 82000, 85000, 88000]
      },
      spendingAnalysis: {
        currentMonthly: 55000, 
        essentialRatio: 65, 
        luxuryRatio: 35, 
        highestCategory: "Business Investment",
        categories: [
          { name: "Business Investment", value: 35 },
          { name: "Housing", value: 25 },
          { name: "Food", value: 15 },
          { name: "Transport", value: 10 },
          { name: "Entertainment", value: 15 }
        ]
      },
      paymentHistory: { 
        missedPayments: 0, 
        latePayments: 0, 
        onTimeRatio: 100,
        monthlyData: [
          { month: "Dec", status: "on-time" },
          { month: "Jan", status: "on-time" },
          { month: "Feb", status: "on-time" },
          { month: "Mar", status: "on-time" },
          { month: "Apr", status: "on-time" },
          { month: "May", status: "on-time" }
        ]
      },
      riskFactors: [
        { factor: "Business Seasonality", severity: "Low", impact: 25 },
        { factor: "Market Competition", severity: "Low", impact: 30 }
      ],
      timeline: [
        { date: "Jan 20, 2025", event: "Business revenue increased by 10%", type: "success" },
        { date: "Mar 05, 2025", event: "New business contract signed", type: "success" },
        { date: "Apr 22, 2025", event: "Credit score improved", type: "success" }
      ],
      recommendation: "Low risk profile with strong business growth indicators. Consider offering pre-approved top-up loan for business expansion."
    },
    "B1204": {
      riskScore: 55, creditScore: 680,
      incomeAnalysis: {
        currentMonthly: 45000, trend: -5, stability: "Medium",
        history: [48000, 47000, 46000, 46000, 45000, 45000]
      },
      spendingAnalysis: {
        currentMonthly: 38000, 
        essentialRatio: 80, 
        luxuryRatio: 20, 
        highestCategory: "Education",
        categories: [
          { name: "Education", value: 32 },
          { name: "Housing", value: 30 },
          { name: "Food", value: 18 },
          { name: "Transport", value: 12 },
          { name: "Entertainment", value: 8 }
        ]
      },
      paymentHistory: { 
        missedPayments: 0, 
        latePayments: 2, 
        onTimeRatio: 85,
        monthlyData: [
          { month: "Dec", status: "on-time" },
          { month: "Jan", status: "on-time" },
          { month: "Feb", status: "late" },
          { month: "Mar", status: "on-time" },
          { month: "Apr", status: "late" },
          { month: "May", status: "on-time" }
        ]
      },
      riskFactors: [
        { factor: "Education Expenses", severity: "Medium", impact: 50 },
        { factor: "Minor Income Decline", severity: "Medium", impact: 45 }
      ],
      timeline: [
        { date: "Feb 05, 2025", event: "Started education course", type: "info" },
        { date: "Mar 10, 2025", event: "Minor income reduction", type: "warning" },
        { date: "Apr 18, 2025", event: "Late EMI payment", type: "warning" }
      ],
      recommendation: "Moderate risk due to education expenses and minor income reduction. Consider offering a flexible EMI plan for next 6 months until course completion."
    },
    "B1489": {
      riskScore: 25, creditScore: 790,
      incomeAnalysis: {
        currentMonthly: 95000, trend: 20, stability: "Very High",
        history: [78000, 82000, 85000, 88000, 92000, 95000]
      },
      spendingAnalysis: {
        currentMonthly: 60000, 
        essentialRatio: 60, 
        luxuryRatio: 40, 
        highestCategory: "Investment",
        categories: [
          { name: "Investment", value: 30 },
          { name: "Housing", value: 25 },
          { name: "Food", value: 15 },
          { name: "Transport", value: 10 },
          { name: "Entertainment", value: 20 }
        ]
      },
      paymentHistory: { 
        missedPayments: 0, 
        latePayments: 0, 
        onTimeRatio: 100,
        monthlyData: [
          { month: "Dec", status: "on-time" },
          { month: "Jan", status: "on-time" },
          { month: "Feb", status: "on-time" },
          { month: "Mar", status: "on-time" },
          { month: "Apr", status: "on-time" },
          { month: "May", status: "on-time" }
        ]
      },
      riskFactors: [
        { factor: "None Identified", severity: "Low", impact: 10 },
        { factor: "Multiple Loan Inquiries", severity: "Low", impact: 15 }
      ],
      timeline: [
        { date: "Jan 25, 2025", event: "Promotion at work", type: "success" },
        { date: "Mar 12, 2025", event: "Business expansion", type: "success" },
        { date: "Apr 20, 2025", event: "Investment portfolio growth", type: "success" }
      ],
      recommendation: "Very low risk profile with excellent financial health. Excellent candidate for pre-approved loan products and premium offerings."
    }
  };
  
  export const mockConsentDetails = {
    "B1024": {
      consentId: "CNT78921", status: "Active",
      dataRequested: ["Transaction History", "Income Details", "Account Balances", "Recurring Payments"],
      consentedOn: "2025-02-10", validUntil: "2025-08-10", purpose: "Loan Default Risk Assessment",
      dataFetchedOn: "2025-05-05"
    },
    "B1183": {
      consentId: "CNT82346", status: "Active",
      dataRequested: ["Transaction History", "Income Details", "Account Balances"],
      consentedOn: "2025-03-15", validUntil: "2025-09-15", purpose: "Loan Default Risk Assessment",
      dataFetchedOn: "2025-05-04"
    },
    "B1112": {
      consentId: "CNT75419", status: "Active",
      dataRequested: ["Transaction History", "Income Details", "Account Balances", "Investments", "Recurring Payments"],
      consentedOn: "2025-01-20", validUntil: "2025-07-20", purpose: "Loan Default Risk Assessment",
      dataFetchedOn: "2025-05-06"
    },
    "B1204": {
      consentId: "CNT81093", status: "Active",
      dataRequested: ["Transaction History", "Income Details", "Account Balances", "Recurring Payments"],
      consentedOn: "2025-02-28", validUntil: "2025-08-28", purpose: "Loan Default Risk Assessment",
      dataFetchedOn: "2025-05-02"
    },
    "B1489": {
      consentId: "CNT79652", status: "Active",
      dataRequested: ["Transaction History", "Income Details", "Account Balances", "Investments", "Assets", "Liabilities"],
      consentedOn: "2025-01-05", validUntil: "2025-07-05", purpose: "Loan Default Risk Assessment",
      dataFetchedOn: "2025-05-05"
    }
  };
  
  // Add labels for graphs
  export const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
  