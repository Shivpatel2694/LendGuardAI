
import { motion } from 'framer-motion';
import { Navbar } from '../Components/Navbar';
import { Footer } from '../Components/Footer';

interface CaseStudyProps {
  title: string;
  challenge: string;
  solution: string;
  results: string;
  image: string;
  reversed?: boolean;
}

const CaseStudy: React.FC<CaseStudyProps> = ({ title, challenge, solution, results, image, reversed = false }) => {
  return (
    <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 mb-16 py-8 border-b border-gray-200`}>
      <div className="md:w-1/2">
        <img src={image} alt={title} className="rounded-lg shadow-lg w-full h-102 object-cover" />
      </div>
      <div className="md:w-1/2">
        <h3 className="text-2xl font-bold text-blue-600 mb-3">{title}</h3>
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Challenge</h4>
          <p className="text-gray-600">{challenge}</p>
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Solution</h4>
          <p className="text-gray-600">{solution}</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Results</h4>
          <p className="text-gray-600">{results}</p>
        </div>
      </div>
    </div>
  );
};

export const CaseStudies = () => {
  const caseStudies = [
    {
      title: "Regional Cooperative Bank Reduces NPAs by 37%",
      challenge: "A regional cooperative bank with assets of ₹8,500 crores was experiencing rising NPA levels, particularly in their MSME loan portfolio. Traditional credit monitoring was failing to identify at-risk borrowers until it was too late for meaningful intervention.",
      solution: "Implementing our AA-powered early warning system allowed the bank to monitor real-time transaction data across customer accounts and identify cash flow irregularities before they escalated to defaults.",
      results: "Within 6 months, the bank reduced new NPAs by 37%, improved collection efficiency by 22%, and saved an estimated ₹12 crores in potential bad loans through early intervention strategies.",
      image: "https://cdn.vectorstock.com/i/500p/19/21/financial-crisis-vector-3611921.jpg"
    },
    {
      title: "Microfinance Institution Improves Portfolio Quality",
      challenge: "A microfinance institution serving 1.2 million customers was struggling with growing delinquencies due to limited visibility into borrowers' overall financial health and evolving cash flow patterns.",
      solution: "Our system integrated with their loan management platform, analyzing multi-bank transaction patterns to detect early signs of financial stress, seasonal business fluctuations, and potential over-indebtedness.",
      results: "Portfolio at Risk (PAR) decreased from 4.8% to 2.3% within 9 months. The proactive risk management led to better-targeted financial inclusion products and improved business sustainability.",
      image: 'https://fastercapital.com/i/Microfinance-Portfolio--The-Portfolio-Management-and-Diversification-of-Microfinance--Diversification-Techniques-for-Microfinance-Investments.webp',
      reversed: true
    },
    {
      title: "Large NBFC Enhances Loan Collection Strategy",
      challenge: "A leading NBFC with a ₹25,000 crore loan book needed to optimize its collection strategy amidst rising operational costs and increasing defaults in its unsecured lending portfolio.",
      solution: "Our AI-powered system analyzed real-time bank data to prioritize collection efforts, assessing borrower payment capacity, predicting optimal collection timing, and identifying high-risk accounts for early intervention.",
      results: "Collection efficiency improved by 18%, operational costs decreased by 12%, and the NBFC achieved a 25% reduction in accounts progressing to late-stage delinquency through timely intervention strategies.",
      image: "https://decentro.tech/blog/wp-content/uploads/DebtCollectionProcess.jpeg"
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
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Case Studies</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our AI-powered early warning system has helped financial institutions 
            reduce NPAs, improve risk management, and optimize lending strategies.
          </p>
        </div>

        <div className="mb-16">
          {caseStudies.map((study, index) => (
            <CaseStudy 
              key={index}
              title={study.title}
              challenge={study.challenge}
              solution={study.solution}
              results={study.results}
              image={study.image}
              reversed={study.reversed}
            />
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Ready to see similar results for your organization?</h2>
          <p className="text-gray-600 mb-6">
            Schedule a demo to learn how our AI-powered early warning system can help your financial 
            institution reduce risk and optimize lending strategies.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Let's get Started
          </button>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};