

export const validateAdvertisingRequest = (data) => {
  const errors = [];

  // Company Information Validation
  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.push({ field: 'companyName', message: 'Company name must be at least 2 characters' });
  }

  if (!data.companyIndustry || data.companyIndustry.trim().length < 2) {
    errors.push({ field: 'companyIndustry', message: 'Industry category is required' });
  }

  if (!data.contactPerson || data.contactPerson.trim().length < 2) {
    errors.push({ field: 'contactPerson', message: 'Contact person name is required' });
  }

  // TRADEX Media Kit Service Verification
  const validAdTypes = [
    'starter_visibility',
    'growth_partner',
    'strategic_sponsor',
    'business_documentary',
    'embassy_promotion',
    'livestream_launch',
    'studio_rental',
    'digital_ads'
  ];

  if (!data.adType || !validAdTypes.includes(data.adType)) {
    errors.push({ field: 'adType', message: 'Invalid advertising package selected' });
  }

  // ETB Budget Validation Lookups
  if (data.budgetRange) {
    const minBudget = Number(data.budgetRange.min || 0);
    const maxBudget = Number(data.budgetRange.max || 0);

    if (minBudget < 0 || maxBudget < 0) {
      errors.push({ field: 'budgetRange', message: 'Budget metrics must be non-negative values' });
    }
    if (minBudget > maxBudget && maxBudget > 0) {
      errors.push({ field: 'budgetRange', message: 'Minimum budget range cannot exceed maximum value' });
    }
  }

  // Legal Agreement Validation
  if (!data.agreementAccepted) {
    errors.push({ field: 'agreementAccepted', message: 'You must review and accept the media alignment agreement' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateProfileUpdate = (data) => {
  const errors = [];
  if (data.firstName && data.firstName.trim().length < 2) {
    errors.push({ field: 'firstName', message: 'First name must contain at least 2 characters' });
  }
  if (data.lastName && data.lastName.trim().length < 2) {
    errors.push({ field: 'lastName', message: 'Last name must contain at least 2 characters' });
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};