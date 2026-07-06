export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
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

export const getStatusBadge = (status) => {
  const badges = {
    pending: 'status-pending',
    approved: 'status-approved',
    revision_required: 'status-revision',
    rejected: 'status-rejected',
  };
  return badges[status] || 'status-pending';
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export default {
  formatDate,
  formatDateTime,
  getStatusColor,
  getStatusBadge,
  truncateText,
  generateId,
};