import validator from 'validator';

export const validateAdvertisingRequest = (data) => {
  const errors = [];

  // Company Information
  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.push({ field: 'companyName', message: 'Company name must be at least 2 characters' });
  }

  if (!data.companyIndustry || data.companyIndustry.trim().length < 2) {
    errors.push({ field: 'companyIndustry', message: 'Industry is required' });
  }

  if (!data.contactPerson || data.contactPerson.trim().length < 2) {
    errors.push({ field: 'contactPerson', message: 'Contact person is required' });
  }

  // Advertising Details
  const validAdTypes = ['tv_spot', 'radio_ad', 'digital_campaign', 'sponsorship', 'custom'];
  if (!data.adType || !validAdTypes.includes(data.adType)) {
    errors.push({ field: 'adType', message: 'Invalid advertising type' });
  }

  if (!data.duration || data.duration < 1 || data.duration > 52) {
    errors.push({ field: 'duration', message: 'Duration must be between 1 and 52 weeks' });
  }

  // Budget
  if (data.budgetRange) {
    if (data.budgetRange.min < 0 || data.budgetRange.max < 0) {
      errors.push({ field: 'budgetRange', message: 'Budget values must be positive' });
    }
    if (data.budgetRange.min > data.budgetRange.max) {
      errors.push({ field: 'budgetRange', message: 'Minimum budget cannot exceed maximum budget' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateProfileUpdate = (data) => {
  const errors = [];

  if (data.email && !validator.isEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (data.phone && !validator.isMobilePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateAdvertisingRequest,
  validateProfileUpdate,
};