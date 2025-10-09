import React, { useState } from 'react';
import { CalendarIcon, EditIcon, Trash2Icon, ClockIcon } from 'lucide-react';
import { Subscription } from '../utils/mockData';
interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete
}) => {
  const [imageError, setImageError] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  const formatPrice = (price: number, billingCycle: string) => {
    return `$${price.toFixed(2)}/${billingCycle === 'yearly' ? 'yr' : billingCycle === 'quarterly' ? 'qtr' : billingCycle === 'weekly' ? 'wk' : 'mo'}`;
  };
  // Generate a consistent color based on subscription name
  const generateColor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'];
    // Simple hash function to get consistent color for the same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Get positive value and map to color array
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };
  // Render logo or fallback to first letter in colored circle
  const renderLogo = () => {
    if (!subscription.logo || imageError) {
      const initial = subscription.name.charAt(0).toUpperCase();
      const colorClass = generateColor(subscription.name);
      return <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-white font-bold`}>
          {initial}
        </div>;
    }
    return <img src={subscription.logo} alt={subscription.name} className="w-10 h-10 object-contain" onError={() => setImageError(true)} />;
  };
  // Calculate days until expiration and status
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const getSubscriptionStatus = () => {
    if (subscription.status === 'cancelled') {
      return {
        label: 'Cancelled',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600'
      };
    }
    const daysLeft = getDaysUntil(subscription.nextBillingDate);
    if (daysLeft < 0) {
      return {
        label: 'Expired',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700'
      };
    } else if (daysLeft <= 7) {
      return {
        label: 'About to expire',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700'
      };
    } else {
      return {
        label: 'Active',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700'
      };
    }
  };
  const status = getSubscriptionStatus();
  const daysLeft = getDaysUntil(subscription.nextBillingDate);
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
            {renderLogo()}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{subscription.name}</h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.bgColor} ${status.textColor}`}>
                {status.label}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {subscription.category}
            </span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">
              {formatPrice(subscription.price, subscription.billingCycle)}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex flex-col">
            <div className="flex items-center text-gray-500">
              <CalendarIcon size={14} className="mr-1" />
              <span>
                Next billing: {formatDate(subscription.nextBillingDate)}
              </span>
            </div>
            {daysLeft > 0 && <div className="flex items-center text-gray-500 mt-1">
                <ClockIcon size={14} className="mr-1" />
                <span>
                  {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                </span>
              </div>}
          </div>
          <div className="flex space-x-2">
            <button onClick={() => onEdit(subscription.id)} className="p-1 text-gray-500 hover:text-blue-600 transition-colors" aria-label="Edit subscription">
              <EditIcon size={16} />
            </button>
            <button onClick={() => onDelete(subscription.id)} className="p-1 text-gray-500 hover:text-red-600 transition-colors" aria-label="Delete subscription">
              <Trash2Icon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default SubscriptionCard;