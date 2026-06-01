import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE_URL } from '../../config/apiConfig';

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  loyaltyPoints: number;
}

export interface LineItem {
  id: string;
  barcode: string;
  sourceCode: string;
  productCode: string;
  color: string;
  isIndividual: boolean;
  isNoStockChecking: boolean;
  availableStock: number;
  category: string;
  size: string;
  mrp: number;
  selPrice: number;
  discount: number;
  hsn: string;
  taxDesc: string;
  taxAmt: number;
  qty: number;
  amount: number;
  taxId?: number;
  taxRate?: number;
}

export interface SavedInvoice {
  purId?: number;
  docNo: string;
  docDate: string;
  customerName: string;
  mobileNumber: string;
  items: LineItem[];
  status: 'EDIT' | 'LOCKED';
  netAmount?: number;
  totalQty?: number;
}

export interface PopupMessage {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  subMessage?: string;
  confirmAction?: () => void;
  confirmLabel?: string;
  discardAction?: () => void;
  discardLabel?: string;
  cancelLabel?: string;
}

export const useSalesLogic = () => {
  // Retrieve Company Profile from localStorage
  const companyId = Number(localStorage.getItem('companyId') || '1');
  const companyCount = Number(localStorage.getItem('companyCount') || '1');

  // State for header
  const [mobileNumber, setMobileNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [docNo, setDocNo] = useState("Loading...");
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [formMode, setFormMode] = useState<'NEW' | 'VIEW' | 'EDIT' | 'LOCKED'>('NEW');
  const [currentPurId, setCurrentPurId] = useState<number | null>(null);
  const isExclusiveBill = true;

  // Salesman states
  const [purSalesmanId, setPurSalesmanId] = useState<number | null>(null);
  const [salesmenList, setSalesmenList] = useState<{ id: number; name: string; code?: string }[]>([]);
  const [salesmanSearch, setSalesmanSearch] = useState('');
  const [isSalesmanDropdownOpen, setIsSalesmanDropdownOpen] = useState(false);

  const fetchSalesmen = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sales/salesmen`);
      if (res.ok) {
        const data = await res.json();
        setSalesmenList(data);
      }
    } catch (err) {
      console.error("Failed to fetch salesmen:", err);
    }
  }, []);

  // Modal / History state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [totalHistoryRecords, setTotalHistoryRecords] = useState(0);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Cart line items
  const [items, setItems] = useState<LineItem[]>([]);

  // Saved invoices list from backend
  const [savedInvoicesList, setSavedInvoicesList] = useState<SavedInvoice[]>([]);

  const [popup, setPopup] = useState<PopupMessage>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const fetchNextDocNo = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sales/next-docno?companyId=${companyId}&companyCount=${companyCount}`);
      const data = await res.json();
      if (data && data.nextDocNo) {
        setDocNo(data.nextDocNo.toString());
      }
    } catch (err: any) {
      console.error("Failed to fetch next doc no:", err);
      setDocNo("1");
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Server Unreachable',
        message: 'Unable to connect to the inventory & sales server.',
        subMessage: 'Please check if the backend service is running or contact your system administrator.'
      });
    }
  }, [companyId, companyCount]);

  const fetchHistory = useCallback(async (page: number = 1, search: string = '', append: boolean = false) => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/sales/history?companyId=${companyId}&companyCount=${companyCount}&page=${page}&pageSize=50&searchTerm=${encodeURIComponent(search)}`);
      const responseData = await res.json();
      if (responseData && Array.isArray(responseData.data)) {
        const formatted = responseData.data.map((item: any) => ({
          docNo: item.docNo.toString(),
          docDate: item.docDate,
          customerName: item.customerName || 'Walk-in Customer',
          mobileNumber: item.mobileNumber || '',
          status: item.status as 'EDIT' | 'LOCKED',
          purId: item.purId,
          netAmount: item.netAmount || 0,
          totalQty: item.totalQty || 0,
          items: []
        }));
        setSavedInvoicesList(prev => append ? [...prev, ...formatted] : formatted);
        setHasMoreHistory(responseData.hasMore);
        setTotalHistoryRecords(responseData.totalRecords);
        setHistoryPage(page);
      }
    } catch (err: any) {
      console.error("Failed to fetch history:", err);
      if (!append) setSavedInvoicesList([]);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Server Unreachable',
        message: 'Unable to connect to the inventory & sales server.',
        subMessage: 'Please check if the backend service is running or contact your system administrator.'
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [companyId, companyCount]);

  useEffect(() => {
    fetchNextDocNo();
    fetchSalesmen();
    // Intentionally omit fetchHistory here so we only fetch when modal opens
  }, [fetchNextDocNo, fetchSalesmen]);

  useEffect(() => {
    if (isHistoryOpen) {
      // First load when opening modal
      fetchHistory(1, historySearch, false);
    }
  }, [isHistoryOpen]); // Do not put fetchHistory/historySearch in dependency to avoid infinite loops

  // Debounced Search Logic
  useEffect(() => {
    if (!isHistoryOpen) return;
    const timer = setTimeout(() => {
      fetchHistory(1, historySearch, false);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [historySearch, isHistoryOpen, fetchHistory]);

  const performNewSale = useCallback(() => {
    fetchNextDocNo();
    setDocDate(new Date().toISOString().split('T')[0]);
    setCustomerName("");
    setMobileNumber("");
    setPurSalesmanId(null);
    setSalesmanSearch("");
    setIsSalesmanDropdownOpen(false);
    setIsUserTypingMobile(false);
    setItems([]);
    setFormMode("NEW");
    setCurrentPurId(null);
    setGlobalDiscountPercent(0);
    setGlobalDiscountAmount(0);
  }, [fetchNextDocNo]);

  const performLoadInvoice = useCallback(async (inv: SavedInvoice) => {
    if (!inv.purId || loadingInvoiceId !== null) return;
    setLoadingInvoiceId(inv.purId);
    try {
      const res = await fetch(`${API_BASE_URL}/sales/${inv.purId}`);
      const data = await res.json();
      if (res.ok) {
        setCurrentPurId(data.purId || data.PurId || inv.purId);
        setDocNo((data.docNo || data.DocNo || inv.docNo || "").toString());
        setDocDate(data.docDate || data.DocDate || inv.docDate);
        setCustomerName(data.customerName || data.CustomerName || inv.customerName);
        setMobileNumber(data.mobileNumber || data.MobileNumber || inv.mobileNumber);
        setPurSalesmanId(data.purSalesmanId || data.PurSalesmanId || null);
        setSalesmanSearch(data.salesmanName || data.SalesmanName || "");
        setIsUserTypingMobile(false);
        setGlobalDiscountPercent(0);
        setGlobalDiscountAmount(0);
        setFormMode('VIEW');
        const rawItems = data.items || data.Items || [];
        const loadedItems: LineItem[] = rawItems.map((i: any) => ({
          id: i.id || i.Id || Date.now().toString(),
          barcode: i.barcode || i.Barcode || '',
          sourceCode: i.sourceCode || i.SourceCode || '',
          productCode: i.productCode || i.ProductCode || '',
          color: i.color || i.Color || 'N/A',
          isIndividual: i.isIndividual || i.IsIndividual || false,
          isNoStockChecking: i.isNoStockChecking || i.IsNoStockChecking || false,
          availableStock: i.availableStock !== undefined ? i.availableStock : (i.AvailableStock !== undefined ? i.AvailableStock : 0),
          category: i.category || i.Category || 'General',
          size: i.size || i.Size || 'Free',
          mrp: i.mrp || i.Mrp || 0,
          selPrice: i.selPrice || i.SelPrice || 0,
          discount: i.discount || i.Discount || 0,
          hsn: i.hsn || i.Hsn || '9999',
          taxDesc: i.taxDesc || i.TaxDesc || 'GST 0%',
          taxAmt: i.taxAmt !== undefined ? i.taxAmt : (i.TaxAmt !== undefined ? i.TaxAmt : 0),
          qty: i.qty || i.Qty || 1,
          amount: i.amount || i.Amount || 0,
          taxId: i.taxId || i.TaxId || undefined,
          taxRate: i.taxRate !== undefined ? i.taxRate : (i.TaxRate !== undefined ? i.TaxRate : 0)
        }));
        setItems(loadedItems);
        setIsHistoryOpen(false);
      } else {
        setPopup({
          isOpen: true,
          type: 'error',
          title: 'Load Failed',
          message: data.message || 'Failed to load invoice details from server.'
        });
      }
    } catch (err: any) {
      console.error("Failed to load invoice details:", err);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Server Unreachable',
        message: 'Unable to connect to the inventory & sales server to load invoice details.',
        subMessage: 'Please check if the backend service is running or contact your system administrator.'
      });
    } finally {
      setLoadingInvoiceId(null);
    }
  }, [loadingInvoiceId]);

  const saveToBackend = useCallback(async (targetStatus: 'EDIT' | 'LOCKED') => {
    if (items.length === 0) {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Empty Cart',
        message: 'Cannot save because there are no items in the cart.',
        subMessage: 'Please scan or add at least one product.'
      });
      return;
    }

    setIsSaving(true);
    const payload = {
      purId: currentPurId || 0,
      companyId,
      companyCount,
      docNo: Number(docNo) || 1,
      docDate,
      customerName: customerName || "Walk-in Customer",
      mobileNumber,
      purSalesmanId,
      grossAmount: items.reduce((sum, i) => sum + (i.mrp * i.qty), 0),
      discountAmount: items.reduce((sum, i) => sum + (i.discount * i.qty), 0),
      netAmount: items.reduce((sum, i) => sum + i.amount, 0),
      totalQty: items.reduce((sum, i) => sum + i.qty, 0),
      status: targetStatus,
      items: items.map(i => ({
        id: i.id,
        barcode: i.barcode,
        sourceCode: i.sourceCode,
        productCode: i.productCode,
        color: i.color,
        size: i.size,
        mrp: i.mrp,
        selPrice: i.selPrice,
        discount: i.discount,
        qty: i.qty,
        amount: i.amount,
        taxDesc: i.taxDesc,
        taxAmt: i.taxAmt,
        taxId: i.taxId,
        taxRate: i.taxRate
      }))
    };

    try {
      const res = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchHistory(); // Refresh history list
        // Load the saved invoice from backend to ensure UI calculations and database values match perfectly
        await performLoadInvoice({
          purId: data.purId,
          docNo,
          docDate,
          customerName,
          mobileNumber,
          items: [],
          status: targetStatus
        });
        setPopup({
          isOpen: true,
          type: 'success',
          title: targetStatus === 'LOCKED' ? 'Sale Completed Successfully!' : 'Draft Saved Successfully',
          message: targetStatus === 'LOCKED'
            ? `Invoice ${docNo} has been finalized, locked, and payment settled.`
            : `Draft Invoice ${docNo} has been saved successfully.`,
          subMessage: targetStatus === 'LOCKED'
            ? 'Click "New (F2)" to begin the next customer transaction.'
            : 'You can view or reload this draft anytime from the Sales Register (F3).'
        });
      } else {
        setPopup({
          isOpen: true,
          type: 'error',
          title: 'Save Failed',
          message: data.message || data.title || 'Failed to save invoice to server.',
          subMessage: data.details || (data.errors ? JSON.stringify(data.errors) : undefined)
        });
      }
    } catch (err: any) {
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Network Error',
        message: 'Could not connect to backend server to save invoice.',
        subMessage: err.message
      });
    } finally {
      setIsSaving(false);
    }
  }, [currentPurId, companyId, companyCount, docNo, docDate, customerName, mobileNumber, purSalesmanId, items, fetchHistory, performLoadInvoice]);

  const handleNewSale = useCallback(() => {
    if ((formMode === 'NEW' || formMode === 'EDIT') && items.length > 0) {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Unsaved Changes',
        message: 'You have unsaved items in your current invoice. Starting a new sale will discard these changes.',
        subMessage: 'Do you want to save this invoice before leaving, or discard changes and leave?',
        confirmLabel: 'Save Record',
        cancelLabel: 'Cancel',
        discardLabel: 'Leave / Discard',
        confirmAction: () => {
          saveToBackend(formMode === 'EDIT' ? 'EDIT' : 'LOCKED');
          setTimeout(() => performNewSale(), 1000);
        },
        discardAction: () => {
          performNewSale();
        }
      });
      return;
    }
    performNewSale();
  }, [formMode, items.length, performNewSale, saveToBackend]);

  const handleLoadInvoice = useCallback(async (inv: SavedInvoice) => {
    if (loadingInvoiceId !== null) return;
    if ((formMode === 'NEW' || formMode === 'EDIT') && items.length > 0) {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Unsaved Changes',
        message: `You have unsaved items in your current invoice. Loading invoice #${inv.docNo} will discard these changes.`,
        subMessage: 'Do you want to save this invoice before leaving, or discard changes and leave?',
        confirmLabel: 'Save Record',
        cancelLabel: 'Cancel',
        discardLabel: 'Leave / Discard',
        confirmAction: () => {
          saveToBackend(formMode === 'EDIT' ? 'EDIT' : 'LOCKED');
          setTimeout(() => performLoadInvoice(inv), 1000);
        },
        discardAction: () => {
          performLoadInvoice(inv);
        }
      });
      return;
    }
    performLoadInvoice(inv);
  }, [formMode, items.length, performLoadInvoice, saveToBackend, loadingInvoiceId]);

  const handleSaveInvoice = useCallback(() => {
    if (isSaving) return;
    if (items.length === 0) {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Empty Cart',
        message: 'Cannot save because there are no items in the cart.',
        subMessage: 'Please scan or add at least one product.'
      });
      return;
    }
    if (formMode === 'VIEW' || formMode === 'LOCKED') {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Invoice Locked',
        message: formMode === 'LOCKED' ? 'This invoice is already locked (completed) and cannot be modified.' : 'This invoice is currently in Lock Mode.',
        subMessage: formMode === 'LOCKED' ? 'Click "New (F2)" to start a fresh transaction.' : 'Please click the "Edit" button to unlock the form before saving changes.'
      });
      return;
    }
    saveToBackend('EDIT');
  }, [formMode, saveToBackend, isSaving, items.length]);

  const handleCompleteSale = useCallback(() => {
    if (isSaving) return;
    if (items.length === 0) {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Empty Cart',
        message: 'Cannot complete sale because there are no items in the cart.',
        subMessage: 'Please scan or add at least one product.'
      });
      return;
    }
    if (formMode === 'VIEW' || formMode === 'LOCKED') {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Invoice Locked',
        message: formMode === 'LOCKED' ? 'This invoice is already locked (completed) and cannot be modified.' : 'This invoice is currently in Lock Mode.',
        subMessage: formMode === 'LOCKED' ? 'Click "New (F2)" to start a fresh transaction.' : 'Please click the "Edit" button to unlock the form before completing sale.'
      });
      return;
    }
    saveToBackend('LOCKED');
  }, [formMode, items.length, saveToBackend, isSaving]);

  // Keyboard Shortcuts (F2 New, F3 Load, F10 Complete, F12 Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSaving) return;
      if (e.key === 'F2') { e.preventDefault(); handleNewSale(); }
      if (e.key === 'F3') { e.preventDefault(); setIsHistoryOpen(true); }
      if (e.key === 'F10') {
        e.preventDefault();
        if (items.length === 0) {
          setPopup({
            isOpen: true,
            type: 'warning',
            title: 'Empty Cart',
            message: 'Cannot complete sale because there are no items in the cart.',
            subMessage: 'Please scan or add at least one product.'
          });
          return;
        }
        handleCompleteSale();
      }
      if (e.key === 'F12') {
        e.preventDefault();
        if (items.length === 0) {
          setPopup({
            isOpen: true,
            type: 'warning',
            title: 'Empty Cart',
            message: 'Cannot save because there are no items in the cart.',
            subMessage: 'Please scan or add at least one product.'
          });
          return;
        }
        handleSaveInvoice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewSale, handleCompleteSale, handleSaveInvoice, isSaving, items.length]);

  // State for Layout Toggle
  const [viewMode, setViewMode] = useState<'modern' | 'classic'>('classic');

  // Global Bulk Discount Percentage State
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);
  // Global Bulk Discount Amount State
  const [globalDiscountAmount, setGlobalDiscountAmount] = useState<number>(0);

  // Customer Search States
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isUserTypingMobile, setIsUserTypingMobile] = useState(false);

  // Ref for classic table scroll reset
  const classicScrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll when switching to classic view
  useEffect(() => {
    if (viewMode === 'classic' && classicScrollRef.current) {
      classicScrollRef.current.scrollLeft = 0;
    }
  }, [viewMode]);

  // Prevent accidental page refresh/unload when there are unsaved items
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((formMode === 'NEW' || formMode === 'EDIT') && items.length > 0) {
        e.preventDefault();
        e.returnValue = ''; // Standard browser reload warning prompt
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [items.length, formMode]);



  // Real-time Customer Search Logic
  useEffect(() => {
    const searchCustomer = async () => {
      if (formMode === 'VIEW' || formMode === 'LOCKED' || mobileNumber.length < 3 || !isUserTypingMobile) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`${API_BASE_URL}/customer/search?query=${mobileNumber}`);
        const data = await response.json();

        setSearchResults(data);
        setShowResults(data.length > 0);
      } catch (error) {
        console.error('Customer search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchCustomer, 300);
    return () => clearTimeout(timer);
  }, [mobileNumber, formMode, isUserTypingMobile]);

  const handleCustomerSelect = (customer: Customer) => {
    setMobileNumber(customer.mobile);
    setCustomerName(customer.name);
    setIsUserTypingMobile(false);
    setShowResults(false);
  };

  const handleMobileChange = (val: string) => {
    setMobileNumber(val);
    setIsUserTypingMobile(true);
  };

  // State for cart search
  const [cartSearch, setCartSearch] = useState('');

  // Filtered items for display
  const filteredItems = items.filter(item =>
    item.productCode.toLowerCase().includes(cartSearch.toLowerCase()) ||
    item.barcode.includes(cartSearch)
  );

  // Current scanned item state (Input Form)
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isScanningItem, setIsScanningItem] = useState(false);

  // Dynamic Calculations for Totals & Footer
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const grossAmount = items.reduce((sum, item) => sum + (item.mrp * item.qty), 0);
  const totalDiscount = items.reduce((sum, item) => sum + (item.discount * item.qty), 0);
  const totalTaxAmt = items.reduce((sum, item) => sum + (item.taxAmt || 0), 0);
  const netPayable = items.reduce((sum, item) => sum + item.amount, 0) + totalTaxAmt;
  const subtotalExclTax = items.reduce((sum, item) => sum + item.amount, 0);

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  items.forEach(item => {
    const isIgst = item.taxDesc && item.taxDesc.toUpperCase().includes('IGST');
    const itemTax = item.taxAmt || 0;
    if (isIgst) {
      igstAmount += itemTax;
    } else {
      cgstAmount += itemTax / 2;
      sgstAmount += itemTax / 2;
    }
  });

  // Last Scanned Item for Modern View Preview Card
  const lastScannedItem = items[items.length - 1] || null;

  // Handle Barcode Scan Logic
  const handleBarcodeScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (formMode === 'VIEW' || formMode === 'LOCKED') {
        setPopup({
          isOpen: true,
          type: 'warning',
          title: 'Invoice Locked',
          message: formMode === 'LOCKED' ? 'This invoice is locked (completed).' : 'This invoice is currently in Lock Mode.',
          subMessage: formMode === 'LOCKED' ? 'Click "New (F2)" to start a new sale.' : 'Please click the "Edit" button to unlock the form and scan items.'
        });
        return;
      }
      if (!docNo || !docNo.trim() || !docDate || !docDate.trim()) {
        setPopup({
          isOpen: true,
          type: 'warning',
          title: 'Missing Header Info',
          message: 'Please enter Doc No and Date first.',
          subMessage: 'Header details cannot be empty.'
        });
        return;
      }
      if (!barcodeInput.trim()) return;

      setIsScanningItem(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/product/scan/${barcodeInput}?companyId=${companyId}&mobileNumber=${encodeURIComponent(mobileNumber)}&currentPurId=${currentPurId || ''}`
        );

        if (!response.ok) {
          let serverErrorMessage = 'The inventory server encountered an error while processing your request.';
          let serverErrorDetail = 'Please check the server logs or try again.';
          try {
            const errorData = await response.json();
            if (errorData.message) {
              serverErrorMessage = errorData.message;
            } else if (errorData.title) {
              serverErrorMessage = errorData.title;
            }
            if (errorData.details || errorData.detail) {
              serverErrorDetail = errorData.details || errorData.detail;
            } else if (errorData.traceId) {
              serverErrorDetail = `Trace ID: ${errorData.traceId}`;
            }
          } catch (e) {
            try {
              const textData = await response.text();
              if (textData) {
                serverErrorMessage = textData.slice(0, 200);
              }
            } catch (textErr) { }
          }

          if (response.status === 404) {
            throw new Error(JSON.stringify({
              type: 'NOT_FOUND',
              message: `No product matching barcode "${barcodeInput}" was found in the inventory.`,
              subMessage: 'Please check the barcode number and try scanning again.'
            }));
          }

          throw new Error(JSON.stringify({
            type: 'SERVER_ERROR',
            message: serverErrorMessage,
            subMessage: serverErrorDetail
          }));
        }

        const data = await response.json();

        const rate = data.taxRate !== undefined && data.taxRate !== null ? Number(data.taxRate) : 0;
        // Apply global discount percent or amount if active
        let defaultDiscount = 0;
        if (globalDiscountPercent > 0) {
          defaultDiscount = (data.barcodeSelPrice * globalDiscountPercent) / 100;
        } else if (globalDiscountAmount > 0) {
          defaultDiscount = Math.min(data.barcodeSelPrice, globalDiscountAmount);
        }
        const finalSelPrice = data.barcodeSelPrice - defaultDiscount;
        const taxAmt = (finalSelPrice * rate) / 100;

        const isIndividual = data.productIndividualBarcode ? (
          String(data.productIndividualBarcode).trim().toUpperCase() === "YES" || 
          String(data.productIndividualBarcode).trim().toUpperCase() === "TRUE" || 
          data.productIndividualBarcode === true ||
          data.productIndividualBarcode === 1
        ) : false;

        const isNoStockChecking = data.productNoStockChecking || false;
        const availableStock = data.availableStock || 0;

        // Cumulative validations
        if (isIndividual) {
          const alreadyExists = items.some(item => item.barcode === data.barcodedesc || item.sourceCode === data.barcodeSourceBarcode);
          if (alreadyExists) {
            setPopup({
              isOpen: true,
              type: 'warning',
              title: 'Individual Barcode Limit',
              message: `Unique barcode already in cart.`,
              subMessage: `Barcode "${data.barcodedesc}" can only be added once.`
            });
            setBarcodeInput('');
            setIsScanningItem(false);
            return;
          }
        } else if (!isNoStockChecking) {
          const existingQty = items
            .filter(item => item.barcode === data.barcodedesc || (item.sourceCode && item.sourceCode === data.barcodeSourceBarcode))
            .reduce((sum, item) => sum + item.qty, 0);
          
          if (existingQty + 1 > availableStock) {
            setPopup({
              isOpen: true,
              type: 'warning',
              title: 'Insufficient Stock',
              message: `Available stock is ${availableStock}.`,
              subMessage: existingQty > 0 
                ? `You already have ${existingQty} in the cart. Cannot add another.`
                : `Cannot add item because the product is out of stock.`
            });
            setBarcodeInput('');
            setIsScanningItem(false);
            return;
          }
        }

        const newItem: LineItem = {
          id: Date.now().toString(),
          barcode: data.barcodedesc,
          sourceCode: data.barcodeSourceBarcode,
          productCode: data.productCode,
          color: data.colorName,
          isIndividual: isIndividual,
          isNoStockChecking: isNoStockChecking,
          availableStock: availableStock,
          category: data.categoryDescription,
          size: data.barcodeSize,
          mrp: data.barcodeMrp,
          selPrice: data.barcodeSelPrice,
          discount: defaultDiscount,
          hsn: data.hsnCode,
          taxDesc: data.taxDesc || 'GST 0%',
          taxAmt: taxAmt,
          qty: 1,
          amount: finalSelPrice,
          taxId: data.taxId,
          taxRate: rate
        };

        setItems(prev => [...prev, newItem]);
        setBarcodeInput('');
      } catch (error: any) {
        console.error('Scan failed:', error);
        try {
          const errObj = JSON.parse(error.message);
          if (errObj.type === 'NOT_FOUND') {
            setPopup({
              isOpen: true,
              type: 'warning',
              title: 'Product Not Found',
              message: errObj.message,
              subMessage: errObj.subMessage
            });
          } else if (errObj.type === 'SERVER_ERROR') {
            setPopup({
              isOpen: true,
              type: 'error',
              title: 'Backend Server Exception',
              message: errObj.message,
              subMessage: errObj.subMessage
            });
          }
        } catch (parseErr) {
          setPopup({
            isOpen: true,
            type: 'error',
            title: 'System Offline / Connection Lost',
            message: 'Unable to verify product details because the billing terminal is currently offline.',
            subMessage: 'Please check your network connection or contact your store supervisor.'
          });
        }
      } finally {
        setIsScanningItem(false);
      }
    }
  };

  // Handle Remove Item
  const handleRemoveItem = (id: string) => {
    if (formMode === 'VIEW' || formMode === 'LOCKED') return;
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Handle Update Qty
  const handleUpdateQty = (id: string, qty: number) => {
    if (formMode === 'VIEW' || formMode === 'LOCKED') return;
    
    const targetItem = items.find(item => item.id === id);
    if (!targetItem) return;

    if (targetItem.isIndividual) {
      // Qty cannot be changed for individual items (locked to 1)
      return;
    }

    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }

    // Cumulative stock checking validation
    if (!targetItem.isNoStockChecking) {
      const otherQty = items
        .filter(item => item.id !== id && (item.barcode === targetItem.barcode || (item.sourceCode && item.sourceCode === targetItem.sourceCode)))
        .reduce((sum, item) => sum + item.qty, 0);
      
      if (otherQty + qty > targetItem.availableStock) {
        setPopup({
          isOpen: true,
          type: 'warning',
          title: 'Insufficient Stock',
          message: `Available stock is ${targetItem.availableStock}.`,
          subMessage: otherQty > 0
            ? `You have ${otherQty} in other rows. Setting this to ${qty} exceeds the limit.`
            : `Requested quantity of ${qty} exceeds available limit.`
        });
        return;
      }
    }

    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const amount = (item.selPrice - item.discount) * qty;
        const rate = item.taxRate || 0;
        const taxAmt = (amount * rate) / 100;
        return {
          ...item,
          qty,
          amount,
          taxAmt
        };
      }
      return item;
    }));
  };

  // Handle Update Discount
  const handleUpdateItemDiscountPercent = (id: string, percent: number) => {
    if (formMode === 'VIEW' || formMode === 'LOCKED') return;
    setGlobalDiscountPercent(0);
    setGlobalDiscountAmount(0);
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const clampedPercent = Math.max(0, Math.min(100, percent || 0));
        const discount = (item.selPrice * clampedPercent) / 100;
        const amount = (item.selPrice - discount) * item.qty;
        const rate = item.taxRate || 0;
        const taxAmt = (amount * rate) / 100;
        return {
          ...item,
          discount,
          amount,
          taxAmt
        };
      }
      return item;
    }));
  };

  // Handle Update Discount
  const handleUpdateItemDiscount = (id: string, discount: number) => {
    if (formMode === 'VIEW' || formMode === 'LOCKED') return;
    setGlobalDiscountPercent(0);
    setGlobalDiscountAmount(0);
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const clampedDiscount = Math.max(0, Math.min(item.selPrice, discount || 0));
        const amount = (item.selPrice - clampedDiscount) * item.qty;
        const rate = item.taxRate || 0;
        const taxAmt = (amount * rate) / 100;
        return {
          ...item,
          discount: clampedDiscount,
          amount,
          taxAmt
        };
      }
      return item;
    }));
  };

  // Apply Global Discount Percentage to all items
  const handleApplyGlobalDiscountPercent = useCallback((percent: number) => {
    if (formMode === 'VIEW' || formMode === 'LOCKED') return;
    const clampedPercent = Math.max(0, Math.min(100, percent || 0));
    setGlobalDiscountPercent(clampedPercent);
    setGlobalDiscountAmount(0); // Clear amount
    setItems(prev => prev.map(item => {
      const discount = (item.selPrice * clampedPercent) / 100;
      const amount = (item.selPrice - discount) * item.qty;
      const rate = item.taxRate || 0;
      const taxAmt = (amount * rate) / 100;
      return {
        ...item,
        discount,
        amount,
        taxAmt
      };
    }));
  }, [formMode]);

  // Apply Global Discount Amount to all items
  const handleApplyGlobalDiscountAmount = useCallback((amount: number) => {
    if (formMode === 'VIEW' || formMode === 'LOCKED') return;
    const clampedAmount = Math.max(0, amount || 0);
    setGlobalDiscountAmount(clampedAmount);
    setGlobalDiscountPercent(0); // Clear percent
    setItems(prev => prev.map(item => {
      const discount = Math.min(item.selPrice, clampedAmount);
      const amount = (item.selPrice - discount) * item.qty;
      const rate = item.taxRate || 0;
      const taxAmt = (amount * rate) / 100;
      return {
        ...item,
        discount,
        amount,
        taxAmt
      };
    }));
  }, [formMode]);

  // State for bill details popover
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return {
    companyId,
    companyCount,
    mobileNumber,
    setMobileNumber,
    customerName,
    setCustomerName,
    docNo,
    setDocNo,
    docDate,
    setDocDate,
    formMode,
    setFormMode,
    currentPurId,
    setCurrentPurId,
    isHistoryOpen,
    setIsHistoryOpen,
    historySearch,
    setHistorySearch,
    items,
    setItems,
    savedInvoicesList,
    setSavedInvoicesList,
    popup,
    setPopup,
    viewMode,
    setViewMode,
    searchResults,
    setSearchResults,
    historyPage,
    hasMoreHistory,
    isLoadingHistory,
    totalHistoryRecords,
    isSearching,
    setIsSearching,
    showResults,
    setShowResults,
    cartSearch,
    setCartSearch,
    barcodeInput,
    setBarcodeInput,
    isScanningItem,
    setIsScanningItem,
    isDetailsOpen,
    setIsDetailsOpen,
    totalQty,
    grossAmount,
    totalDiscount,
    netPayable,
    subtotalExclTax,
    cgstAmount,
    sgstAmount,
    igstAmount,
    isExclusiveBill,
    lastScannedItem,
    filteredItems,
    classicScrollRef,
    fetchNextDocNo,
    fetchHistory,
    handleNewSale,
    handleLoadInvoice,
    saveToBackend,
    handleSaveInvoice,
    handleCompleteSale,
    handleCustomerSelect,
    handleMobileChange,
    handleBarcodeScan,
    handleRemoveItem,
    handleUpdateQty,
    handleUpdateItemDiscount,
    handleUpdateItemDiscountPercent,
    purSalesmanId,
    setPurSalesmanId,
    salesmenList,
    salesmanSearch,
    setSalesmanSearch,
    isSalesmanDropdownOpen,
    setIsSalesmanDropdownOpen,
    globalDiscountPercent,
    handleApplyGlobalDiscountPercent,
    globalDiscountAmount,
    handleApplyGlobalDiscountAmount,
    loadingInvoiceId,
    isSaving
  };
};
