'use client';

import { useState, useEffect } from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { LANGUAGES, SUBSCRIPTION_TIERS } from '@/lib/constants';
import { getInitials } from '@/lib/utils';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useGetMeQuery, useUpdateProfileMutation } from '@/store/userApi';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/store/authSlice';

const LEVELS = [
  { id: 'primary', label: 'Primary', grades: '1-5', icon: '⭐', defaultLevel: 1 },
  { id: 'secondary', label: 'Secondary', grades: '6-10', icon: '🚀', defaultLevel: 6 },
  { id: 'college', label: 'College', grades: '11+', icon: '🎓', defaultLevel: 11 },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();

  // Fetch user data from API
  const { data: userData, isLoading } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Get user from API or fallback to Redux state
  const reduxUser = useSelector((state) => state.auth.user);
  const user = userData?.data || reduxUser;

  // Local form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
    marketing: false,
  });
  const [selectedLevel, setSelectedLevel] = useState(null);

  // Initialize form state when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
      setLanguage(user.languagePreference || 'en');
      setNotifications(user.notificationSettings || {
        email: true,
        push: true,
        reminders: true,
        marketing: false,
      });
      setSelectedLevel(LEVELS.find(l => l.id === user.learnLevel) || null);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const response = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      }).unwrap();
      if (response.success) {
        dispatch(setUser(response.data));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleSaveLevel = async () => {
    if (!selectedLevel) return;
    try {
      const response = await updateProfile({
        learnLevel: selectedLevel.id,
        level: selectedLevel.defaultLevel,
      }).unwrap();
      if (response.success) {
        dispatch(setUser(response.data));
      }
    } catch (error) {
      console.error('Failed to update learning level:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'subscription', label: 'Subscription', icon: '💎' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground-secondary">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">
          Settings ⚙️
        </h1>
        <p className="text-foreground-secondary">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <Card className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl">
                      {getInitials(user?.firstName, user?.lastName)}
                    </div>
                    <div>
                      <Button variant="secondary" size="sm">Upload Photo</Button>
                      <p className="text-xs text-foreground-secondary mt-2">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="md:col-span-2"
                    />
                  </div>

                  <Button onClick={handleSaveProfile} loading={isUpdating}>
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Level</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground-secondary">
                    Your learning level is determined by your performance and cannot be changed manually.
                  </p>
                  <div className="grid gap-3">
                    {LEVELS.map((level) => (
                      <div
                        key={level.id}
                        className={`p-4 rounded-xl border-2 ${user?.learnLevel === level.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                          : 'border-[var(--card-border)] opacity-50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{level.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold">{level.label}</p>
                            <p className="text-sm text-foreground-secondary">
                              Grades {level.grades}
                            </p>
                          </div>
                          {user?.learnLevel === level.id && (
                            <Badge variant="primary">Current</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'preferences' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Language</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${language === lang.code
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                          : 'border-[var(--card-border)] hover:border-primary-300'
                          }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <p className="font-medium mt-2">{lang.label}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: 'Light', icon: '☀️' },
                      { value: 'dark', label: 'Dark', icon: '🌙' },
                      { value: 'system', label: 'System', icon: '💻' },
                    ].map((themeOption) => (
                      <button
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${theme === themeOption.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                          : 'border-[var(--card-border)] hover:border-primary-300'
                          }`}
                      >
                        <span className="text-2xl">{themeOption.icon}</span>
                        <p className="font-medium mt-2">{themeOption.label}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'subscription' && (
            <>
              <Card className="border-primary-500">
                <CardContent className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl">
                      💎
                    </div>
                    <div className="flex-1">
                      <Badge variant="primary">Current Plan</Badge>
                      <h3 className="text-xl font-bold mt-1">Premium</h3>
                      <p className="text-foreground-secondary text-sm">$9/month</p>
                    </div>
                    <Button variant="secondary">Manage</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {Object.values(SUBSCRIPTION_TIERS).map((tier) => (
                  <Card
                    key={tier.id}
                    className={tier.id === 'premium' ? 'border-primary-500 ring-2 ring-primary-200' : ''}
                  >
                    <CardContent className="py-6">
                      <h3 className="text-xl font-bold">{tier.name}</h3>
                      <div className="mt-2 mb-4">
                        <span className="text-3xl font-bold">${tier.price}</span>
                        {tier.price > 0 && <span className="text-foreground-secondary">/month</span>}
                      </div>
                      <ul className="space-y-2 mb-6">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <span className="text-green-500">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={tier.id === 'premium' ? 'primary' : 'secondary'}
                        className="w-full"
                      >
                        {tier.id === 'premium' ? 'Current Plan' : 'Upgrade'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Get notified on your device' },
                  { key: 'reminders', label: 'Study Reminders', desc: 'Daily reminders to practice' },
                  { key: 'marketing', label: 'Marketing', desc: 'News and promotional offers' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-foreground-secondary">{item.desc}</p>
                    </div>
                    <button
                      onClick={async () => {
                        const newSettings = {
                          ...notifications,
                          [item.key]: !notifications[item.key],
                        };
                        setNotifications(newSettings);
                        try {
                          const response = await updateProfile({
                            notificationSettings: newSettings,
                          }).unwrap();
                          if (response.success) {
                            dispatch(setUser(response.data));
                          }
                        } catch (error) {
                          console.error('Failed to update notifications:', error);
                          // Revert on error
                          setNotifications(notifications);
                        }
                      }}
                      disabled={isUpdating}
                      className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.key] ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-600'
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[item.key] ? 'translate-x-7' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
