
import validator from 'validator';

export const validateLogin = (data) => {
  const errors = [];

  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validator.isEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRegister = (data) => {
  const errors = [];

  if (!data.firstName) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  } else if (data.firstName.length < 2) {
    errors.push({ field: 'firstName', message: 'First name must be at least 2 characters' });
  }

  if (!data.lastName) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  } else if (data.lastName.length < 2) {
    errors.push({ field: 'lastName', message: 'Last name must be at least 2 characters' });
  }

  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validator.isEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateLogin,
  validateRegister,
};