import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  BarChart,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Database,
  Check,
  Clock,
  ArrowRight,
  CreditCard,
  TrendingUp,
  X
} from 'lucide-react';

// Mock data generation function
const generateMockBorrowers = () => {
  const riskCategories = ['Low', 'Medium', 'High'];
  const names = [
    'Aisha Singh', 'Rahul Patel', 'Priya Sharma',
    'Varun Gupta', 'Lakshmi Reddy', 'Vikram Malhotra',
    'Deepa Joshi', 'Sanjay Kumar', 'Meera Choudhury',
    'Arjun Nair', 'Divya Mehta', 'Raj Verma'
  ];

  return Array.from({ length: 12 }, (_, i) => ({
    id: `B${1000 + i}`,
    name: names[i],
    loanAmount: Math.round(50000 + Math.random() * 450000),
    riskScore: Math.round(300 + Math.random() * 500),
    riskCategory: riskCategories[Math.floor(Math.random() * 3)],
    incomeVerified: Math.random() > 0.3,
    lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
  }));
};

// Mock Data Modal Component
const MockDataModal = ({ onComplete }: { onComplete: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Initializing process",
    "Generating synthetic borrower profiles",
    "Creating financial history data",
    "Calculating risk scores",
    "Preparing dashboard"
  ];

  const handleGenerateMockData = async () => {
    setIsLoading(true);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      onComplete();
    } catch (error) {
      console.error('Error generating mock data:', error);
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

// Dashboard Components
const StatCard = ({ title, value, icon, trend, color }) => (
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
    <div className="flex items-center text-sm">
      <span className={trend > 0 ? "text-green-500" : "text-red-500"}>
        {trend > 0 ? "+" : ""}{trend}%
      </span>
      <span className="text-gray-500 ml-2">since last month</span>
    </div>
  </div>
);

const ChartPlaceholder = () => (
  <div className="bg-white p-6 rounded-lg shadow-md h-64">
    <h3 className="text-lg font-medium mb-4">Borrower Performance Overview</h3>
    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-md">
      <p className="text-gray-400">Chart visualization will appear here</p>
    </div>
  </div>
);

const RecentActivityItem = ({ title, time, description, icon, color }) => (
  <div className="flex items-start gap-4 py-3">
    <div className={`p-2 rounded-full ${color} flex-shrink-0 mt-1`}>
      {icon}
    </div>
    <div>
      <div className="flex items-center gap-2">
        <h4 className="font-medium">{title}</h4>
        <span className="text-gray-400 text-xs">{time}</span>
      </div>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  </div>
);

export const Dashboard = () => {
  const { currentUser } = useAuth ? useAuth() : { currentUser: { email: 'demo@example.com' } };
  const [showModal, setShowModal] = useState(false);
  const [borrowers, setBorrowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved data on component mount
  useEffect(() => {
    setIsLoading(true);
    try {
      const savedData = localStorage.getItem('mockBorrowerData');
      if (savedData) {
        setBorrowers(JSON.parse(savedData));
        setShowModal(false);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleModalComplete = () => {
    const mockBorrowers = generateMockBorrowers();
    setBorrowers(mockBorrowers);

    // Save to localStorage for persistence
    try {
      localStorage.setItem('mockBorrowerData', JSON.stringify(mockBorrowers));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }

    setShowModal(false);
  };

  // Function to clear saved data and regenerate
  const handleResetData = () => {
    localStorage.removeItem('mockBorrowerData');
    setShowModal(true);
  };

  const totalBorrowers = borrowers.length;
  const totalLoanAmount = borrowers.reduce((sum, b) => sum + b.loanAmount, 0);
  const avgRiskScore = borrowers.length > 0 ? Math.round(borrowers.reduce((sum, b) => sum + b.riskScore, 0) / totalBorrowers) : 0;
  const highRiskCount = borrowers.filter(b => b.riskCategory === 'High').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gray-50"
    >
      {showModal && <MockDataModal onComplete={handleModalComplete} />}

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

          {borrowers.length > 0 ? (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Borrowers"
                  value={totalBorrowers}
                  icon={<Users size={20} className="text-white" />}
                  trend={8.2}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Total Loan Amount"
                  value={`₹${totalLoanAmount.toLocaleString()}`}
                  icon={<CreditCard size={20} className="text-white" />}
                  trend={12.5}
                  color="bg-green-500"
                />
                <StatCard
                  title="Avg. Risk Score"
                  value={avgRiskScore}
                  icon={<BarChart3 size={20} className="text-white" />}
                  trend={-2.4}
                  color="bg-yellow-500"
                />
                <StatCard
                  title="High Risk Borrowers"
                  value={highRiskCount}
                  icon={<TrendingUp size={20} className="text-white" />}
                  trend={5.7}
                  color="bg-purple-500"
                />
              </div>

              {/* Charts and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ChartPlaceholder />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                  <div className="space-y-1 divide-y">
                    <RecentActivityItem
                      title="New Borrower"
                      time="2 hours ago"
                      description={`${borrowers[0]?.name || 'A customer'} signed up as a new borrower`}
                      icon={<Users size={16} className="text-white" />}
                      color="bg-blue-500"
                    />
                    <RecentActivityItem
                      title="Loan Approved"
                      time="5 hours ago"
                      description={`Loan for ₹${borrowers[1]?.loanAmount.toLocaleString() || '150,000'} was approved`}
                      icon={<BarChart size={16} className="text-white" />}
                      color="bg-green-500"
                    />
                    <RecentActivityItem
                      title="Risk Alert"
                      time="1 day ago"
                      description="High risk borrower identified requiring review"
                      icon={<HelpCircle size={16} className="text-white" />}
                      color="bg-yellow-500"
                    />
                    <RecentActivityItem
                      title="System Update"
                      time="2 days ago"
                      description="Risk assessment algorithm improved to version 2.4"
                      icon={<Settings size={16} className="text-white" />}
                      color="bg-purple-500"
                    />
                  </div>
                </div>
              </div>
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
