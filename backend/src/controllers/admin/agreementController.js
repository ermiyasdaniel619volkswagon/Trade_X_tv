import AgreementTemplate from '../../models/AgreementTemplate.js';
import { logger } from '../../utils/logger.js';
import mongoose from 'mongoose';

// =============================================
// GET ALL AGREEMENT TEMPLATES (Supervisor Only)
// =============================================

export const getAllTemplates = async (req, res) => {
  try {
    const templates = await AgreementTemplate.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'firstName lastName email');

    return res.status(200).json({
      success: true,
      templates,
    });
  } catch (error) {
    logger.error('Get all templates error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// GET DEFAULT TEMPLATE (Public)
// =============================================

export const getDefaultTemplate = async (req, res) => {
  try {
    const template = await AgreementTemplate.getDefault();

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'No default template found',
      });
    }

    return res.status(200).json({
      success: true,
      template,
    });
  } catch (error) {
    logger.error('Get default template error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// CREATE AGREEMENT TEMPLATE (Supervisor Only)
// =============================================

export const createTemplate = async (req, res) => {
  try {
    const { name, version, content, isDefault } = req.body;
    const supervisorId = req.userId;

    if (!name || !content) {
      return res.status(400).json({
        success: false,
        error: 'Name and content are required',
      });
    }

    // If this template is set as default, unset any existing default
    if (isDefault) {
      await AgreementTemplate.updateMany(
        { isDefault: true },
        { isDefault: false }
      );
    }

    const template = new AgreementTemplate({
      name,
      version: version || '1.0',
      content,
      isDefault: isDefault || false,
      isActive: true,
      createdBy: supervisorId,
    });

    await template.save();

    logger.info(`Agreement template created by supervisor ${supervisorId}`);

    return res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template,
    });
  } catch (error) {
    logger.error('Create template error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// UPDATE AGREEMENT TEMPLATE (Supervisor Only)
// =============================================

export const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID',
      });
    }

    const template = await AgreementTemplate.findById(id);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }

    // If this template is set as default, unset any existing default
    if (updates.isDefault) {
      await AgreementTemplate.updateMany(
        { _id: { $ne: id }, isDefault: true },
        { isDefault: false }
      );
    }

    Object.assign(template, updates);
    await template.save();

    logger.info(`Agreement template ${id} updated`);

    return res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      template,
    });
  } catch (error) {
    logger.error('Update template error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// =============================================
// DELETE AGREEMENT TEMPLATE (Supervisor Only)
// =============================================

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID',
      });
    }

    const template = await AgreementTemplate.findById(id);
    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found',
      });
    }

    // Don't allow deleting the default template
    if (template.isDefault) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete the default template. Set another template as default first.',
      });
    }

    await template.deleteOne();

    logger.info(`Agreement template ${id} deleted`);

    return res.status(200).json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    logger.error('Delete template error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};