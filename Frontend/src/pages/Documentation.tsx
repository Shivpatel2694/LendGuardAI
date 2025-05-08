import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';

interface DocSectionProps {
  title: string;
  content: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const DocSection: React.FC<DocSectionProps> = ({ title, content, isActive, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        onClick={onClick}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-xl font-semibold text-blue-600">{title}</h3>
        <svg
          className={`w-6 h-6 transition-transform ${isActive ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isActive && (
        <div className="mt-4 text-gray-600 pl-2">
          {content}
        </div>
      )}
    </div>
  );
};

export const Documentation = () => {
  const [activeSection, setActiveSection] = useState<string | null>('overview');

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const documentationSections = [
    {
      id: 'overview',
      title: 'System Overview',
      content: (
        <div className="space-y-4">
          <p>
            Our AI-Powered Early Warning System leverages the Account Aggregator (AA) framework to detect early signs of loan defaults. 
            The system securely ingests real-time bank data, analyzes financial behaviors, and generates actionable risk insights.
          </p>
          <div className="my-6">
            <img src="/api/placeholder/800/400" alt="System Architecture" className="rounded-lg shadow-md w-full" />
            <p className="text-sm text-gray-500 mt-2 text-center">High-level architecture of the early warning system</p>
          </div>
          <p>
            The solution consists of three primary components:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Data Ingestion Layer:</strong> Securely connects to the AA framework to retrieve consented financial data</li>
            <li><strong>Analytics Engine:</strong> Processes transaction data using Amazon Redshift and applies machine learning models</li>
            <li><strong>Visualization Dashboard:</strong> Presents risk scores and early warning indicators with actionable insights</li>
          </ul>
        </div>
      )
    },
    {
      id: 'aa-integration',
      title: 'Account Aggregator Integration',
      content: (
        <div className="space-y-4">
          <p>
            The Account Aggregator (AA) framework enables secure, consent-based financial data sharing between Financial Information 
            Providers (FIPs) and Financial Information Users (FIUs).
          </p>
          <h4 className="text-lg font-medium text-gray-800 mt-4">Implementation Steps:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Register as a Financial Information User (FIU) with an AA</li>
            <li>Implement the consent artifact flow to request user permission</li>
            <li>Process encrypted financial data upon successful consent</li>
            <li>Implement proper data security and privacy measures</li>
          </ol>
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h5 className="font-medium text-gray-800">Sample Consent Flow:</h5>
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
              {`// Example consent request payload
{
  "consentDetail": {
    "consentType": "TRANSACTIONS",
    "purpose": "Loan risk assessment",
    "dataLife": {
      "unit": "MONTH",
      "value": 1
    },
    "frequency": {
      "unit": "MONTH", 
      "value": 1
    },
    "dataFilter": [
      {
        "type": "TRANSACTIONAMOUNT",
        "operator": ">=",
        "value": "0"
      }
    ]
  }
}`}
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Data Analytics & Risk Modeling',
      content: (
        <div className="space-y-4">
          <p>
            Our system uses Amazon Redshift for scalable analytics and applies machine learning models to detect early warning signs.
          </p>
          <h4 className="text-lg font-medium text-gray-800 mt-4">Key Analytics Features:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Transaction Pattern Analysis:</strong> Identifies unusual spending or income patterns</li>
            <li><strong>Cash Flow Prediction:</strong> Forecasts future liquidity based on historical patterns</li>
            <li><strong>Income Stability Assessment:</strong> Evaluates consistency and reliability of income sources</li>
            <li><strong>EMI Stress Detection:</strong> Analyzes EMI payment behaviors across lenders</li>
          </ul>
          <h4 className="text-lg font-medium text-gray-800 mt-4">Risk Indicators:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-red-50 p-3 rounded-lg">
              <h5 className="font-medium text-red-700">High Risk Indicators</h5>
              <ul className="list-disc pl-5 mt-2 text-gray-700 text-sm">
                <li>Multiple EMI bounces</li>
                <li>Significant income reduction</li>
                <li>Increasing reliance on credit</li>
                <li>Frequent cash withdrawals near payment dates</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h5 className="font-medium text-yellow-700">Medium Risk Indicators</h5>
              <ul className="list-disc pl-5 mt-2 text-gray-700 text-sm">
                <li>Occasional EMI delays</li>
                <li>Moderate income fluctuations</li>
                <li>Increasing credit utilization</li>
                <li>Changes in spending patterns</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Dashboard & Reporting',
      content: (
        <div className="space-y-4">
          <p>
            The dashboard provides comprehensive visualizations and reporting capabilities to help lenders 
            identify at-risk borrowers and take proactive actions.
          </p>
          <div className="my-6">
            <img src="/api/placeholder/800/400" alt="Dashboard Screenshot" className="rounded-lg shadow-md w-full" />
            <p className="text-sm text-gray-500 mt-2 text-center">Early Warning System Dashboard</p>
          </div>
          <h4 className="text-lg font-medium text-gray-800 mt-4">Key Dashboard Features:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Risk Score Visualization:</strong> Color-coded risk indicators with drill-down capabilities</li>
            <li><strong>Portfolio Segmentation:</strong> Segment borrowers by risk level, industry, and geography</li>
            <li><strong>Early Warning Alerts:</strong> Automated notifications for significant risk changes</li>
            <li><strong>Trend Analysis:</strong> Track risk evolution over time with comparative analytics</li>
            <li><strong>Action Tracking:</strong> Document interventions and monitor their effectiveness</li>
          </ul>
          <p>
            The dashboard is accessible via web and mobile interfaces, ensuring lenders can monitor portfolio risk 
            and take actions from anywhere.
          </p>
        </div>
      )
    },
    {
      id: 'api',
      title: 'API Documentation',
      content: (
        <div className="space-y-4">
          <p>
            Our system provides RESTful APIs for integration with existing loan management systems and banking platforms.
          </p>
          <h4 className="text-lg font-medium text-gray-800 mt-4">Available Endpoints:</h4>
          <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-4">
            <div>
              <h5 className="font-medium text-blue-600">GET /api/v1/risk-scores</h5>
              <p className="text-sm mt-1">Retrieve risk scores for borrowers based on specified criteria.</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto">
{`{
  "customer_id": "12345",
  "risk_score": 78,
  "risk_level": "MEDIUM",
  "warning_indicators": [
    {
      "type": "INCOME_REDUCTION",
      "severity": "HIGH",
      "description": "Income reduced by 35% over the last 3 months"
    },
    {
      "type": "EMI_DELAY",
      "severity": "MEDIUM",
      "description": "Late payment on 2 EMIs in the past 60 days"
    }
  ],
  "trend": "INCREASING"
}`}
              </pre>
            </div>
            <div>
              <h5 className="font-medium text-blue-600">POST /api/v1/consent/request</h5>
              <p className="text-sm mt-1">Initiate an Account Aggregator consent request for a customer.</p>
            </div>
            <div>
              <h5 className="font-medium text-blue-600">GET /api/v1/analytics/portfolio</h5>
              <p className="text-sm mt-1">Get portfolio-level risk analysis with customizable filters.</p>
            </div>
          </div>
          <p className="mt-4">
            For complete API documentation, including request parameters, authentication, and response schemas,
            please contact our integration team.
          </p>
        </div>
      )
    },
    {
      id: 'implementation',
      title: 'Implementation Guide',
      content: (
        <div className="space-y-4">
          <p>
            Implementing our AI-Powered Early Warning System involves several steps to ensure successful integration 
            with your existing loan management processes.
          </p>
          <h4 className="text-lg font-medium text-gray-800 mt-4">Implementation Roadmap:</h4>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong>Discovery & Assessment</strong>
              <p className="text-sm mt-1">
                Evaluate current loan portfolios, identify high-risk segments, and define implementation objectives.
              </p>
            </li>
            <li>
              <strong>Technical Integration</strong>
              <p className="text-sm mt-1">
                Set up Account Aggregator connections, API integrations, and data pipelines.
              </p>
            </li>
            <li>
              <strong>User Training</strong>
              <p className="text-sm mt-1">
                Train teams on dashboard usage, risk interpretation, and intervention strategies.
              </p>
            </li>
            <li>
              <strong>Pilot Launch</strong>
              <p className="text-sm mt-1">
                Deploy the system with a selected portfolio segment to validate performance.
              </p>
            </li>
            <li>
              <strong>Full Deployment</strong>
              <p className="text-sm mt-1">
                Roll out across your entire portfolio with ongoing optimization.
              </p>
            </li>
          </ol>
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <h5 className="font-medium text-blue-700">Implementation Timeline</h5>
            <p className="mt-2">
              A typical implementation takes 4-8 weeks depending on your organization's size and technical readiness.
              Our implementation team provides end-to-end support throughout the process.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white text-gray-900 font-sans"
    >
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive documentation for our AI-Powered Early Warning System for loan default prediction.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Contents</h2>
              <ul className="space-y-2">
                {documentationSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`text-left w-full py-2 px-4 rounded transition-colors ${
                        activeSection === section.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Need Help?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Our technical team is available to assist with implementation questions and support.
                </p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              {documentationSections.map((section) => (
                <DocSection
                  key={section.id}
                  title={section.title}
                  content={section.content}
                  isActive={activeSection === section.id}
                  onClick={() => toggleSection(section.id)}
                />
              ))}
            </div>
            <div className="bg-blue-50 p-6 rounded-lg mt-8 text-center">
              <h3 className="text-xl font-bold text-blue-600 mb-3">Ready to get started?</h3>
              <p className="text-gray-700 mb-6">
                Schedule a consultation with our implementation team to discuss your specific requirements.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition-colors">
                Request Implementation Call
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};