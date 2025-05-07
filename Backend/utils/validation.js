// Email validation
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation - requiring at least 8 characters, one uppercase, one lowercase, and one number
  const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Registration number validation - generic alphanumeric check
  const isValidRegistrationNumber = (regNumber) => {
    const regNumberRegex = /^[a-zA-Z0-9-_]{5,15}$/;
    return regNumberRegex.test(regNumber);
  };

  // Validate signup input
  const validateSignup = (userData) => {
    const errors = {};

    // Company name validation
    if (!userData.company_name || userData.company_name.trim() === '') {
      errors.company_name = 'Company name is required';
    } else if (userData.company_name.length < 2) {
      errors.company_name = 'Company name must be at least 2 characters';
    }

    // Email validation
    if (!userData.email || userData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!isValidEmail(userData.email)) {
      errors.email = 'Invalid email format';
    }

    // Password validation
    if (!userData.password) {
      errors.password = 'Password is required';
    } else if (!isStrongPassword(userData.password)) {
      errors.password = 'Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number';
    }

    // Registration number validation
    if (userData.registration_number && !isValidRegistrationNumber(userData.registration_number)) {
      errors.registration_number = 'Invalid registration number format';
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };

  // Validate login input
  const validateLogin = (userData) => {
    const errors = {};

    if (!userData.email || userData.email.trim() === '') {
      errors.email = 'Email is required';
    }

    if (!userData.password) {
      errors.password = 'Password is required';
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };

  module.exports = {
    isValidEmail,
    isStrongPassword,
    isValidRegistrationNumber,
    validateSignup,
    validateLogin
  };
