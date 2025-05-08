import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer
} from 'recharts';
import { AlertCircle, CheckCircle, AlertTriangle, XCircle, Info, Award } from 'lucide-react';

// Analytics component that displays risk scores for borrowers
export default function Analytics({ borrowers = [] }) {
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [categoryStats, setCategoryStats] = useState({
    Low: 0,
    Medium: 0,
    High: 0,
    'Very High': 0
  });

  const API_URL = 'http://localhost:8000'; // Update this with your actual API URL

  useEffect(() => {
    const fetchRiskScores = async () => {
      if (!borrowers || borrowers.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/predict/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(borrowers),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch risk scores');
        }

        const data = await response.json();
        setRiskData(data);

        // Calculate category statistics
        const stats = {
          Low: 0,
          Medium: 0,
          High: 0,
          'Very High': 0
        };

        data.forEach(item => {
          stats[item.risk_category] = (stats[item.risk_category] || 0) + 1;
        });
        setCategoryStats(stats);

        // Select first borrower as default
        if (data.length > 0) {
          setSelectedBorrower(data[0]);
        }
      } catch (err) {
        console.error('Error fetching risk data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskScores();
  }, [borrowers]);

  const getRiskIcon = (category) => {
    switch (category) {
      case 'Low':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'Medium':
        return <Info className="text-blue-500" size={24} />;
      case 'High':
        return <AlertTriangle className="text-orange-500" size={24} />;
      case 'Very High':
        return <XCircle className="text-red-500" size={24} />;
      default:
        return <AlertCircle className="text-gray-500" size={24} />;
    }
  };

  const getRiskColor = (category) => {
    switch (category) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Very High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categoryColors = {
    'Low': '#10B981',
    'Medium': '#3B82F6',
    'High': '#F59E0B',
    'Very High': '#EF4444'
  };

  const distributionData = Object.entries(categoryStats).map(([category, count]) => ({
    category,
    count,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <h3 className="font-bold">Error loading risk data</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (riskData.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
        No borrower data available for risk analysis.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Loan Default Risk Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(categoryStats).map(([category, count]) => (
          <div key={category} className={`p-4 rounded-lg border ${getRiskColor(category)}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{category} Risk</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
              {getRiskIcon(category)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Risk Distribution Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                name="Borrowers"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Score Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Risk Score Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={riskData.sort((a, b) => a.risk_score - b.risk_score)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={false}
                label={{ value: 'Borrowers (Sorted by Risk)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis domain={[0, 100]} label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => [`${value.toFixed(2)}`, 'Risk Score']} />
              <Line
                type="monotone"
                dataKey="risk_score"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Borrower Selection and Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Borrower Risk Details</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {riskData.map((borrower) => (
            <button
              key={borrower.borrower_id}
              onClick={() => setSelectedBorrower(borrower)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium border
                ${selectedBorrower?.borrower_id === borrower.borrower_id
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
              `}
            >
              {borrower.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Borrower Details */}
      {selectedBorrower && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{selectedBorrower.name}</h3>
              <p className="text-gray-500">ID: {selectedBorrower.borrower_id}</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-medium ${getRiskColor(selectedBorrower.risk_category)}`}>
              {selectedBorrower.risk_category} Risk
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Risk Score</span>
              <span className="font-bold">{selectedBorrower.risk_score.toFixed(2)}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full"
                style={{
                  width: `${selectedBorrower.risk_score}%`,
                  backgroundColor: categoryColors[selectedBorrower.risk_category]
                }}
              ></div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Award className="mr-2" size={16} />
              Top Risk Factors
            </h4>
            <ul className="space-y-2">
              {selectedBorrower.top_factors ? (
                selectedBorrower.top_factors.map((factor, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <span className="text-gray-700">{factor.feature.replace(/_/g, ' ')}</span>
                    <span className="font-medium">{(factor.importance * 100).toFixed(1)}%</span>
                  </li>
                ))
              ) : (
                <li className="p-2 bg-white rounded border border-gray-200">
                  No detailed factor information available
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
