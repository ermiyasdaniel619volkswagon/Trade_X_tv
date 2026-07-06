
import User from '../models/User.js';
import { logger } from '../utils/logger.js';
import { generateEmployeeId } from '../utils/helpers.js';
import config from '../config/env.js';

export const createAdminIfNotExists = async () => {
  try {
    const adminEmail = config.adminEmail;
    const adminPassword = config.adminPassword;

    const existingSupervisor = await User.findOne({ email: adminEmail });
    
    if (!existingSupervisor) {
      logger.info('Creating supervisor user...');
      
      const supervisor = new User({
        firstName: 'Supervisor',
        lastName: 'User',
        email: adminEmail,
        password: adminPassword,
        role: 'supervisor',
        department: 'admin',
        employeeId: generateEmployeeId(),
        isActive: true,
      });

      await supervisor.save();
      logger.info(`✅ Supervisor user created: ${adminEmail}`);
    } else {
      logger.info(`✅ Supervisor user already exists: ${adminEmail}`);
    }
  } catch (error) {
    logger.error('Error creating supervisor user:', error);
    throw error;
  }
};

export default {
  createAdminIfNotExists,
};