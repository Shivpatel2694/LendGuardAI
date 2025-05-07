import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingDown,
  AlertTriangle,
  Users,
  Calendar,
  ArrowDown,
  ArrowUp,
  HelpCircle,
  Filter,
  Download,
  Share2,
  Info,
  Clock,
  Database,
  ChevronDown,
  Search,
  Bell,
} from 'lucide-react';
import { mockBorrowers, mockRiskData, mockConsentDetails, months } from '../mock-data';

// Component to display risk score with appropriate colors
const RiskScore = ({ score }) => {
  let colorClass = "text-green-500";
  let bgClass = "bg-green-100";
  
  if (score > 40 && score <= 70) {
    colorClass = "text-yellow-500";
    bgClass = "bg-yellow-100";
  } else if (score > 70) {
    colorClass = "text-red-500";
    bgClass = "bg-red-100";
  }
  
  return (
    <div className={`px-3 py-1 rounded-full ${bgClass} ${colorClass} text-sm font-medium inline-flex items-center`}>
      {score > 70 ? <AlertTriangle size={14} className="mr-1" /> : null}
      {score}
    </div>
  );
};

// Component for a summary card
const SummaryCard = ({ title, value, icon, trend, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
        {icon}
      </div>
    </div>
    {trend !== undefined && (
      <div className="flex items-center mt-4 text-sm">
        <span className={trend >= 0 ? "text-green-500 flex items-center" : "text-red-500 flex items-center"}>
          {trend >= 0 ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
          {Math.abs(trend)}%
        </span>
        <span className="text-gray-500 ml-2">{description}</span>
      </div>
    )}
  </div>
);

// Timeline event component
const TimelineEvent = ({ event }) => {
  const getEventColor = (type) => {
    switch (type) {
      case 'danger': return 'bg-red-100 text-red-600 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'success': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };
  
  return (
    <div className="flex mb-4">
      <div className="mr-3 flex-shrink-0">
        <div className={`w-3 h-3 rounded-full mt-1 ${getEventColor(event.type).split(' ')[0]}`}></div>
      </div>
      <div className={`border-l-2 pl-4 pb-4 ${getEventColor(event.type).split(' ')[2]}`}>
        <p className="text-gray-500 text-xs">{event.date}</p>
        <p className="text-gray-800 font-medium">{event.event}</p>
      </div>
    </div>
  );
};

// Income trend chart component using simple divs
const IncomeTrendChart = ({ data }) => {
  const maxValue = Math.max(...data);
  
  return (
    <div className="mt-4">
      <div className="flex items-end h-48 gap-2">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          let barColor = "bg-blue-500";
          
          // If trend is declining, make recent bars red
          if (index >= data.length / 2 && data[index] < data[index - 1]) {
            barColor = "bg-red-500";
          }
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-full rounded-t-sm ${barColor}`} 
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-1">{months[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Spending categories chart component
const SpendingCategoriesChart = ({ categories }) => {
  return (
    <div className="mt-4 space-y-3">
      {categories.map((category, index) => (
        <div key={index} className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span>{category.name}</span>
            <span className="font-medium">{category.value}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-blue-300'}`} 
              style={{ width: `${category.value}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Payment history chart
const PaymentHistoryChart = ({ monthlyData }) => {
  return (
    <div className="mt-4 flex items-end gap-2">
      {monthlyData.map((data, index) => {
        let bgColor;
        let height;
        
        switch (data.status) {
          case 'on-time':
            bgColor = 'bg-green-500';
            height = 'h-16';
            break;
          case 'late':
            bgColor = 'bg-yellow-500';
            height = 'h-10';
            break;
          case 'missed':
            bgColor = 'bg-red-500';
            height = 'h-6';
            break;
          default:
            bgColor = 'bg-gray-300';
            height = 'h-4';
        }
        
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className={`w-full rounded-t-sm ${bgColor} ${height}`}></div>
            <span className="text-xs text-gray-500 mt-1">{data.month}</span>
          </div>
        );
      })}
    </div>
  );
};

// Risk factors display
const RiskFactors = ({ factors }) => {
  return (
    <div className="mt-4 space-y-3">
      {factors.map((factor, index) => {
        let colorClass;
        
        switch (factor.severity) {
          case 'High':
            colorClass = 'text-red-600 bg-red-50 border-red-200';
            break;
          case 'Medium':
            colorClass = 'text-yellow-600 bg-yellow-50 border-yellow-200';
            break;
          default:
            colorClass = 'text-blue-600 bg-blue-50 border-blue-200';
        }
        
        return (
          <div key={index} className={`p-3 rounded-md border ${colorClass}`}>
            <div className="flex justify-between items-center">
              <span className="font-medium">{factor.factor}</span>
              <span className="text-sm">Impact: {factor.impact}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Borrower detail section
const BorrowerDetail = ({ borrower, riskData, consentDetails }) => {
  if (!riskData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-gray-500">Select a borrower to view detailed analytics</h3>
        </div>
      </div>
    );
  }
  
  const consent = consentDetails ? consentDetails[borrower.id] : null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between pb-6 border-b">
        <div>
          <h2 className="text-2xl font-bold">{borrower.name}</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-gray-500">ID: {borrower.id}</div>
            <div className="text-gray-500">Loan: ₹{borrower.loanAmount.toLocaleString()}</div>
            <div className="text-gray-500">EMI: ₹{borrower.emi}</div>
            <div className="text-gray-500">{borrower.loanType}</div>
          </div>
        </div>
        <div className="flex flex-col items-end mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">Risk Score:</span>
            <RiskScore score={riskData.riskScore} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-500 text-sm">Credit Score:</span>
            <span className="font-medium">{riskData.creditScore}</span>
          </div>
        </div>
      </div>
      
      {/* Consent information */}
      {consent && (
        <div className="py-4 border-b">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-blue-500" />
            <h3 className="font-medium">Account Aggregator Data Consent</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
            <div className="text-sm">
              <div className="text-gray-500">Consent ID</div>
              <div className="font-medium">{consent.consentId}</div>
            </div>
            <div className="text-sm">
              <div className="text-gray-500">Status</div>
              <div className="font-medium">{consent.status}</div>
            </div>
            <div className="text-sm">
              <div className="text-gray-500">Consented On</div>
              <div className="font-medium">{consent.consentedOn}</div>
            </div>
            <div className="text-sm">
              <div className="text-gray-500">Valid Until</div>
              <div className="font-medium">{consent.validUntil}</div>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <div className="text-gray-500">Data Requested</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {consent.dataRequested.map((item, index) => (
                <span key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Main analytics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Income Analysis */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium flex items-center">
            <TrendingDown size={16} className="mr-2 text-blue-500" />
            Income Analysis
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-gray-500 text-sm">Monthly Income</div>
              <div className="font-bold text-lg">₹{riskData.incomeAnalysis.currentMonthly.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">6-Month Trend</div>
              <div className={`font-bold text-lg ${riskData.incomeAnalysis.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {riskData.incomeAnalysis.trend >= 0 ? '+' : ''}{riskData.incomeAnalysis.trend}%
              </div>
            </div>
          </div>
          <IncomeTrendChart data={riskData.incomeAnalysis.history} />
        </div>
        
        {/* Spending Analysis */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium flex items-center">
            <BarChart3 size={16} className="mr-2 text-blue-500" />
            Spending Analysis
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-gray-500 text-sm">Monthly Spending</div>
              <div className="font-bold text-lg">₹{riskData.spendingAnalysis.currentMonthly.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Highest Category</div>
              <div className="font-bold text-lg">{riskData.spendingAnalysis.highestCategory}</div>
            </div>
          </div>
          <SpendingCategoriesChart categories={riskData.spendingAnalysis.categories} />
        </div>
        
        {/* Payment History */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium flex items-center">
            <Calendar size={16} className="mr-2 text-blue-500" />
            Payment History
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <div className="text-gray-500 text-sm">On-Time</div>
              <div className="font-bold text-lg">{riskData.paymentHistory.onTimeRatio}%</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Late</div>
              <div className="font-bold text-lg">{riskData.paymentHistory.latePayments}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Missed</div>
              <div className="font-bold text-lg">{riskData.paymentHistory.missedPayments}</div>
            </div>
          </div>
          <PaymentHistoryChart monthlyData={riskData.paymentHistory.monthlyData} />
        </div>
      </div>
      
      {/* Risk factors and timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Risk Factors */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium flex items-center">
            <AlertTriangle size={16} className="mr-2 text-blue-500" />
            Key Risk Factors
          </h3>
          <RiskFactors factors={riskData.riskFactors} />
        </div>
        
        {/* Timeline */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium flex items-center">
            <Clock size={16} className="mr-2 text-blue-500" />
            Recent Activity Timeline
          </h3>
          <div className="mt-4">
            {riskData.timeline.map((event, index) => (
              <TimelineEvent key={index} event={event} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Recommendation */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex">
          <Info size={20} className="text-blue-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800">AI Recommendation</h3>
            <p className="text-blue-700 mt-1">{riskData.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Analytics Page Component
export const AnalyticsPage = () => {
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [filterConsent, setFilterConsent] = useState(false);
  const [riskFilter, setRiskFilter] = useState('all');
  
  // Filter borrowers with consent if filter is active
  const filteredBorrowers = filterConsent
    ? mockBorrowers.filter(borrower => borrower.hasConsent)
    : mockBorrowers;
  
  // Calculate overall portfolio risk
  const calculatePortfolioRisk = () => {
    // Get borrowers with risk data
    const borrowersWithRiskData = mockBorrowers.filter(b => mockRiskData[b.id]);
    if (borrowersWithRiskData.length === 0) return { low: 0, medium: 0, high: 0 };
    
    const riskCounts = borrowersWithRiskData.reduce((acc, borrower) => {
      const risk = mockRiskData[borrower.id].riskScore;
      if (risk <= 40) acc.low++;
      else if (risk <= 70) acc.medium++;
      else acc.high++;
      return acc;
    }, { low: 0, medium: 0, high: 0 });
    
    const total = borrowersWithRiskData.length;
    return {
      low: Math.round((riskCounts.low / total) * 100),
      medium: Math.round((riskCounts.medium / total) * 100),
      high: Math.round((riskCounts.high / total) * 100)
    };
  };
  
  const portfolioRisk = calculatePortfolioRisk();
  
  // Calculate alert counts 
  const alertCounts = {
    high: mockBorrowers.filter(b => mockRiskData[b.id] && mockRiskData[b.id].riskScore > 70).length,
    medium: mockBorrowers.filter(b => mockRiskData[b.id] && mockRiskData[b.id].riskScore > 40 && mockRiskData[b.id].riskScore <= 70).length
  };
  
  // Select first borrower with data by default
  useEffect(() => {
    const borrowerWithData = mockBorrowers.find(b => mockRiskData[b.id]);
    if (borrowerWithData && !selectedBorrower) {
      setSelectedBorrower(borrowerWithData);
    }
  }, [selectedBorrower]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gray-50"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Loan Default Analytics</h1>
            <p className="text-gray-500">AI-powered early warning system for loan defaults</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search borrowers..."
                className="pl-10 pr-4 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button className="p-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50">
              <Bell size={18} />
            </button>
            <button className="px-3 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 inline-flex items-center">
              <Filter size={16} className="mr-2" />
              <span className="text-sm">Filters</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="High Risk Alerts"
          value={alertCounts.high}
          icon={<AlertTriangle size={20} />}
          trend={12}
          description="since last month"
        />
        <SummaryCard
          title="Medium Risk Alerts"
          value={alertCounts.medium}
          icon={<TrendingDown size={20} />}
          trend={-5}
          description="since last month"
        />
        <SummaryCard
          title="Portfolio Health"
          value={portfolioRisk.low + '%'}
          icon={<BarChart3 size={20} />}
          description="low risk borrowers"
        />
        <SummaryCard
          title="Active AA Consents"
          value={Object.keys(mockConsentDetails).length}
          icon={<Users size={20} />}
          trend={8}
          description="new consents this month"
        />
      </div>
      
      {/* Portfolio Risk Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Portfolio Risk Distribution</h2>
          <div className="flex gap-2">
            <button className="text-sm text-gray-500 inline-flex items-center hover:text-gray-700">
              <Download size={16} className="mr-1" />
              Export
            </button>
            <button className="text-sm text-gray-500 inline-flex items-center hover:text-gray-700">
              <Share2 size={16} className="mr-1" />
              Share
            </button>
          </div>
        </div>
        
        <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div 
              className="bg-green-500 h-full flex items-center justify-center text-xs text-white font-medium" 
              style={{ width: `${portfolioRisk.low}%` }}
            >
              {portfolioRisk.low}%
            </div>
            <div 
              className="bg-yellow-500 h-full flex items-center justify-center text-xs text-white font-medium" 
              style={{ width: `${portfolioRisk.medium}%` }}
            >
              {portfolioRisk.medium}%
            </div>
            <div 
              className="bg-red-500 h-full flex items-center justify-center text-xs text-white font-medium" 
              style={{ width: `${portfolioRisk.high}%` }}
            >
              {portfolioRisk.high}%
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Low Risk</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Medium Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">High Risk</span>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Borrowers List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Borrowers</h2>
              <div className="flex items-center">
                <label className="flex items-center text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mr-2 h-4 w-4 rounded text-blue-600" 
                    checked={filterConsent}
                    onChange={() => setFilterConsent(!filterConsent)}
                  />
                  Show with consent only
                </label>
              </div>
            </div>
            
            <div className="flex overflow-x-auto scrollbar-hide mb-4">
              <button 
                className={`px-3 py-1 rounded-full text-sm mr-2 whitespace-nowrap ${riskFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setRiskFilter('all')}
              >
                All Borrowers
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm mr-2 whitespace-nowrap ${riskFilter === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setRiskFilter('high')}
              >
                High Risk
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm mr-2 whitespace-nowrap ${riskFilter === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setRiskFilter('medium')}
              >
                Medium Risk
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${riskFilter === 'low' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setRiskFilter('low')}
              >
                Low Risk
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {filteredBorrowers.map(borrower => {
                const hasRiskData = !!mockRiskData[borrower.id];
                const riskScore = hasRiskData ? mockRiskData[borrower.id].riskScore : null;
                
                // Apply risk filter
                if (riskFilter !== 'all') {
                  if (!hasRiskData) return null;
                  if (riskFilter === 'high' && riskScore <= 70) return null;
                  if (riskFilter === 'medium' && (riskScore <= 40 || riskScore > 70)) return null;
                  if (riskFilter === 'low' && riskScore > 40) return null;
                }
                
                return (
                  <div 
                    key={borrower.id}
                    className={`border rounded-lg p-4 cursor-pointer transition hover:border-blue-300 ${selectedBorrower?.id === borrower.id ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => setSelectedBorrower(borrower)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{borrower.name}</h3>
                        <div className="text-sm text-gray-500 mt-1">
                          {borrower.loanType} • ₹{borrower.loanAmount.toLocaleString()}
                        </div>
                      </div>
                      {hasRiskData && <RiskScore score={riskScore} />}
                    </div>
                    <div className="flex items-center mt-3">
                      <div className={`w-2 h-2 rounded-full ${borrower.hasConsent ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                      <span className="text-xs text-gray-500">{borrower.hasConsent ? 'Consent Active' : 'No Consent'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Borrower Details Panel */}
        <div className="lg:col-span-2">
          <BorrowerDetail 
            borrower={selectedBorrower}
            riskData={selectedBorrower ? mockRiskData[selectedBorrower.id] : null}
            consentDetails={selectedBorrower && selectedBorrower.hasConsent ? mockConsentDetails : null}
          />
        </div>
      </div>
    </motion.div>
  );
};