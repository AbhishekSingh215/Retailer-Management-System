import { 
  Database, 
  ShoppingCart, 
  Percent, 
  Hash, 
  BadgePercent
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  description: string;
  keywords: string[];
}

export interface NavGroup {
  id: string;
  label: string;
  icon: any;
  items: NavItem[];
}

export const NAVIGATION_REGISTRY: NavGroup[] = [
  {
    id: 'master',
    label: 'Master Data',
    icon: Database,
    items: [
      {
        id: 'hsn-master',
        label: 'HSN Master',
        path: '/hsn-master',
        icon: Hash,
        description: 'Manage HSN/SAC codes, descriptions, and tax structures.',
        keywords: ['hsn', 'sac', 'gst', 'tax', 'code', 'hsn code']
      },
      {
        id: 'tax-master',
        label: 'Tax Master',
        path: '/tax-master',
        icon: Percent,
        description: 'Configure tax percentages, CGST, SGST, IGST, and cess settings.',
        keywords: ['tax', 'gst', 'cgst', 'sgst', 'igst', 'percent', 'tax rate']
      }
    ]
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: ShoppingCart,
    items: [
      {
        id: 'sales-entry',
        label: 'Sales Entry',
        path: '/sales',
        icon: BadgePercent,
        description: 'Generate customer invoices, manage drafts, and collect payments.',
        keywords: ['sales', 'invoice', 'billing', 'pos', 'sell', 'checkout']
      }
    ]
  }
];

export const getRouteMeta = (path: string) => {
  if (path === '/dashboard') return { category: 'Overview', title: 'Dashboard' };
  if (path === '/launchpad') return { category: 'Navigation Hub', title: 'Launchpad' };
  
  for (const group of NAVIGATION_REGISTRY) {
    const item = group.items.find(i => i.path === path);
    if (item) {
      return { category: group.label, title: item.label };
    }
  }
  return { category: 'App', title: 'Page' };
};
