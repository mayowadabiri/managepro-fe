export interface Subscription {
  id: string;
  name: string;
  logo: string;
  price: number;
  billingCycle: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string;
  nextBillingDate: string;
  startDate: string;
  status?: 'active' | 'about to expire' | 'expired' | 'cancelled';
}
export const subscriptions: Subscription[] = [{
  id: '1',
  name: 'Netflix',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png',
  price: 15.99,
  billingCycle: 'monthly',
  category: 'Entertainment',
  nextBillingDate: '2023-10-15',
  startDate: '2022-03-10'
}, {
  id: '2',
  name: 'Spotify',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1920px-Spotify_logo_with_text.svg.png',
  price: 9.99,
  billingCycle: 'monthly',
  category: 'Music',
  nextBillingDate: '2023-10-20',
  startDate: '2021-11-05'
}, {
  id: '3',
  name: 'Adobe Creative Cloud',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg/1024px-Adobe_Creative_Cloud_rainbow_icon.svg.png',
  price: 52.99,
  billingCycle: 'monthly',
  category: 'Productivity',
  nextBillingDate: '2023-10-05',
  startDate: '2022-01-15'
}, {
  id: '4',
  name: 'Amazon Prime',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amazon_Prime_Logo.svg/1920px-Amazon_Prime_Logo.svg.png',
  price: 139,
  billingCycle: 'yearly',
  category: 'Shopping',
  nextBillingDate: '2024-02-15',
  startDate: '2020-02-15'
}, {
  id: '5',
  name: 'Microsoft 365',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/1200px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png',
  price: 99.99,
  billingCycle: 'yearly',
  category: 'Productivity',
  nextBillingDate: '2024-01-10',
  startDate: '2022-01-10',
  status: 'cancelled'
}];
export const categories = ['Entertainment', 'Music', 'Productivity', 'Shopping', 'Utilities', 'Gaming', 'Health & Fitness', 'News & Magazines', 'Cloud Storage', 'Other'];