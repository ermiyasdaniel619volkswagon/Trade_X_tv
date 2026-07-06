
export const generateEmployeeId = () => {
  const prefix = 'EMP';
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${random}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'amber',
    approved: 'emerald',
    revision_required: 'rose',
    rejected: 'red',
  };
  return colors[status] || 'slate';
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    revision_required: 'Revision Required',
    rejected: 'Rejected',
  };
  return labels[status] || status;
};

export default {
  generateEmployeeId,
  formatDate,
  formatDateTime,
  getStatusColor,
  getStatusLabel,
};