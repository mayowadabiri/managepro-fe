import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, CreditCardIcon, EditIcon, TagIcon, Trash2Icon, AlertCircleIcon, BarChart3Icon, DollarSignIcon } from 'lucide-react';
import { subscriptions, Subscription } from '../utils/mockData';
import SubscriptionForm from '../components/SubscriptionForm';
const SubscriptionDetails = () => {
  const params = useParams({ strict: false });
  const id = params.id as string;
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  useEffect(() => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      setSubscription(sub);
    } else {
      navigate({ to: '/subscriptions' });
    }
  }, [id, navigate]);
  if (!subscription) {
    return <div>Loading...</div>;
  }
  const handleEdit = (updatedSub: Omit<Subscription, 'id'> & {
    id?: string;
  }) => {
    setSubscription({
      ...updatedSub,
      id: subscription.id
    } as Subscription);
    setShowEditForm(false);
  };
  const handleDelete = () => {
    // In a real app, this would make an API call
    navigate({ to: '/subscriptions' });
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  const calculateTotalSpent = () => {
    const startDate = new Date(subscription.startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let totalSpent = 0;
    if (subscription.billingCycle === 'monthly') {
      totalSpent = subscription.price * (diffDays / 30);
    } else if (subscription.billingCycle === 'yearly') {
      totalSpent = subscription.price * (diffDays / 365);
    } else if (subscription.billingCycle === 'quarterly') {
      totalSpent = subscription.price * (diffDays / 90);
    } else if (subscription.billingCycle === 'weekly') {
      totalSpent = subscription.price * (diffDays / 7);
    }
    return totalSpent.toFixed(2);
  };
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const daysUntilRenewal = getDaysUntil(subscription.nextBillingDate);
  const renewalStatus = daysUntilRenewal <= 3 ? 'urgent' : daysUntilRenewal <= 7 ? 'warning' : 'normal';
  const getSubscriptionStatus = () => {
    if (subscription.status === 'cancelled') {
      return {
        label: 'Cancelled',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200'
      };
    }
    const daysLeft = getDaysUntil(subscription.nextBillingDate);
    if (daysLeft < 0) {
      return {
        label: 'Expired',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      };
    } else if (daysLeft <= 7) {
      return {
        label: 'About to expire',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-200'
      };
    } else {
      return {
        label: 'Active',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      };
    }
  };
  return <div>
    <div className="flex items-center mb-6">
      <button onClick={() => navigate('/subscriptions')} className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Back to subscriptions">
        <ArrowLeftIcon size={20} />
      </button>
      <h1 className="text-2xl font-bold text-gray-900">
        Subscription Details
      </h1>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Main subscription details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0">
            <div className="flex items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden mr-4 sm:mr-5 flex-shrink-0">
                <img src={subscription.logo} alt={subscription.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${subscription.name}&background=random&color=fff&size=128`;
                }} />
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {subscription.name}
                  </h2>
                  {(() => {
                    const status = getSubscriptionStatus();
                    return <span className={`px-3 py-1 text-sm font-medium rounded-full ${status.bgColor} ${status.textColor} border ${status.borderColor}`}>
                      {status.label}
                    </span>;
                  })()}
                </div>
                <div className="flex items-center mt-1">
                  <TagIcon size={16} className="text-gray-400 mr-1.5" />
                  <span className="text-sm text-gray-600">
                    {subscription.category}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 self-start sm:self-center">
              <button onClick={() => setShowEditForm(true)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" aria-label="Edit subscription">
                <EditIcon size={18} />
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" aria-label="Delete subscription">
                <Trash2Icon size={18} />
              </button>
            </div>
          </div>
          <div className="px-4 sm:px-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2 text-gray-500">
                  <CreditCardIcon size={16} className="mr-2" />
                  <h3 className="text-sm font-medium">Billing</h3>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  ${subscription.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  per {subscription.billingCycle.replace('ly', '')}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2 text-gray-500">
                  <CalendarIcon size={16} className="mr-2" />
                  <h3 className="text-sm font-medium">Next Payment</h3>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {formatDate(subscription.nextBillingDate)}
                </p>
                <p className={`text-sm ${daysUntilRenewal <= 3 ? 'text-red-600 font-medium' : daysUntilRenewal <= 7 ? 'text-amber-600 font-medium' : 'text-gray-600'}`}>
                  {daysUntilRenewal === 0 ? 'Today' : daysUntilRenewal === 1 ? 'Tomorrow' : daysUntilRenewal < 0 ? `Expired ${Math.abs(daysUntilRenewal)} days ago` : `${daysUntilRenewal} days left`}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2 text-gray-500">
                  <ClockIcon size={16} className="mr-2" />
                  <h3 className="text-sm font-medium">Started On</h3>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {formatDate(subscription.startDate)}
                </p>
              </div>
            </div>
            {renewalStatus !== 'normal' && <div className={`mt-6 p-4 rounded-lg flex items-start ${renewalStatus === 'urgent' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800'}`}>
              <AlertCircleIcon size={20} className="mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">
                  {renewalStatus === 'urgent' ? 'Payment Due Soon' : 'Upcoming Payment'}
                </h3>
                <p className="text-sm mt-1 opacity-90">
                  {renewalStatus === 'urgent' ? `This subscription will renew in ${daysUntilRenewal} days. Make sure you have sufficient funds available.` : `This subscription will renew in ${daysUntilRenewal} days. Review if you want to continue using this service.`}
                </p>
              </div>
            </div>}
          </div>
        </div>
        {/* Usage & Spending */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 pb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Usage & Spending
            </h2>
            <p className="text-sm text-gray-500">
              Your spending history for this subscription
            </p>
          </div>
          <div className="px-4 sm:px-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2 text-gray-500">
                  <DollarSignIcon size={16} className="mr-2" />
                  <h3 className="text-sm font-medium">Total Spent</h3>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  ${calculateTotalSpent()}
                </p>
                <p className="text-sm text-gray-600">
                  since {formatDate(subscription.startDate)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2 text-gray-500">
                  <BarChart3Icon size={16} className="mr-2" />
                  <h3 className="text-sm font-medium">Annual Cost</h3>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  $
                  {subscription.billingCycle === 'yearly' ? subscription.price.toFixed(2) : subscription.billingCycle === 'monthly' ? (subscription.price * 12).toFixed(2) : subscription.billingCycle === 'quarterly' ? (subscription.price * 4).toFixed(2) : (subscription.price * 52).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">per year</p>
              </div>
            </div>
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">
                Payment History
              </h3>
              <div className="space-y-3">
                {/* Mock payment history - in a real app this would come from the API */}
                {[...Array(3)].map((_, i) => {
                  const date = new Date(subscription.nextBillingDate);
                  date.setMonth(date.getMonth() - (i + 1));
                  return <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">
                        ${subscription.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(date.toISOString())}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions - Mobile */}
        <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 pb-2">
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="px-4 pb-4 flex flex-wrap gap-3">
            <button onClick={() => setShowEditForm(true)} className="flex-1 min-w-[120px] py-2.5 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              Edit Subscription
            </button>
            <Link to={`https://${subscription.name.toLowerCase().replace(' ', '')}.com`} target="_blank" className="flex-1 min-w-[120px] py-2.5 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center">
              Visit Website
            </Link>
            <button onClick={() => setShowDeleteConfirm(true)} className="flex-1 min-w-[120px] py-2.5 px-4 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50 transition-colors">
              Cancel Subscription
            </button>
          </div>
        </div>
        {/* Quick Actions - Desktop */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-3">
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="px-6 pb-6 space-y-3">
            <button onClick={() => setShowEditForm(true)} className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              Edit Subscription
            </button>
            <Link to={`https://${subscription.name.toLowerCase().replace(' ', '')}.com`} target="_blank" className="w-full py-2.5 px-4 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center">
              Visit Website
            </Link>
            <button onClick={() => setShowDeleteConfirm(true)} className="w-full py-2.5 px-4 rounded-lg border border-gray-200 text-red-600 hover:bg-red-50 transition-colors">
              Cancel Subscription
            </button>
          </div>
        </div>
        {/* Similar Subscriptions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 pb-3">
            <h2 className="text-lg font-bold text-gray-900">
              Similar Subscriptions
            </h2>
          </div>
          <div className="px-4 sm:px-6 pb-6">
            <div className="space-y-4">
              {subscriptions.filter(s => s.category === subscription.category && s.id !== subscription.id).slice(0, 3).map(sub => <div key={sub.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => navigate(`/subscription/${sub.id}`)}>
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden mr-3 flex-shrink-0">
                  <img src={sub.logo} alt={sub.name} className="w-8 h-8 object-contain" onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${sub.name}&background=random&color=fff&size=128`;
                  }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {sub.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ${sub.price.toFixed(2)}/{sub.billingCycle.slice(0, 2)}
                  </p>
                </div>
              </div>)}
            </div>
          </div>
        </div>
        {/* Tips */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-bold text-indigo-900 mb-3">
              Subscription Tips
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-1 text-indigo-600 mr-3 mt-0.5 flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-sm text-indigo-900">
                  Set a calendar reminder 7 days before renewal to review if
                  you still need this service
                </p>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-1 text-indigo-600 mr-3 mt-0.5 flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-sm text-indigo-900">
                  Check if there's a yearly payment option that could save you
                  money
                </p>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-1 text-indigo-600 mr-3 mt-0.5 flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-sm text-indigo-900">
                  Look for family or group plans if multiple people need this
                  service
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    {/* Edit Form Modal */}
    {showEditForm && <SubscriptionForm subscription={subscription} onSubmit={handleEdit} onCancel={() => setShowEditForm(false)} />}
    {/* Delete Confirmation Modal */}
    {showDeleteConfirm && <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Cancel Subscription
        </h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to cancel your subscription to{' '}
          {subscription.name}? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 order-2 sm:order-1">
            No, Keep It
          </button>
          <button onClick={handleDelete} className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 order-1 sm:order-2">
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>}
  </div>;
};
export default SubscriptionDetails;