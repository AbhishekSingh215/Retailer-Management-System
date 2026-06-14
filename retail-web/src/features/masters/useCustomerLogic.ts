import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { API_BASE_URL } from '../../config/apiConfig';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CustomerDto {
  customerId: number;
  customerName: string;
  customerNickName: string;
  customerCode: string;
  customerGender: string;
  customerMobileNo: string;
  customerMobileNo2: string;
  customerEmailID: string;
  customerAddress1: string;
  customerAddress2: string;
  customerAddress3: string;
  customerPincode: string;
  customerLocation: string;
  customerGstNo: string;
  customerPanNo: string;
  customerGstType: number | null;
  customerBirthDate: string | null;
  customerAnnDate: string | null;
  customerRemarks: string;
  customerDeActive: boolean;
}

export const EMPTY_CUSTOMER: CustomerDto = {
  customerId: 0,
  customerName: '',
  customerNickName: '',
  customerCode: '',
  customerGender: '',
  customerMobileNo: '',
  customerMobileNo2: '',
  customerEmailID: '',
  customerAddress1: '',
  customerAddress2: '',
  customerAddress3: '',
  customerPincode: '',
  customerLocation: '',
  customerGstNo: '',
  customerPanNo: '',
  customerGstType: null,
  customerBirthDate: null,
  customerAnnDate: null,
  customerRemarks: '',
  customerDeActive: false,
};

export const GST_TYPES: { value: number; label: string }[] = [
  { value: 0, label: 'Unregistered' },
  { value: 1, label: 'Regular' },
  { value: 2, label: 'Composition' },
  { value: 3, label: 'Consumer' },
  { value: 4, label: 'Exempt' },
];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useCustomerLogic = () => {
  // ── List State ────────────────────────────────────────────────────────────
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Modal / Form State ────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CustomerDto>({ ...EMPTY_CUSTOMER });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // ── Search, Filter & Sort ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [sortField, setSortField] = useState<'customerName' | 'customerCode' | 'customerId'>('customerName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // ── Paging State ──────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // ── Detail expand ─────────────────────────────────────────────────────────
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // ── Notification ──────────────────────────────────────────────────────────
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // ── Data Fetching ─────────────────────────────────────────────────────────

  const fetchCustomers = useCallback(async (pageNumber: number = 1, isAppend: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: pageNumber.toString(),
        pageSize: '20',
        search: searchQuery,
        showInactive: showInactive.toString(),
        sortField,
        sortDir,
      });
      const res = await fetch(`${API_BASE_URL}/Customer?${queryParams}`);
      if (!res.ok) throw new Error('Failed to load customers.');
      const data = await res.json();
      
      if (isAppend) {
        setCustomers(prev => [...prev, ...data.items]);
      } else {
        setCustomers(data.items);
      }
      setHasMore(data.hasMore);
      setTotalCount(data.totalCount);
      setPage(pageNumber);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, showInactive, sortField, sortDir]);

  useEffect(() => {
    fetchCustomers(1, false);
  }, [fetchCustomers]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    fetchCustomers(page + 1, true);
  }, [page, hasMore, isLoading, fetchCustomers]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const showNotification = useCallback((type: 'success' | 'error', msg: string) => {
    setNotification({ type, message: msg });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const setField = useCallback((field: keyof CustomerDto, val: any) => {
    setForm(prev => {
      const updated = { ...prev, [field]: val };
      if (field === 'customerGstNo') {
        const gst = String(val).trim();
        if (gst.length >= 12) {
          const pan = gst.substring(2, 12).toUpperCase();
          if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
            updated.customerPanNo = pan;
          }
        }
      }
      return updated;
    });
    setFormErrors(prev => {
      const next = { ...prev };
      if (next[field]) {
        delete next[field];
      }
      if (field === 'customerGstNo') {
        delete next['customerPanNo'];
      }
      return next;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (!form.customerName.trim()) errors.customerName = 'Customer name is required';
    if (form.customerMobileNo && !/^\d{10}$/.test(form.customerMobileNo.replace(/\D/g, ''))) {
      errors.customerMobileNo = 'Enter a valid 10-digit mobile number';
    }
    if (form.customerMobileNo2 && !/^\d{10}$/.test(form.customerMobileNo2.replace(/\D/g, ''))) {
      errors.customerMobileNo2 = 'Enter a valid 10-digit mobile number';
    }
    if (form.customerEmailID && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmailID)) {
      errors.customerEmailID = 'Enter a valid email address';
    }
    if (form.customerGstNo && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.customerGstNo.toUpperCase())) {
      errors.customerGstNo = 'Enter a valid 15-character GSTIN';
    }
    if (form.customerPanNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.customerPanNo.toUpperCase())) {
      errors.customerPanNo = 'Enter a valid 10-character PAN';
    }
    if (form.customerPincode && !/^\d{6}$/.test(form.customerPincode)) {
      errors.customerPincode = 'Enter a valid 6-digit pincode';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleOpenCreate = useCallback(() => {
    setEditingId(null);
    setForm({ ...EMPTY_CUSTOMER });
    setFormErrors({});
    setIsModalOpen(true);
    setTimeout(() => nameInputRef.current?.focus(), 200);
  }, []);

  const handleOpenEdit = useCallback((c: CustomerDto) => {
    setEditingId(c.customerId);
    setForm({
      ...c,
      customerBirthDate: c.customerBirthDate ? c.customerBirthDate.split('T')[0] : null,
      customerAnnDate: c.customerAnnDate ? c.customerAnnDate.split('T')[0] : null,
    });
    setFormErrors({});
    setIsModalOpen(true);
    setTimeout(() => nameInputRef.current?.focus(), 200);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    const payload = {
      ...form,
      customerGstNo: form.customerGstNo.toUpperCase(),
      customerPanNo: form.customerPanNo.toUpperCase(),
      customerBirthDate: form.customerBirthDate ? new Date(form.customerBirthDate).toISOString() : null,
      customerAnnDate: form.customerAnnDate ? new Date(form.customerAnnDate).toISOString() : null,
    };

    try {
      const url = editingId ? `${API_BASE_URL}/Customer/${editingId}` : `${API_BASE_URL}/Customer`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Server rejected customer data.');
      }
      showNotification('success', editingId ? 'Customer updated successfully!' : 'Customer created successfully!');
      setIsModalOpen(false);
      fetchCustomers(1, false);
    } catch (err: any) {
      showNotification('error', err.message || 'Operation failed.');
    } finally {
      setIsSaving(false);
    }
  }, [form, editingId, validateForm, showNotification, fetchCustomers]);

  const handleDeactivate = useCallback(async (id: number) => {
    if (!window.confirm('Are you sure you want to deactivate this customer?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/Customer/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to deactivate customer.');
      showNotification('success', 'Customer deactivated.');
      fetchCustomers(1, false);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  }, [showNotification, fetchCustomers]);

  // ── Filtering, Sorting & Computed ─────────────────────────────────────────

  const filteredCustomers = customers;

  const stats = useMemo(() => ({
    total: totalCount,
    active: customers.filter(c => !c.customerDeActive).length,
    withGST: customers.filter(c => c.customerGstNo).length,
  }), [totalCount, customers]);

  const toggleSort = useCallback((field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }, [sortField]);


  // ── Utility Helpers ───────────────────────────────────────────────────────

  const getInitials = (name: string | null | undefined) => {
    if (!name || !name.trim()) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) return (parts[0][0] + parts[1][0]).toUpperCase();
    return (name.trim()[0] || '?').toUpperCase();
  };

  const getAvatarColor = (name: string | null | undefined) => {
    const colors = [
      'from-violet-500 to-indigo-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-teal-600',
      'from-rose-500 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-fuchsia-500 to-purple-600',
      'from-lime-500 to-green-600',
      'from-sky-500 to-indigo-500',
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    // List data
    customers,
    filteredCustomers,
    isLoading,
    error,
    stats,

    // Search, filter, sort
    searchQuery,
    setSearchQuery,
    showInactive,
    setShowInactive,
    sortField,
    sortDir,
    toggleSort,
    hasMore,
    loadMore,

    // Expand
    expandedId,
    setExpandedId,

    // Modal / Form
    isModalOpen,
    setIsModalOpen,
    editingId,
    form,
    formErrors,
    isSaving,
    nameInputRef,
    setField,

    // CRUD actions
    handleOpenCreate,
    handleOpenEdit,
    handleSubmit,
    handleDeactivate,
    fetchCustomers,

    // Notification
    notification,

    // Utility helpers
    getInitials,
    getAvatarColor,
    formatDate,
  };
};
