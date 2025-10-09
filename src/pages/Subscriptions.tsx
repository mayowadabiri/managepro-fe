import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PlusIcon, FilterIcon, SearchIcon, GridIcon, ListIcon, ChevronDownIcon, ArrowUpIcon, ArrowDownIcon, CalendarIcon, EditIcon, Trash2Icon, ClockIcon, SlidersIcon } from 'lucide-react';
import SubscriptionCard from '../components/SubscriptionCard';
import SubscriptionForm from '../components/SubscriptionForm';
import { subscriptions as initialSubscriptions, categories, Subscription } from '../utils/mockData';
const Subscriptions = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const handleAddEdit = (subscription: Omit<Subscription, 'id'> & {
    id?: string;
  }) => {
    if (subscription.id) {
      // Edit existing
      setSubscriptions(prev => prev.map(sub => sub.id === subscription.id ? {
        ...subscription,
        id: sub.id
      } as Subscription : sub));
    } else {
      // Add new
      const newId = (Math.max(...subscriptions.map(s => parseInt(s.id))) + 1).toString();
      setSubscriptions(prev => [...prev, {
        ...subscription,
        id: newId
      } as Subscription]);
    }
    setShowForm(false);
    setEditingSubscription(undefined);
  };
  const handleEdit = (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    if (subscription) {
      setEditingSubscription(subscription);
      setShowForm(true);
    }
  };
  const handleDelete = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };
  const handleViewSubscription = (id: string) => {
    navigate({ to: `/subscription/${id}` });
  };
  // Filter and sort subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? sub.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      comparison = a.price - b.price;
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    } else if (sortBy === 'date') {
      comparison = new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  const formatPrice = (price: number, billingCycle: string) => {
    let suffix = 'mo';
    if (billingCycle === 'yearly') suffix = 'yr'; else if (billingCycle === 'quarterly') suffix = 'qtr'; else if (billingCycle === 'weekly') suffix = 'wk';
    return `$${price.toFixed(2)}/${suffix}`;
  };
  const getSubscriptionStatus = (subscription: Subscription) => {
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
  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  return <div>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-500 mt-1">
          Manage all your recurring payments
        </p>
      </div>
      <button onClick={() => {
        setEditingSubscription(undefined);
        setShowForm(true);
      }} className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
        <PlusIcon size={16} className="mr-2" />
        Add Subscription
      </button>
    </div>
    {/* Mobile Filters */}
    <div className="block sm:hidden mb-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="ml-2 p-2.5 border border-gray-200 rounded-lg flex items-center justify-center" aria-label="Filters">
          <SlidersIcon size={18} className="text-gray-500" />
        </button>
      </div>
      {showFilters && <div className="mt-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Category
          </label>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="border border-gray-200 rounded-lg text-sm py-2.5 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Categories</option>
            {categories.map(category => <option key={category} value={category}>
              {category}
            </option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            View
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg w-full">
            <button className={`flex-1 py-2.5 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'} rounded-l-lg transition-colors flex items-center justify-center`} onClick={() => setViewMode('grid')} aria-label="Grid view">
              <GridIcon size={16} className="mr-1.5" />
              <span className="text-sm">Grid</span>
            </button>
            <button className={`flex-1 py-2.5 ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'} rounded-r-lg transition-colors flex items-center justify-center`} onClick={() => setViewMode('table')} aria-label="Table view">
              <ListIcon size={16} className="mr-1.5" />
              <span className="text-sm">List</span>
            </button>
          </div>
        </div>
      </div>}
    </div>
    {/* Desktop Filters */}
    <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search subscriptions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <div className="flex items-center">
            <FilterIcon size={16} className="mr-2 text-gray-500" />
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="border border-gray-200 rounded-lg text-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Categories</option>
              {categories.map(category => <option key={category} value={category}>
                {category}
              </option>)}
            </select>
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button className={`p-2.5 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'} rounded-l-lg transition-colors`} onClick={() => setViewMode('grid')} aria-label="Grid view">
              <GridIcon size={16} />
            </button>
            <button className={`p-2.5 ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:text-gray-700'} rounded-r-lg transition-colors`} onClick={() => setViewMode('table')} aria-label="Table view">
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
    {filteredSubscriptions.length > 0 ? viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredSubscriptions.map(subscription => {
        const status = getSubscriptionStatus(subscription);
        const daysLeft = getDaysUntil(subscription.nextBillingDate);
        return <div key={subscription.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={() => handleViewSubscription(subscription.id)}>
          <div className="p-5">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                <img src={subscription.logo} alt={subscription.name} className="w-10 h-10 object-contain" onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${subscription.name}&background=random&color=fff&size=128`;
                }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {subscription.name}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.bgColor} ${status.textColor}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {subscription.category}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  ${subscription.price.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">
                  per {subscription.billingCycle.replace('ly', '')}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col">
                <div className="flex items-center text-gray-500">
                  <CalendarIcon size={14} className="mr-1.5" />
                  <span>
                    Next: {formatDate(subscription.nextBillingDate)}
                  </span>
                </div>
                {daysLeft > 0 && status.label !== 'Cancelled' && <div className="flex items-center text-gray-500 mt-1">
                  <ClockIcon size={14} className="mr-1.5" />
                  <span className={`${daysLeft <= 3 ? 'text-red-600 font-medium' : daysLeft <= 7 ? 'text-amber-600 font-medium' : ''}`}>
                    {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                  </span>
                </div>}
              </div>
              <div className="flex space-x-2">
                <button onClick={e => {
                  e.stopPropagation();
                  handleEdit(subscription.id);
                }} className="p-1 text-gray-500 hover:text-blue-600 transition-colors" aria-label="Edit subscription">
                  <EditIcon size={16} />
                </button>
                <button onClick={e => {
                  e.stopPropagation();
                  handleDelete(subscription.id);
                }} className="p-1 text-gray-500 hover:text-red-600 transition-colors" aria-label="Delete subscription">
                  <Trash2Icon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>;
      })}
    </div> : <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
              <div className="flex items-center">
                Subscription
                {sortBy === 'name' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell" onClick={() => handleSort('category')}>
              <div className="flex items-center">
                Category
                {sortBy === 'category' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
              <div className="flex items-center">
                Price
                {sortBy === 'price' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell" onClick={() => handleSort('date')}>
              <div className="flex items-center">
                Next Billing
                {sortBy === 'date' && (sortDirection === 'asc' ? <ArrowUpIcon size={14} className="ml-1" /> : <ArrowDownIcon size={14} className="ml-1" />)}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredSubscriptions.map(subscription => {
            const status = getSubscriptionStatus(subscription);
            const daysLeft = getDaysUntil(subscription.nextBillingDate);
            return <tr key={subscription.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewSubscription(subscription.id)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={subscription.logo} alt={subscription.name} className="h-8 w-8 object-contain" onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${subscription.name}&background=random&color=fff&size=128`;
                    }} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {subscription.name}
                    </div>
                    <div className="text-sm text-gray-500 md:hidden">
                      {subscription.category}
                    </div>
                    <div className="text-sm text-gray-500 hidden md:block">
                      Started {formatDate(subscription.startDate)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {subscription.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(subscription.price, subscription.billingCycle)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                <div className="flex flex-col">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center w-fit ${status.bgColor} ${status.textColor}`}>
                    {status.label}
                  </span>
                  {daysLeft > 0 && status.label !== 'Cancelled' && <span className="text-xs text-gray-500 mt-1">
                    {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                  </span>}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm text-gray-900">
                  {formatDate(subscription.nextBillingDate)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end space-x-3">
                  <button onClick={e => {
                    e.stopPropagation();
                    handleEdit(subscription.id);
                  }} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" aria-label="Edit subscription">
                    <EditIcon size={16} />
                  </button>
                  <button onClick={e => {
                    e.stopPropagation();
                    handleDelete(subscription.id);
                  }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" aria-label="Delete subscription">
                    <Trash2Icon size={16} />
                  </button>
                </div>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div> : <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
        <SearchIcon size={24} />
      </div>
      <p className="text-gray-600 font-medium">No subscriptions found</p>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        Try adjusting your search or filters
      </p>
      <button onClick={() => {
        setSearchTerm('');
        setSelectedCategory('');
      }} className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
        Clear filters
      </button>
    </div>}
    {showForm && <SubscriptionForm subscription={editingSubscription} onSubmit={handleAddEdit} onCancel={() => {
      setShowForm(false);
      setEditingSubscription(undefined);
    }} />}
  </div>;
};
export default Subscriptions;