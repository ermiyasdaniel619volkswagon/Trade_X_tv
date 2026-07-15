

import { OAuth2Client } from 'google-auth-library';
import User from '../../models/User.js';
import Customer from '../../models/Customer.js';
import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger.js';
import { generateEmployeeId } from '../../utils/helpers.js';

// ✅ Initialize OAuth2 client with your Client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// =============================================
// HELPER: Generate Random Password
// =============================================
async function generateRandomPassword() {
  const crypto = await import('crypto');
  const randomBytes = crypto.randomBytes(32);
  return randomBytes.toString('base64').slice(0, 32);
}

// =============================================
// HELPER: Find or Create User
// =============================================
async function findOrCreateUser(googleData) {
  const {
    googleId,
    email,
    firstName,
    lastName,
    profilePicture,
    emailVerified,
    role = 'media_officer',
  } = googleData;

  let user = await User.findOne({ googleId });

  if (user) {
    user.profilePicture = profilePicture || user.profilePicture;
    user.isEmailVerified = emailVerified || user.isEmailVerified;
    user.lastLogin = new Date();
    await user.save();
    return { user, isNew: false };
  }

  user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    user.googleId = googleId;
    user.provider = 'google';
    user.isEmailVerified = emailVerified || true;
    user.profilePicture = profilePicture || user.profilePicture;
    user.lastLogin = new Date();
    await user.save();
    return { user, isNew: false };
  }

  const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });

  if (existingCustomer) {
    const displayName = firstName && lastName 
      ? `${firstName} ${lastName}`.trim() 
      : email.split('@')[0];
    
    user = new User({
      firstName: firstName || displayName.split(' ')[0] || 'User',
      lastName: lastName || displayName.split(' ').slice(1).join(' ') || '',
      email: email.toLowerCase(),
      googleId,
      provider: 'google',
      isEmailVerified: emailVerified || false,
      profilePicture: profilePicture || '',
      role: role === 'supervisor' ? 'supervisor' : 'media_officer',
      employeeId: generateEmployeeId(),
      department: 'production',
      isActive: true,
      password: await generateRandomPassword(),
    });
    await user.save();
    
    existingCustomer.googleId = googleId;
    existingCustomer.provider = 'google';
    existingCustomer.isEmailVerified = emailVerified || true;
    if (profilePicture && !existingCustomer.profilePicture) {
      existingCustomer.profilePicture = profilePicture;
    }
    await existingCustomer.save();
    
    return { user, isNew: true };
  }

  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}`.trim() 
    : email.split('@')[0];
  
  const first = firstName || displayName.split(' ')[0] || 'User';
  const last = lastName || displayName.split(' ').slice(1).join(' ') || '';

  user = new User({
    firstName: first,
    lastName: last,
    email: email.toLowerCase(),
    googleId,
    provider: 'google',
    isEmailVerified: emailVerified || false,
    profilePicture: profilePicture || '',
    role: role === 'supervisor' ? 'supervisor' : 'media_officer',
    employeeId: generateEmployeeId(),
    department: 'production',
    isActive: true,
    password: await generateRandomPassword(),
  });
  await user.save();

  return { user, isNew: true };
}

// =============================================
// HELPER: Find or Create Customer
// =============================================
async function findOrCreateCustomer(googleData) {
  const {
    googleId,
    email,
    firstName,
    lastName,
    profilePicture,
    emailVerified,
  } = googleData;

  let customer = await Customer.findOne({ googleId });

  if (customer) {
    customer.profilePicture = profilePicture || customer.profilePicture;
    customer.isEmailVerified = emailVerified || customer.isEmailVerified;
    customer.lastLogin = new Date();
    await customer.save();
    return { customer, isNew: false };
  }

  customer = await Customer.findOne({ email: email.toLowerCase() });

  if (customer) {
    customer.googleId = googleId;
    customer.provider = 'google';
    customer.isEmailVerified = emailVerified || true;
    customer.profilePicture = profilePicture || customer.profilePicture;
    customer.lastLogin = new Date();
    await customer.save();
    return { customer, isNew: false };
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    const displayName = firstName && lastName 
      ? `${firstName} ${lastName}`.trim() 
      : email.split('@')[0];
    
    customer = new Customer({
      firstName: firstName || displayName.split(' ')[0] || '',
      lastName: lastName || displayName.split(' ').slice(1).join(' ') || '',
      email: email.toLowerCase(),
      googleId,
      provider: 'google',
      isEmailVerified: emailVerified || false,
      profilePicture: profilePicture || '',
      isActive: true,
      password: await generateRandomPassword(),
    });
    await customer.save();
    return { customer, isNew: true };
  }

  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}`.trim() 
    : email.split('@')[0];
  
  const first = firstName || displayName.split(' ')[0] || 'Customer';
  const last = lastName || displayName.split(' ').slice(1).join(' ') || '';

  customer = new Customer({
    firstName: first,
    lastName: last,
    email: email.toLowerCase(),
    googleId,
    provider: 'google',
    isEmailVerified: emailVerified || false,
    profilePicture: profilePicture || '',
    isActive: true,
    password: await generateRandomPassword(),
  });
  await customer.save();

  return { customer, isNew: true };
}

// =============================================
// ✅ GOOGLE AUTH - For Media Officers & Supervisors
// =============================================
export const googleAuth = async (req, res) => {
  try {
    console.log('\n🚀 [Google Auth] Request received for Media Officer/Supervisor');
    
    const idToken = req.body.idToken || req.body.id_token || req.body.token;
    const role = req.body.role || 'media_officer';

    console.log('  Token preview:', idToken ? idToken.substring(0, 30) + '...' : '❌ NO TOKEN');

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'ID token is required',
      });
    }

    let ticket;
    try {
      console.log('🔐 Verifying ID token...');
      ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      console.log('✅ ID token verified successfully');
    } catch (verifyError) {
      console.error('❌ Token verification failed:', verifyError.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid Google token: ' + verifyError.message,
      });
    }

    const payload = ticket.getPayload();
    console.log('📋 User info:');
    console.log('  Email:', payload.email);
    console.log('  Name:', payload.name);

    const {
      sub: googleId,
      email,
      name,
      given_name: firstName,
      family_name: lastName,
      picture: profilePicture,
      email_verified: emailVerified,
    } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email not provided by Google',
      });
    }

    const { user, isNew } = await findOrCreateUser({
      googleId,
      email,
      firstName,
      lastName,
      profilePicture,
      emailVerified,
      role,
    });

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated.',
        code: 'ACCOUNT_DEACTIVATED',
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    user.lastLogin = new Date();
    await user.save();

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department,
      isActive: user.isActive,
      profilePicture: user.profilePicture || null,
      provider: user.provider || 'google',
    };

    let redirectUrl;
    if (user.role === 'supervisor') {
      redirectUrl = '/admin/overview';
    } else {
      redirectUrl = '/dashboard/report';
    }

    console.log(`✅ Google auth successful: ${email}`);

    return res.status(200).json({
      success: true,
      token,
      user: userData,
      redirectUrl,
      isNewUser: isNew,
      message: 'Google sign-in successful',
    });

  } catch (error) {
    console.error('❌ Google auth error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message,
    });
  }
};

// =============================================
// ✅ GOOGLE AUTH - For Customers ONLY
// =============================================
export const googleAuthCustomer = async (req, res) => {
  try {
    console.log('\n🚀 [Google Customer Auth] Request received');
    
    const idToken = req.body.idToken || req.body.id_token || req.body.token;

    console.log('  Token preview:', idToken ? idToken.substring(0, 30) + '...' : '❌ NO TOKEN');

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'ID token is required',
      });
    }

    let ticket;
    try {
      console.log('🔐 Verifying ID token...');
      ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      console.log('✅ ID token verified successfully');
    } catch (verifyError) {
      console.error('❌ Token verification failed:', verifyError.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid Google token: ' + verifyError.message,
      });
    }

    const payload = ticket.getPayload();
    console.log('📋 User info:');
    console.log('  Email:', payload.email);
    console.log('  Name:', payload.name);

    const {
      sub: googleId,
      email,
      name,
      given_name: firstName,
      family_name: lastName,
      picture: profilePicture,
      email_verified: emailVerified,
    } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email not provided by Google',
      });
    }

    const { customer, isNew } = await findOrCreateCustomer({
      googleId,
      email,
      firstName,
      lastName,
      profilePicture,
      emailVerified,
    });

    if (!customer.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated.',
        code: 'ACCOUNT_DEACTIVATED',
      });
    }

    const token = jwt.sign(
      { userId: customer._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    customer.lastLogin = new Date();
    await customer.save();

    const userData = {
      id: customer._id,
      firstName: customer.firstName || 'Customer',
      lastName: customer.lastName || '',
      email: customer.email,
      role: 'customer',
      isActive: customer.isActive,
      profilePicture: customer.profilePicture || null,
      provider: customer.provider || 'google',
    };

    console.log(`✅ Google customer auth successful: ${email}`);

    return res.status(200).json({
      success: true,
      token,
      user: userData,
      redirectUrl: '/customer/dashboard',
      isNewUser: isNew,
      message: 'Google sign-in successful',
    });

  } catch (error) {
    console.error('❌ Google customer auth error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message,
    });
  }
};