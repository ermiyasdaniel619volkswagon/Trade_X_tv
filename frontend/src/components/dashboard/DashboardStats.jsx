import React from 'react';
import { FiVideo, FiCamera, FiEdit, FiAward } from 'react-icons/fi';

const DashboardStats = ({ stats = {} }) => {
  const statItems = [
    { icon: FiVideo, label: 'Videos Recorded', value: stats.totalVideosRecorded || 0, color: 'bg-brand-500' },
    { icon: FiCamera, label: 'Photos Taken', value: stats.totalPhotos || 0, color: 'bg-emerald-500' },
    { icon: FiEdit, label: 'Videos Edited', value: stats.totalVideosEdited || 0, color: 'bg-purple-500' },
    { icon: FiAward, label: 'Approved Reports', value: stats.approvedReports || 0, color: 'bg-amber-500' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
          <div className={`w-10 h-10 mx-auto rounded-full ${item.color} flex items-center justify-center text-white mb-2`}>
            <item.icon size={18} />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{item.value}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;