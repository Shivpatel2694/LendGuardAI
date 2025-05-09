import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Bell,
  Search,
  Database,
  Check,
  Clock,
  ArrowRight,
  CreditCard,
  TrendingUp,
  X,
  Eye,
  XCircle
} from 'lucide-react';
interface Borrower {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  address: string;
  aadhar_number?: string;
  pan_number?: string;
  risk_score?: number;
  risk_level?: string;
  risk_description?: string;
  risk_factors?: { factor: string; description: string; severity: string; value: string }[];
  recommendations?: string[];
  loans?: {
    id: string;
    borrower_id: string;
    loan_amount: string;
    interest_rate: string;
    tenure_months: number;
    emi_amount: string;
    loan_status: string;
    disbursement_date: string;
  }[];
  financial_transactions?: {
    id: string;
    borrower_id: string;
    transaction_date: string;
    account_number: string;
    transaction_type: string;
    category?: string;
    amount: string;
    description?: string;
  }[];
  loan_amount?: string; // Add loan_amount here
}
// Mock Data Modal Component
const MockDataModal = ({ onComplete, lenderId }: { onComplete: () => void; lenderId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    "Initializing process",
    "Generating synthetic borrower profiles",
    "Preparing dashboard"
  ];


  const handleGenerateMockData = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Generating mock data with lenderId:', lenderId);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      const token = localStorage.getItem('token') || 'mock-token';
      console.log('Sending mock data request:', { lenderId });
      const response = await fetch('http://localhost:3000/api/generate-mock-data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lenderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to generate mock data: ${errorData.error || response.statusText}`);
      }

      localStorage.setItem('mockDataGenerated', 'true');
      onComplete();
    } catch (error) {
      if (error instanceof Error) {
        
          setError(error.message);
    
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Development Mode</h2>
          <button
            onClick={() => onComplete()}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Database className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                In production, this system would connect to the Account Aggregator (AA) framework to access real-time financial data from borrowers. For development purposes, we'll generate synthetic data to demonstrate the functionality.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4 mb-6">
            <p className="font-medium">Generating mock data...</p>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  {index < currentStep ? (
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Check size={16} className="text-green-600" />
                    </div>
                  ) : index === currentStep ? (
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Clock size={16} className="text-blue-600 animate-pulse" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                    </div>
                  )}
                  <span className={index <= currentStep ? "text-gray-900" : "text-gray-400"}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={handleGenerateMockData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
          >
            Generate Mock Borrower Data
            <ArrowRight size={16} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

// Borrower Detail Modal Component
const BorrowerDetailModal = ({ borrower, onClose }: { borrower: Borrower | null; onClose: () => void }) => {
  if (!borrower) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2 pb-4 border-b">
          <h2 className="text-2xl font-bold">Borrower Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-gray-800">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{borrower.first_name+borrower.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{borrower.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{borrower.phone_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{formatDate(borrower.date_of_birth)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{borrower.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aadhar Number</p>
                <p className="font-medium">{borrower.aadhar_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PAN Number</p>
                <p className="font-medium">{borrower.pan_number || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          {borrower.risk_score !== undefined && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-gray-800">Risk Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Risk Score</p>
                  <p className="font-medium text-xl">{borrower.risk_score.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Risk Level</p>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${borrower.risk_level === 'Very Low Risk' ? 'bg-green-100 text-green-800' :
                      borrower.risk_level === 'Low Risk' ? 'bg-green-100 text-green-800' :
                        borrower.risk_level === 'Moderate Risk' ? 'bg-yellow-100 text-yellow-800' :
                          borrower.risk_level === 'High Risk' ? 'bg-red-100 text-red-800' :
                            'bg-red-100 text-red-800'
                    }`}>
                    {borrower.risk_level}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Risk Description</p>
                <p className="font-medium">{borrower.risk_description}</p>
              </div>
              {borrower.risk_factors && borrower.risk_factors.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 font-medium mb-2">Key Risk Factors</p>
                  <ul className="list-disc pl-5">
                    {borrower.risk_factors.map((factor, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{factor.factor}</span>: {factor.description} (Severity: {factor.severity}, Value: {factor.value})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {borrower.recommendations && borrower.recommendations.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Recommendations</p>
                  <ul className="list-disc pl-5">
                    {borrower.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Loan Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-gray-800">Loan Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure (Months)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disbursed Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {borrower.loans && borrower.loans.length > 0 ? (
                    borrower.loans.map(loan => (
                      <tr key={loan.id}>
                        <td className="px-4 py-2 whitespace-nowrap">{loan.id.substring(0, 8)}...</td>
                        <td className="px-4 py-2 whitespace-nowrap">₹{parseFloat(loan.loan_amount).toLocaleString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{loan.interest_rate}%</td>
                        <td className="px-4 py-2 whitespace-nowrap">{loan.tenure_months}</td>
                        <td className="px-4 py-2 whitespace-nowrap">₹{parseFloat(loan.emi_amount).toLocaleString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${loan.loan_status === 'Active' ? 'bg-green-100 text-green-800' :
                              loan.loan_status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                                loan.loan_status === 'Default' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                            }`}>
                            {loan.loan_status}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{formatDate(loan.disbursement_date)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 text-center text-gray-500">No active loans</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Transactions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-gray-800">Financial Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {borrower.financial_transactions && borrower.financial_transactions.length > 0 ? (
                    borrower.financial_transactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-2 whitespace-nowrap">{formatDate(transaction.transaction_date)}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{transaction.account_number}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${transaction.transaction_type === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {transaction.transaction_type}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">₹{parseFloat(transaction.amount).toLocaleString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{transaction.category || 'N/A'}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{transaction.description || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-gray-500">No financial transactions</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// BorrowerTable component for displaying borrower overview
// 
const BorrowerTable = ({
  borrowers,
  onViewDetails,
}: {
  borrowers: Borrower[];
  onViewDetails: (borrower: Borrower) => void;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-medium mb-4">Borrower Details</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Loan Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {borrowers.map(borrower => (
            <tr
              key={borrower.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onViewDetails(borrower)}
            >
              <td className="px-6 py-4 whitespace-nowrap">{borrower.first_name+borrower.last_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{borrower.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{borrower.phone_number}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {borrower.loan_amount && parseFloat(borrower.loan_amount) > 0
                  ? `₹${parseFloat(borrower.loan_amount).toLocaleString()}`
                  : '₹0 (No active loans)'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {borrower.risk_score !== undefined ? borrower.risk_score.toFixed(2) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {borrower.loan_amount && parseFloat(borrower.loan_amount) === 0 ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Low Risk
                  </span>
                ) : borrower.risk_level ? (
                  <span className={`px-2 py-1 text-xs rounded-full ${borrower.risk_level === 'Very Low Risk' ? 'bg-green-100 text-green-800' :
                      borrower.risk_level === 'Low Risk' ? 'bg-green-100 text-green-800' :
                        borrower.risk_level === 'Moderate Risk' ? 'bg-yellow-100 text-yellow-800' :
                          borrower.risk_level === 'High Risk' ? 'bg-red-100 text-red-800' :
                            'bg-red-100 text-red-800'
                    }`}>
                    {borrower.risk_level}
                  </span>
                ) : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(borrower);
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Eye size={16} className="mr-1" />
                  <span>View Details</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}
// Dashboard Components
const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(isNewUser);
  // Mock currentUser for development
  const currentUser = { id: '123e4567-e89b-12d3-a456-426614174000', email: 'demo@example.com' };

  // Check if user is new and needs to see the modal
  useEffect(() => {
    const mockDataGenerated = localStorage.getItem('mockDataGenerated') === 'true';
    const isFirstLogin = !mockDataGenerated;

    setIsNewUser(isFirstLogin);
    setShowModal(isFirstLogin);

    if (!isFirstLogin) {
      fetchBorrowers();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchBorrowers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || 'mock-token';
      const response = await fetch('http://localhost:3000/api/borrowers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch borrowers: ${errorData.error || response.statusText}`);
      }

      const borrowersData = await response.json();
      // Fetch risk scores for each borrower
      const borrowersWithRisk = await Promise.all(borrowersData.map(async (borrower : Borrower) => {
        try {
          // Check if borrower has zero loan amount - if so, set as low risk
          const loanAmount = parseFloat(borrower.loan_amount || '0') || 0;

          if (loanAmount === 0) {
            return {
              ...borrower,
              risk_score: 0.00,
              risk_level: 'Low Risk',
              risk_description: 'No active loans. This borrower currently has no outstanding loans.',
              risk_factors: [],
              recommendations: ['Consider for future loan opportunities'],
            };
          }

          // Transform borrower data to match BorrowerRequest schema
          const transformedBorrower = {
            id: borrower.id || 'unknown',
            name: borrower.first_name+borrower.last_name || 'Unknown Borrower',
            first_name: borrower.first_name || borrower.first_name?.split(' ')[0] || 'Unknown',
            last_name: borrower.last_name || borrower.last_name?.split(' ').slice(1).join(' ') || 'Unknown',
            email: borrower.email || 'unknown@example.com',
            phone_number: borrower.phone_number || '0000000000',
            address: borrower.address || 'Unknown Address',
            date_of_birth: borrower.date_of_birth || '1990-01-01',
            aadhar_number: borrower.aadhar_number || null,
            pan_number: borrower.pan_number || null,
            loan_amount: loanAmount,
            loans: borrower.loans?.map(loan => ({
              id: loan.id || 'unknown',
              borrower_id: loan.borrower_id || borrower.id,
              loan_amount: parseFloat(loan.loan_amount) || 0,
              interest_rate: parseFloat(loan.interest_rate) || 0,
              tenure_months: loan.tenure_months || 12,
              emi_amount: parseFloat(loan.emi_amount) || 0,
              disbursement_date: loan.disbursement_date || '2023-01-01',
              loan_status: loan.loan_status && ['Active', 'Late', 'Default'].includes(loan.loan_status)
                ? loan.loan_status
                : 'Active',
            })) || [],
            financial_transactions: borrower.financial_transactions?.map(transaction => ({
              id: transaction.id || 'unknown',
              borrower_id: transaction.borrower_id || borrower.id,
              account_number: transaction.account_number || 'unknown',
              transaction_date: transaction.transaction_date || '2023-01-01',
              transaction_type: transaction.transaction_type || 'Credit',
              category: transaction.category || null,
              amount: parseFloat(transaction.amount) || 0,
              balance: transaction.amount ? parseFloat(transaction.amount) || null : null,
              description: transaction.description || null,
            })) || [],
          };

          console.log('Sending transformed borrower:', transformedBorrower);

          const riskResponse = await fetch('http://localhost:8000/api/predict', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transformedBorrower),
          });

          if (!riskResponse.ok) {
            const errorData = await riskResponse.json();
            throw new Error(`Failed to fetch risk score for borrower ${borrower.id}: ${JSON.stringify(errorData.detail)}`);
          }

          const riskData = await riskResponse.json();
          return {
            ...borrower,
            risk_score: riskData.risk_score,
            risk_level: riskData.risk_level,
            risk_description: riskData.risk_description,
            risk_factors: riskData.risk_factors,
            recommendations: riskData.recommendations,
          };
        } catch (err) {
          console.error(`Error fetching risk for borrower ${borrower.id}:`, err);

          const loanAmount = parseFloat(borrower.loan_amount ?? '0') || 0;
          if (loanAmount === 0) {
            return {
              ...borrower,
              risk_score: 0.2,
              risk_level: 'Low Risk',
              risk_description: 'No active loans. This borrower currently has no outstanding loans.',
              risk_factors: [],
              recommendations: ['Consider for future loan opportunities'],
            };
          }

          return borrower;
        }
      }));

      setBorrowers(borrowersWithRisk);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      if (error instanceof Error) {
        
          setError(error.message);
    
      } else {
        setError('An unknown error occurred.');
      }
      setBorrowers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalComplete = async () => {
    await fetchBorrowers();
    setShowModal(false);
  };

  const handleViewBorrowerDetails = (borrower : Borrower) => {
    setSelectedBorrower(borrower);
  };

  const handleCloseBorrowerDetails = () => {
    setSelectedBorrower(null);
  };

  const handleResetData = () => {
    localStorage.removeItem('mockDataGenerated');
    setShowModal(true);
  };

  // Calculate stats, counting zero loan borrowers as low risk
  const totalBorrowers = borrowers.length;
  const totalLoanAmount = borrowers.reduce((sum, b) => sum + (parseFloat(b.loan_amount || '0') || 0), 0);
  const avgRiskScore = totalBorrowers > 0
    ? Math.round(
        borrowers.reduce((sum, b) => sum + (b.risk_score ?? 0.2), 0) / totalBorrowers
      )
    : 0;
  const highRiskCount = borrowers.filter(
    b => b.risk_level === 'High Risk' || b.risk_level === 'Very High Risk'
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gray-50"
    >
      {showModal && <MockDataModal onComplete={handleModalComplete} lenderId={currentUser.id} />}
      {selectedBorrower && <BorrowerDetailModal borrower={selectedBorrower} onClose={handleCloseBorrowerDetails} />}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Lending Dashboard</h1>
                <p className="text-gray-500">Welcome back, here's what's happening today.</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <button className="p-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
                  <Bell size={18} />
                </button>
                {borrowers.length > 0 && (
                  <button
                    onClick={handleResetData}
                    className="p-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 text-xs"
                    title="Reset mock data"
                  >
                    <Database size={18} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {borrowers.length > 0 ? (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Borrowers"
                  value={totalBorrowers}
                  icon={<Users size={20} className="text-white" />}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Total Loan Amount"
                  value={`₹${totalLoanAmount.toLocaleString()}`}
                  icon={<CreditCard size={20} className="text-white" />}
                  color="bg-green-500"
                />
                <StatCard
                  title="Avg. Risk Score"
                  value={avgRiskScore}
                  icon={<BarChart3 size={20} className="text-white" />}
                  color="bg-yellow-500"
                />
                <StatCard
                  title="High Risk Borrowers"
                  value={highRiskCount}
                  icon={<TrendingUp size={20} className="text-white" />}
                  color="bg-purple-500"
                />
              </div>

              {/* Borrower Table */}
              <BorrowerTable
                borrowers={borrowers}
                onViewDetails={handleViewBorrowerDetails}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <Database size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Borrower Data Available</h2>
              <p className="text-gray-500 mb-6">Generate mock data to see dashboard analytics and borrower profiles.</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center"
              >
                Generate Mock Data
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};
