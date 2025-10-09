import React from 'react';
interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
}
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon
}) => {
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        </div>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
      {change && <div className="mt-2">
          <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>}
    </div>;
};
export default StatCard;