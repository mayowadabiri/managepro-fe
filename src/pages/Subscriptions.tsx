// pages/Subscriptions.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Plus as PlusIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Grid as GridIcon,
  List as ListIcon,
  Sliders as SlidersIcon,

} from 'lucide-react';

import SubscriptionCard from '../components/SubscriptionCard';
import SubscriptionTable from '../components/SubscriptionTable';
import SubscriptionForm from '../components/SubscriptionForm';

import { type Subscription } from '../types';
import type { SortingState } from '@tanstack/react-table';
import { useGetUserSubscriptions } from '@/api/subscriptions';
import { categories } from '@/utils/mockData';

export default function SubscriptionsPage() {

  const navigate = useNavigate();
  // local UI-only state
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data: userSubscriptions, isLoading } = useGetUserSubscriptions({
    service_name: searchTerm || undefined,
    category: selectedCategory ? parseInt(selectedCategory) : undefined,
  });

  const handleAddEdit = (subscription: Omit<Subscription, 'id'> & { id?: number }) => {
    // In your real app, post/patch to API and refetch. Here we simply close form.
    setShowForm(false);
    setEditingSubscription(undefined);
    // Optionally: implement optimistic update local state
  };

  const handleEdit = (id: number) => {
    const sub = userSubscriptions?.data?.find(s => s.id === id);
    if (sub) {
      setEditingSubscription(sub);
      setShowForm(true);
    }
  };

  const handleDelete = (id: number) => {
    // Do API delete + refetch. For now just a console log.
    console.log('delete', id);
  };

  const handleViewSubscription = (id: number) => {
    navigate({ to: `/subscriptions/${id}` });
  };


  const filteredSubscriptions = useMemo(() => {
    if (!userSubscriptions) return [];
    return userSubscriptions.data
  }, [userSubscriptions]);



  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-500 mt-1">Manage all your recurring payments</p>
        </div>

        <button onClick={() => { setEditingSubscription(undefined); setShowForm(true); }} className="flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
          <PlusIcon size={16} className="mr-2" />
          Add Subscription
        </button>
      </div>

      {/* Mobile filters */}
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

        {showFilters && (
          <div className="mt-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="border border-gray-200 rounded-lg text-sm py-2.5 px-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">View</label>
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
          </div>
        )}
      </div>

      {/* Desktop filters */}
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
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

      {/* Content */}
      {isLoading ? (
        <div className="p-8 text-center">Loading subscriptions…</div>
      ) : (filteredSubscriptions.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubscriptions.map(sub => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClick={handleViewSubscription}
              />
            ))}
          </div>
        ) : (
          <SubscriptionTable
            data={filteredSubscriptions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRowClick={handleViewSubscription}
            sorting={sorting}
            setSorting={setSorting}
          />
        )
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
            <SearchIcon size={24} />
          </div>
          <p className="text-gray-600 font-medium">No subscriptions found</p>
          <p className="text-sm text-gray-500 mt-1 mb-4">Try adjusting your search or filters</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); }} className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">Clear filters</button>
        </div>
      ))}

      {/* {showForm && <SubscriptionForm subscription={editingSubscription} onSubmit={handleAddEdit} onCancel={() => { setShowForm(false); setEditingSubscription(undefined); }} />} */}
    </div>
  );
}
