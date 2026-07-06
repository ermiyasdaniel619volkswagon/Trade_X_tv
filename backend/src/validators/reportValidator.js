
export const validateReport = (data) => {
  const errors = [];

  if (data.contentProduction) {
    const fields = ['videosRecorded', 'interviewsRecorded', 'brollClipsCaptured', 'photosTaken'];
    fields.forEach(field => {
      if (data.contentProduction[field] !== undefined) {
        const value = Number(data.contentProduction[field]);
        if (isNaN(value) || value < 0) {
          errors.push({
            field: `contentProduction.${field}`,
            message: `${field} must be a non-negative number`,
          });
        }
      }
    });
  }

  if (data.videoEditing) {
    const fields = ['videosEdited', 'reelsProduced', 'thumbnailsCreated'];
    fields.forEach(field => {
      if (data.videoEditing[field] !== undefined) {
        const value = Number(data.videoEditing[field]);
        if (isNaN(value) || value < 0) {
          errors.push({
            field: `videoEditing.${field}`,
            message: `${field} must be a non-negative number`,
          });
        }
      }
    });
  }

  if (data.eod) {
    if (!data.eod.accomplishments || data.eod.accomplishments.trim() === '') {
      errors.push({
        field: 'eod.accomplishments',
        message: 'Accomplishments are required',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  validateReport,
};