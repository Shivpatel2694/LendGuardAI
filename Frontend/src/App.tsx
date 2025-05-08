import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../Frontend/src/context/AuthContext';
import { Landing } from '../../Frontend/src/pages/Landing';
import { Login } from '../../Frontend/src/pages/Login';
import { SignUp } from '../../Frontend/src/pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Documentation } from './pages/Documentation';
import { CaseStudies } from './pages/CaseStudies';
import { Layout } from './Components/Layout';
import {AnalyticsPage} from './pages/Analytics';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<Layout/>}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path='/analytics' element={<AnalyticsPage  />}/>
          </Route>
          <Route path='/docs' element={<Documentation />} />
          <Route path='/case-studies' element={<CaseStudies/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
