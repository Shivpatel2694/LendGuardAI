import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Building, FileText, Mail, User, Briefcase, Lock, Upload } from 'lucide-react';

export const SignUp = () => {
  // Basic user information
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [logo, setLogo] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  // UI states
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auth context and navigation
  const { signUp } = useAuth();
  const navigate = useNavigate();

  console.log('Auth context loaded:', !!signUp); // Log if auth context is loaded properly

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log('Logo selected:', selectedFile.name, selectedFile.type, selectedFile.size);
      setLogo(selectedFile);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          console.log('Logo preview generated successfully');
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Form data:', {
      companyName,
      registrationNumber,
      email,
      contactPerson,
      designation,
      passwordLength: password.length,
      confirmPasswordLength: confirmPassword.length,
      logo: logo ? 'Present' : 'Not present',
      agreeTerms
    });

    setError('');
    setIsLoading(true);

    // Validation
    if (password !== confirmPassword) {
      console.error('Validation failed: Passwords do not match');
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!agreeTerms) {
      console.error('Validation failed: Terms and conditions not accepted');
      setError('You must agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting signup with auth context');

      const signUpData = {
        company_name: companyName,
        registration_number: registrationNumber,
        email,
        contact_person: contactPerson,
        designation,
        password,
        logo
      };

      console.log('SignUp data structure:', Object.keys(signUpData));

      // Add more detailed logging to help diagnose the issue
      try {
        await signUp(signUpData);
        console.log('Signup successful, navigating to dashboard');
        navigate('/dashboard');
      } catch (signUpError) {
        console.error('Specific signUp error:', signUpError);
        throw signUpError;
      }
    } catch (err) {
      console.error('Signup error:', err);

      // More detailed error logging
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error name:', err.name);
        console.error('Error stack:', err.stack);

        // if (err.response) {
        //   console.error('API Response error data:', err.response.data);
        //   console.error('API Response error status:', err.response.status);
        //   console.error('API Response error headers:', err.response.headers);

        //   if (err.response.data?.error) {
        //     setError(err.response.data.error);
        //   } else {
        //     setError(`Error ${err.response.status}: ${err.message}`);
        //   }
        // } else {
        //   setError(err.message || 'Error creating account');
        // }
      } else {
        console.error('Unknown error type:', typeof err);
        setError('Error creating account');
      }
    } finally {
      console.log('Signup process completed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        {/* Logo and branding */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center space-x-2">
            <TrendingUp className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              LendGuardAI
            </span>
          </Link>
        </div>

        {/* Card container */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Card header */}
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <h2 className="text-center text-2xl font-bold">Create Your Account</h2>
            <p className="text-center text-blue-100 mt-1">Join LendGuardAI today</p>
          </div>

          {/* Card body */}
          <div className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Company Name */}
              <div className="space-y-2">
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                  Company/NBFC Name*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="company-name"
                    name="companyName"
                    type="text"
                    required
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Your Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Registration Number */}
              <div className="space-y-2">
                <label htmlFor="registration-number" className="block text-sm font-medium text-gray-700">
                  Business Registration Number
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="registration-number"
                    name="registrationNumber"
                    type="text"
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Registration Number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Company Email Address*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="company@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Person */}
                <div className="space-y-2">
                  <label htmlFor="contact-person" className="block text-sm font-medium text-gray-700">
                    Contact Person
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="contact-person"
                      name="contactPerson"
                      type="text"
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Contact Person"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Designation */}
                <div className="space-y-2">
                  <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                    Designation
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="designation"
                      name="designation"
                      type="text"
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Designation"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Company Logo Upload */}
              <div className="space-y-2">
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                  Company Logo (Optional)
                </label>
                <div className="mt-1 flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    {logoPreview ? (
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={logoPreview}
                        alt="Logo preview"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <Building className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="relative w-full">
                    <label
                      htmlFor="logo-upload"
                      className="flex justify-center items-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Upload Logo</span>
                      <input
                        id="logo-upload"
                        name="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="sr-only"
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    terms and conditions
                  </Link>
                </label>
              </div>

              {/* Sign up button */}
              <div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Card footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-center">
            <span className="text-sm text-gray-600">Already have an account?</span>
            <Link to="/login" className="ml-2 text-sm font-medium text-blue-600 hover:text-blue-500">
              Sign in instead
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
