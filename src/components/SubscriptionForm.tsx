import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { XIcon, UploadIcon, PlusIcon, CheckIcon, XCircleIcon, ChevronDownIcon, CalendarIcon } from 'lucide-react';
import { Subscription, categories } from '../utils/mockData';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Common subscription services with their logos and categories
const predefinedServices = [{
  name: 'Netflix',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png',
  category: 'Entertainment'
}, {
  name: 'Spotify',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1920px-Spotify_logo_with_text.svg.png',
  category: 'Music'
}, {
  name: 'Amazon Prime',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amazon_Prime_Logo.svg/1920px-Amazon_Prime_Logo.svg.png',
  category: 'Shopping'
}, {
  name: 'Disney+',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/1280px-Disney%2B_logo.svg.png',
  category: 'Entertainment'
}, {
  name: 'YouTube Premium',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/YouTube_Premium_logo.svg/1280px-YouTube_Premium_logo.svg.png',
  category: 'Entertainment'
}, {
  name: 'Microsoft 365',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/1200px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png',
  category: 'Productivity'
}, {
  name: 'Adobe Creative Cloud',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg/1024px-Adobe_Creative_Cloud_rainbow_icon.svg.png',
  category: 'Productivity'
}, {
  name: 'Apple Music',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Apple_Music_logo.svg/2560px-Apple_Music_logo.svg.png',
  category: 'Music'
}, {
  name: 'Hulu',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Hulu_Logo.svg/1280px-Hulu_Logo.svg.png',
  category: 'Entertainment'
}, {
  name: 'HBO Max',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/1200px-HBO_Max_Logo.svg.png',
  category: 'Entertainment'
}];
interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (subscription: Omit<Subscription, 'id'> & {
    id?: string;
  }) => void;
  onCancel: () => void;
}
const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  subscription,
  onSubmit,
  onCancel
}) => {
  // Main form state
  const [form, setForm] = useState({
    name: '',
    logo: '',
    price: '',
    billingCycle: 'monthly',
    categories: [] as string[],
    nextBillingDate: '',
    startDate: '',
    hasFreeTrialPeriod: false,
    trialStartDate: '',
    trialEndDate: ''
  });
  // UI state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [customService, setCustomService] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  // Date state for the datepicker
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [nextBillingDate, setNextBillingDate] = useState<Date | null>(null);
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  // Refs for handling outside clicks
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  // Filter predefined services based on search term
  const filteredServices = predefinedServices.filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()));
  useEffect(() => {
    if (subscription) {
      setForm({
        name: subscription.name,
        logo: subscription.logo,
        price: subscription.price.toString(),
        billingCycle: subscription.billingCycle,
        categories: [subscription.category],
        nextBillingDate: subscription.nextBillingDate,
        startDate: subscription.startDate,
        hasFreeTrialPeriod: false,
        trialStartDate: '',
        trialEndDate: ''
      });
      setLogoPreview(subscription.logo);
      setSelectedCategories([subscription.category]);
      // Set date picker values
      setStartDate(subscription.startDate ? new Date(subscription.startDate) : null);
      setNextBillingDate(subscription.nextBillingDate ? new Date(subscription.nextBillingDate) : null);
      // Check if the subscription name is in predefined services
      const isPredefined = predefinedServices.some(service => service.name === subscription.name);
      setCustomService(!isPredefined);
    }
  }, [subscription]);
  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Handle date changes
  useEffect(() => {
    if (startDate) {
      setForm(prev => ({
        ...prev,
        startDate: startDate.toISOString().split('T')[0]
      }));
    }
    if (nextBillingDate) {
      setForm(prev => ({
        ...prev,
        nextBillingDate: nextBillingDate.toISOString().split('T')[0]
      }));
    }
    if (trialStartDate) {
      setForm(prev => ({
        ...prev,
        trialStartDate: trialStartDate.toISOString().split('T')[0]
      }));
    }
    if (trialEndDate) {
      setForm(prev => ({
        ...prev,
        trialEndDate: trialEndDate.toISOString().split('T')[0]
      }));
    }
  }, [startDate, nextBillingDate, trialStartDate, trialEndDate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setForm(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleServiceSelect = (service: (typeof predefinedServices)[0]) => {
    setForm(prev => ({
      ...prev,
      name: service.name,
      logo: service.logo,
      categories: [service.category]
    }));
    setLogoPreview(service.logo);
    setSelectedCategories([service.category]);
    setSearchTerm(service.name);
    setShowDropdown(false);
    setCustomService(false);
  };
  const handleCustomServiceToggle = () => {
    setCustomService(true);
    setSearchTerm('');
    setShowDropdown(false);
  };
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the uploaded file
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      // In a real app, you would upload this file to a server and get a URL
      // For this demo, we'll just use the preview URL
      setForm(prev => ({
        ...prev,
        logo: previewUrl
      }));
    }
  };
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category];
      setForm(prevForm => ({
        ...prevForm,
        categories: newCategories
      }));
      return newCategories;
    });
  };
  const handleCloseCategoryDropdown = () => {
    setShowCategoryDropdown(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Format the data for submission
    const submissionData = {
      name: form.name,
      logo: form.logo,
      price: parseFloat(form.price),
      billingCycle: form.billingCycle as 'monthly' | 'yearly' | 'quarterly' | 'weekly',
      category: form.categories[0] || 'Other',
      nextBillingDate: form.hasFreeTrialPeriod && form.trialEndDate ? form.trialEndDate : form.nextBillingDate,
      startDate: form.hasFreeTrialPeriod && form.trialStartDate ? form.trialStartDate : form.startDate
      // Additional fields could be added to the Subscription type in a real app
    };
    if (subscription) {
      onSubmit({
        ...submissionData,
        id: subscription.id
      });
    } else {
      onSubmit(submissionData);
    }
  };
  // Custom date picker input component
  const CustomDateInput = forwardRef<HTMLDivElement, {
    value?: string;
    onClick?: () => void;
    placeholder: string;
    disabled?: boolean;
  }>(({
    value,
    onClick,
    placeholder,
    disabled
  }, ref) => <div className={`appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg text-sm ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'} flex items-center focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all`} onClick={disabled ? undefined : onClick} ref={ref}>
      <CalendarIcon size={18} className="text-gray-400 mr-2 flex-shrink-0" />
      <div className={`flex-1 ${value ? 'text-gray-900' : 'text-gray-400'} ${disabled ? 'opacity-60' : ''}`}>
        {value || placeholder}
      </div>
    </div>);
  return <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            {subscription ? 'Edit Subscription' : 'Add New Subscription'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-2 transition-colors" aria-label="Close">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Selection Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subscription Service
              </label>
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 overflow-hidden" onClick={() => setShowDropdown(true)}>
                  {logoPreview && !customService && <div className="h-10 w-10 flex-shrink-0 bg-gray-100 p-1">
                      <img src={logoPreview} alt="Logo" className="h-full w-full object-contain" onError={() => setLogoPreview(null)} />
                    </div>}
                  <input type="text" value={searchTerm} onChange={e => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                  if (e.target.value.trim() !== '') {
                    const matchedService = predefinedServices.find(service => service.name.toLowerCase() === e.target.value.toLowerCase());
                    if (matchedService) {
                      handleServiceSelect(matchedService);
                    } else {
                      setCustomService(true);
                      setForm(prev => ({
                        ...prev,
                        name: e.target.value
                      }));
                    }
                  }
                }} placeholder="Search or enter subscription name..." className={`w-full py-2.5 ${logoPreview && !customService ? 'pl-3' : 'pl-4'} pr-4 focus:outline-none text-gray-900`} />
                </div>
                {showDropdown && <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b border-gray-100">
                      <button type="button" onClick={handleCustomServiceToggle} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center text-indigo-600 font-medium">
                        <PlusIcon size={16} className="mr-2" />
                        Add custom subscription
                      </button>
                    </div>
                    <ul>
                      {filteredServices.length > 0 ? filteredServices.map(service => <li key={service.name} className="px-2">
                            <button type="button" onClick={() => handleServiceSelect(service)} className="w-full text-left px-2 py-2 flex items-center space-x-3 rounded-md hover:bg-gray-50">
                              <div className="h-8 w-8 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden p-1">
                                <img src={service.logo} alt={service.name} className="h-full w-full object-contain" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {service.name}
                              </span>
                            </button>
                          </li>) : <li className="px-4 py-3 text-sm text-gray-500">
                          No services found. Use "Add custom subscription"
                          option.
                        </li>}
                    </ul>
                  </div>}
              </div>
              {customService && <p className="mt-1 text-xs text-gray-500">
                  You're adding a custom subscription service.
                </p>}
            </div>
            {/* Logo Upload - Only show if custom service is selected */}
            {customService && <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                    {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" onError={() => setLogoPreview(null)} /> : <UploadIcon size={24} className="text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="logo-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                      <UploadIcon size={16} className="mr-2" />
                      Upload Logo
                    </label>
                    <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="sr-only" />
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended: Square image, 512×512px
                    </p>
                  </div>
                </div>
              </div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount and Billing Cycle */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input type="number" id="price" name="price" value={form.price} onChange={handleChange} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 py-2.5 sm:text-sm border-gray-300 rounded-md border" placeholder="0.00" min="0" step="0.01" required />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 mb-1">
                Billing Cycle
              </label>
              <select id="billingCycle" name="billingCycle" value={form.billingCycle} onChange={handleChange} className="mt-1 block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          {/* Categories - Multi-select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <div className="relative" ref={categoryDropdownRef}>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 cursor-pointer" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                {selectedCategories.length > 0 ? selectedCategories.map(category => <div key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {category}
                      <button type="button" onClick={e => {
                  e.stopPropagation();
                  handleCategoryToggle(category);
                }} className="ml-1 text-indigo-500 hover:text-indigo-700 focus:outline-none">
                        <XIcon size={14} />
                      </button>
                    </div>) : <span className="text-gray-500 text-sm">
                    Select categories...
                  </span>}
                <div className="ml-auto flex items-center">
                  <ChevronDownIcon size={16} className={`text-gray-400 transition-transform ${showCategoryDropdown ? 'transform rotate-180' : ''}`} />
                </div>
              </div>
              {showCategoryDropdown && <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {categories.map(category => <li key={category}>
                        <button type="button" onClick={() => handleCategoryToggle(category)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between">
                          <span>{category}</span>
                          {selectedCategories.includes(category) && <CheckIcon size={16} className="text-indigo-600" />}
                        </button>
                      </li>)}
                  </ul>
                  <div className="p-2 border-t border-gray-100">
                    <button type="button" onClick={handleCloseCategoryDropdown} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors">
                      Done
                    </button>
                  </div>
                </div>}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Select all categories that apply to this subscription
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} customInput={<CustomDateInput placeholder="Select start date..." disabled={form.hasFreeTrialPeriod} />} dateFormat="MMMM d, yyyy" required={!form.hasFreeTrialPeriod} disabled={form.hasFreeTrialPeriod} wrapperClassName="w-full" popperClassName="react-datepicker-right" />
            </div>
            {/* Next Billing Date */}
            <div>
              <label htmlFor="nextBillingDate" className="block text-sm font-medium text-gray-700 mb-1">
                Next Billing Date
              </label>
              <DatePicker selected={nextBillingDate} onChange={date => setNextBillingDate(date)} customInput={<CustomDateInput placeholder="Select next billing date..." disabled={form.hasFreeTrialPeriod} />} dateFormat="MMMM d, yyyy" required={!form.hasFreeTrialPeriod} disabled={form.hasFreeTrialPeriod} wrapperClassName="w-full" minDate={new Date()} />
            </div>
          </div>
          {/* Free Trial Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input id="hasFreeTrialPeriod" name="hasFreeTrialPeriod" type="checkbox" checked={form.hasFreeTrialPeriod} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="hasFreeTrialPeriod" className="ml-2 block text-sm font-medium text-gray-700">
                This subscription has a free trial period
              </label>
            </div>
            {form.hasFreeTrialPeriod && <div className="pl-6 border-l-2 border-indigo-100 space-y-4">
                <p className="text-sm text-gray-500">
                  Enter the trial period details. The next billing date will be
                  automatically set to the trial end date.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="trialStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Trial Start Date
                    </label>
                    <DatePicker selected={trialStartDate} onChange={date => setTrialStartDate(date)} customInput={<CustomDateInput placeholder="Select trial start date..." />} dateFormat="MMMM d, yyyy" required={form.hasFreeTrialPeriod} wrapperClassName="w-full" />
                  </div>
                  <div>
                    <label htmlFor="trialEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Trial End Date
                    </label>
                    <DatePicker selected={trialEndDate} onChange={date => setTrialEndDate(date)} customInput={<CustomDateInput placeholder="Select trial end date..." />} dateFormat="MMMM d, yyyy" required={form.hasFreeTrialPeriod} wrapperClassName="w-full" minDate={trialStartDate || new Date()} />
                  </div>
                </div>
              </div>}
          </div>
          <div className="pt-4 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 order-2 sm:order-1">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 order-1 sm:order-2">
              {subscription ? 'Update' : 'Add'} Subscription
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default SubscriptionForm;