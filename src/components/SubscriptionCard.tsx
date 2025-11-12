import { Calendar as CalendarIcon, Clock as ClockIcon, Edit as EditIcon, Trash2 as Trash2Icon } from 'lucide-react';
import { getReadableStatus, type Subscription } from '../types';
import { formatDate, } from '../utils/format';

type Props = {
  subscription: Subscription;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onClick: (id: number) => void;
};

export default function SubscriptionCard({ subscription, onEdit, onDelete, onClick }: Props) {
  const status = getReadableStatus(subscription.status);
  const daysLeft = subscription.daysLeft

  const name = subscription.service?.name ?? subscription.category?.name ?? 'Subscription';
  const logo = subscription.service?.imageUrl;

  return (
    <div
      onClick={() => onClick(subscription.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
    >
      <div className="p-5">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {logo ? (
              <img src={logo} alt={name} className="w-10 h-10 object-contain" onError={(e) => {
                (e.currentTarget as HTMLImageElement).onerror = null;
                (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
              }} />
            ) : (
              <div className="text-sm text-gray-500">{name[0]}</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900 truncate">{name}</h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.bgColor} ${status.textColor}`}>
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">{subscription.category?.name}</p>
          </div>

          <div className="text-right">
            <div className="font-semibold text-gray-900">${subscription.amount}</div>
            <div className="text-xs text-gray-500">per {subscription.billingCycle.replace('ly', '')}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="flex items-center text-gray-500">
              <CalendarIcon size={14} className="mr-1.5" />
              <span>Next: {formatDate(subscription.nextBillingDate)}</span>
            </div>
            {daysLeft > 0 && status.label !== 'Cancelled' && (
              <div className="flex items-center text-gray-500 mt-1">
                <ClockIcon size={14} className="mr-1.5" />
                <span className={`${daysLeft <= 3 ? 'text-red-600 font-medium' : daysLeft <= 7 ? 'text-amber-600 font-medium' : ''}`}>
                  {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button onClick={(e) => { e.stopPropagation(); onEdit(subscription.id); }} className="p-1 text-gray-500 hover:text-blue-600 transition-colors" aria-label="Edit subscription">
              <EditIcon size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(subscription.id); }} className="p-1 text-gray-500 hover:text-red-600 transition-colors" aria-label="Delete subscription">
              <Trash2Icon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
