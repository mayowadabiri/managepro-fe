import React, { useEffect, useState, useRef } from 'react';
import { UserIcon, BellIcon, DollarSignIcon, DatabaseIcon, SaveIcon, SunIcon, MoonIcon, CameraIcon, TrashIcon, CheckIcon, LockIcon, PhoneIcon, EyeIcon, EyeOffIcon, FileTextIcon, FileSpreadsheetIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const Settings = () => {
  const {
    user
  } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: user ? `${user.firstName} ${user.lastName}` : 'John Doe',
      firstName: user?.firstName || 'John',
      lastName: user?.lastName || 'Doe',
      email: user?.email || 'john.doe@example.com',
      phoneNumber: user?.phoneNumber || '+1 (555) 123-4567',
      profilePicture: user?.profilePicture || ''
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    notifications: {
      email: true,
      push: true,
      renewalReminders: 3 // days before
    },
    preferences: {
      currency: 'USD',
      theme: 'light'
    },
    data: {
      exportData: false,
      deleteAccount: false
    }
  });
  // Apply dark mode to body based on theme preference
  useEffect(() => {
    if (settings.preferences.theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [settings.preferences.theme]);
  const [previewImage, setPreviewImage] = useState<string | null>(settings.profile.profilePicture || null);
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value
      }
    }));
  };
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [name]: value
      }
    }));
  };
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: type === 'checkbox' ? newValue : parseInt(value as string) || value
      }
    }));
  };
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value
      }
    }));
  };
  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme
      }
    }));
  };
  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setSettings(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            profilePicture: result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveProfilePicture = () => {
    setPreviewImage(null);
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        profilePicture: ''
      }
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the settings to a backend
    alert('Settings saved successfully!');
  };
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (settings.security.newPassword !== settings.security.confirmPassword) {
      alert('New password and confirmation do not match!');
      return;
    }
    if (settings.security.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    // Here you would typically call an API to change the password
    alert('Password changed successfully!');
    // Reset the form
    setSettings(prev => ({
      ...prev,
      security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }));
  };
  // Function to get user initials for avatar
  const getUserInitials = () => {
    const {
      firstName,
      lastName
    } = settings.profile;
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  // Determine if we're in dark mode
  const isDarkMode = settings.preferences.theme === 'dark';
  return <div className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-200`}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage your account settings and preferences
          </p>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden shadow-lg transition-colors duration-200`}>
          <div className="flex flex-col md:flex-row">
            {/* Settings sidebar */}
            <div className={`w-full md:w-72 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b md:border-b-0 md:border-r`}>
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700' : isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <UserIcon className="mr-3" size={18} />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('security')} className={`w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700' : isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <LockIcon className="mr-3" size={18} />
                      Security
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'notifications' ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700' : isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <BellIcon className="mr-3" size={18} />
                      Notifications
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('preferences')} className={`w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'preferences' ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700' : isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <DollarSignIcon className="mr-3" size={18} />
                      Preferences
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setActiveTab('data')} className={`w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'data' ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700' : isDarkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <DatabaseIcon className="mr-3" size={18} />
                      Data Management
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            {/* Settings content */}
            <div className="flex-1 p-6 md:p-8">
              {/* Profile Settings */}
              {activeTab === 'profile' && <div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                    Profile Settings
                  </h2>
                  {/* Profile Picture Section */}
                  <div className="mb-8">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                      Profile Picture
                    </label>
                    <div className="flex items-start space-x-6">
                      <div className="relative group">
                        {previewImage ? <img src={previewImage} alt="Profile" className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 shadow-md" /> : <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-medium shadow-md">
                            {getUserInitials()}
                          </div>}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all cursor-pointer" onClick={handleProfilePictureClick}>
                          <CameraIcon size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      </div>
                      <div className="space-y-2">
                        <button type="button" onClick={handleProfilePictureClick} className={`px-4 py-2 border rounded-lg shadow-sm text-sm font-medium transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}>
                          <CameraIcon size={16} className="inline-block mr-2" />
                          Change Photo
                        </button>
                        {previewImage && <button type="button" onClick={handleRemoveProfilePicture} className={`px-4 py-2 border rounded-lg shadow-sm text-sm font-medium transition-colors ${isDarkMode ? 'border-gray-600 text-red-400 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-red-600 bg-white hover:bg-red-50'}`}>
                            <TrashIcon size={16} className="inline-block mr-2" />
                            Remove
                          </button>}
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          Recommended: Square JPG, PNG. Max 5MB.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        First Name
                      </label>
                      <input type="text" id="firstName" name="firstName" value={settings.profile.firstName} onChange={handleProfileChange} className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`} />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Last Name
                      </label>
                      <input type="text" id="lastName" name="lastName" value={settings.profile.lastName} onChange={handleProfileChange} className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`} />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="phoneNumber" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input type="tel" id="phoneNumber" name="phoneNumber" value={settings.profile.phoneNumber} onChange={handleProfileChange} className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900'}`} placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Email Address
                    </label>
                    <input type="email" id="email" name="email" value={settings.profile.email} readOnly className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none transition-colors cursor-not-allowed ${isDarkMode ? 'border-gray-600 bg-gray-700/50 text-gray-400' : 'border-gray-300 bg-gray-100 text-gray-600'}`} />
                    <p className={`mt-1.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Email address cannot be changed. Contact support for
                      assistance.
                    </p>
                  </div>
                </div>}
              {/* Security Settings */}
              {activeTab === 'security' && <div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                    Security Settings
                  </h2>
                  <div className={`p-6 rounded-xl mb-8 ${isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-blue-50 border border-blue-100'}`}>
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-2`}>
                      Change Your Password
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                      Ensure your account stays secure by using a strong, unique
                      password that you don't use for other accounts.
                    </p>
                    <form onSubmit={handleChangePassword} className="space-y-5">
                      <div>
                        <label htmlFor="currentPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Current Password
                        </label>
                        <div className="relative">
                          <input type={showCurrentPassword ? 'text' : 'password'} id="currentPassword" name="currentPassword" value={settings.security.currentPassword} onChange={handleSecurityChange} className={`w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} required />
                          <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                            {showCurrentPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="newPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          New Password
                        </label>
                        <div className="relative">
                          <input type={showNewPassword ? 'text' : 'password'} id="newPassword" name="newPassword" value={settings.security.newPassword} onChange={handleSecurityChange} className={`w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} required minLength={8} />
                          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                            {showNewPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                        <p className={`mt-1.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Password must be at least 8 characters long.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={settings.security.confirmPassword} onChange={handleSecurityChange} className={`w-full px-4 py-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} required />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                            {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button type="submit" className={`px-5 py-2.5 rounded-lg shadow-sm text-sm font-medium transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-yellow-50 border border-yellow-100'}`}>
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'} mb-2`}>
                      Two-Factor Authentication
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                      Add an extra layer of security to your account by enabling
                      two-factor authentication.
                    </p>
                    <button type="button" className={`px-5 py-2.5 rounded-lg shadow-sm text-sm font-medium transition-colors ${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}>
                      Enable 2FA
                    </button>
                  </div>
                </div>}
              {/* Notification Settings */}
              {activeTab === 'notifications' && <div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                    Notification Settings
                  </h2>
                  <div className="space-y-6">
                    <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                            Email Notifications
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            Receive subscription updates via email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="email" checked={settings.notifications.email} onChange={handleNotificationChange} className="sr-only peer" />
                          <div className={`w-11 h-6 rounded-full peer ${isDarkMode ? 'bg-gray-600 peer-focus:ring-blue-800' : 'bg-gray-200 peer-focus:ring-blue-300'} peer-focus:outline-none peer-focus:ring-4 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                        </label>
                      </div>
                    </div>
                    <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                            Push Notifications
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            Receive alerts on your device
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="push" checked={settings.notifications.push} onChange={handleNotificationChange} className="sr-only peer" />
                          <div className={`w-11 h-6 rounded-full peer ${isDarkMode ? 'bg-gray-600 peer-focus:ring-blue-800' : 'bg-gray-200 peer-focus:ring-blue-300'} peer-focus:outline-none peer-focus:ring-4 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="renewalReminders" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Renewal Reminders
                      </label>
                      <select id="renewalReminders" name="renewalReminders" value={settings.notifications.renewalReminders} onChange={handleNotificationChange} className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}>
                        <option value={3}>3 days before</option>
                        <option value={7}>7 days before</option>
                        <option value={14}>14 days before</option>
                      </select>
                    </div>
                  </div>
                </div>}
              {/* Preferences Settings */}
              {activeTab === 'preferences' && <div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                    Preferences
                  </h2>
                  <div className="space-y-8">
                    <div>
                      <label htmlFor="currency" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Currency
                      </label>
                      <select id="currency" name="currency" value={settings.preferences.currency} onChange={handlePreferenceChange} className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="AUD">AUD (A$)</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                        Theme
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => handleThemeChange('light')} className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${settings.preferences.theme === 'light' ? isDarkMode ? 'border-blue-500 bg-blue-900/20 ring-2 ring-blue-500 ring-opacity-50' : 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50' : isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className={`w-20 h-20 rounded-xl mb-4 flex items-center justify-center ${isDarkMode ? 'bg-gray-100 border border-gray-300' : 'bg-white border border-gray-200'}`}>
                            <SunIcon size={32} className={settings.preferences.theme === 'light' ? 'text-blue-600' : 'text-gray-400'} />
                          </div>
                          <span className={`text-sm font-medium ${settings.preferences.theme === 'light' ? isDarkMode ? 'text-blue-400' : 'text-blue-700' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Light Mode
                          </span>
                          {settings.preferences.theme === 'light' && <div className={`mt-2 flex items-center text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              <CheckIcon size={14} className="mr-1" />
                              Selected
                            </div>}
                        </button>
                        <button type="button" onClick={() => handleThemeChange('dark')} className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${settings.preferences.theme === 'dark' ? isDarkMode ? 'border-blue-500 bg-blue-900/20 ring-2 ring-blue-500 ring-opacity-50' : 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50' : isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className={`w-20 h-20 rounded-xl mb-4 flex items-center justify-center ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-800 border border-gray-700'}`}>
                            <MoonIcon size={32} className={settings.preferences.theme === 'dark' ? 'text-blue-400' : 'text-gray-500'} />
                          </div>
                          <span className={`text-sm font-medium ${settings.preferences.theme === 'dark' ? isDarkMode ? 'text-blue-400' : 'text-blue-700' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Dark Mode
                          </span>
                          {settings.preferences.theme === 'dark' && <div className={`mt-2 flex items-center text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              <CheckIcon size={14} className="mr-1" />
                              Selected
                            </div>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>}
              {/* Data Management Settings */}
              {activeTab === 'data' && <div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                    Data Management
                  </h2>
                  <div className="space-y-8">
                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
                      <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'} mb-2`}>
                        Export Your Data
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                        Download all your subscription data in your preferred
                        format
                      </p>
                      <div className="flex space-x-3">
                        <button type="button" className={`px-4 py-2.5 border rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center ${isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}>
                          <FileTextIcon size={16} className="mr-2" />
                          Export as CSV
                        </button>
                        <button type="button" className={`px-4 py-2.5 border rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center ${isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}>
                          <FileSpreadsheetIcon size={16} className="mr-2" />
                          Export as Excel
                        </button>
                      </div>
                    </div>
                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-red-900/20 border border-red-800/30' : 'bg-red-50 border border-red-200'}`}>
                      <h3 className={`text-lg font-medium ${isDarkMode ? 'text-red-400' : 'text-red-700'} mb-2`}>
                        Delete Account
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-red-600'} mb-4`}>
                        Once you delete your account, there is no going back.
                        All your data will be permanently removed.
                      </p>
                      <button type="button" className={`px-5 py-2.5 border rounded-lg shadow-sm text-sm font-medium transition-colors ${isDarkMode ? 'bg-red-700 hover:bg-red-800 text-white border-transparent' : 'bg-red-600 hover:bg-red-700 text-white border-transparent'}`}>
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>}
              {/* Save Button */}
              {activeTab !== 'security' && <div className={`mt-8 pt-5 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                  <button type="submit" onClick={handleSaveSettings} className={`px-6 py-2.5 rounded-lg shadow-sm text-sm font-medium transition-colors flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                    <SaveIcon size={16} className="mr-2" />
                    Save Settings
                  </button>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Settings;