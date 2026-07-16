import React from 'react';
import { FiUsers, FiFileText, FiCheckCircle, FiPackage } from 'react-icons/fi';

const AdminStats = ({ stats = {} }) => {
  const statItems = [
    { icon: FiUsers, label: 'Team Members', value: stats.users?.active || 0, subtitle: `${stats.users?.total || 0} total`, color: 'bg-brand-500' },
    { icon: FiFileText, label: 'Pending Reports', value: stats.reports?.pending || 0, subtitle: `${stats.reports?.today || 0} today`, color: 'bg-amber-500' },
    { icon: FiCheckCircle, label: 'Approved Reports', value: stats.reports?.approved || 0, subtitle: `${stats.reports?.total || 0} total`, color: 'bg-[#1A3258]' },
    { icon: FiPackage, label: 'Equipment', value: stats.equipment?.available || 0, subtitle: `${stats.equipment?.total || 0} total`, color: 'bg-[#B69F60]' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="card card-hover">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#1A3258]/70 dark:text-white/70">{item.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-[#1A3258] dark:text-white mt-1">{item.value}</p>
              {item.subtitle && <p className="text-xs text-[#1A3258]/50 dark:text-white/50 mt-1">{item.subtitle}</p>}
            </div>
            <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white`}>
              <item.icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
