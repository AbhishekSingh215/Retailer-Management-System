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

  // Modal / History state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState('');

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

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sales/history?companyId=${companyId}&companyCount=${companyCount}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const formatted = data.map((item: any) => ({
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
        setSavedInvoicesList(formatted);
      }
    } catch (err: any) {
      console.error("Failed to fetch history:", err);
      setSavedInvoicesList([]);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Server Unreachable',
        message: 'Unable to connect to the inventory & sales server.',
        subMessage: 'Please check if the backend service is running or contact your system administrator.'
      });
    }
  }, [companyId, companyCount]);

  useEffect(() => {
    fetchNextDocNo();
    fetchHistory();
  }, [fetchNextDocNo, fetchHistory]);

  useEffect(() => {
    if (isHistoryOpen) {
      fetchHistory();
    }
  }, [isHistoryOpen, fetchHistory]);

  const performNewSale = useCallback(() => {
    fetchNextDocNo();
    setDocDate(new Date().toISOString().split('T')[0]);
    setCustomerName("");
    setMobileNumber("");
    setIsUserTypingMobile(false);
    setItems([]);
    setFormMode("NEW");
    setCurrentPurId(null);
  }, [fetchNextDocNo]);

  const performLoadInvoice = useCallback(async (inv: SavedInvoice) => {
    if (!inv.purId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/sales/${inv.purId}`);
      const data = await res.json();
      if (res.ok) {
        setCurrentPurId(data.purId || data.PurId || inv.purId);
        setDocNo((data.docNo || data.DocNo || inv.docNo || "").toString());
        setDocDate(data.docDate || data.DocDate || inv.docDate);
        setCustomerName(data.customerName || data.CustomerName || inv.customerName);
        setMobileNumber(data.mobileNumber || data.MobileNumber || inv.mobileNumber);
        setIsUserTypingMobile(false);
        setFormMode((data.status || data.Status) === 'LOCKED' ? 'LOCKED' : 'VIEW');
        const rawItems = data.items || data.Items || [];
        const loadedItems: LineItem[] = rawItems.map((i: any) => ({
          id: i.id || i.Id || Date.now().toString(),
          barcode: i.barcode || i.Barcode || '',
          sourceCode: i.sourceCode || i.SourceCode || '',
          productCode: i.productCode || i.ProductCode || '',
          color: i.color || i.Color || 'N/A',
          isIndividual: false,
          category: i.category || i.Category || 'General',
          size: i.size || i.Size || 'Free',
          mrp: i.mrp || i.Mrp || 0,
          selPrice: i.selPrice || i.SelPrice || 0,
          discount: i.discount || i.Discount || 0,
          hsn: i.hsn || i.Hsn || '9999',
          taxDesc: i.taxDesc || i.TaxDesc || 'GST 5%',
          taxAmt: i.taxAmt || i.TaxAmt || ((i.amount || i.Amount || 0) * 0.05),
          qty: i.qty || i.Qty || 1,
          amount: i.amount || i.Amount || 0
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
    }
  }, []);

  const saveToBackend = useCallback(async (targetStatus: 'EDIT' | 'LOCKED') => {
    const payload = {
      purId: currentPurId || 0,
      companyId,
      companyCount,
      docNo: Number(docNo) || 1,
      docDate,
      customerName: customerName || "Walk-in Customer",
      mobileNumber,
      grossAmount: items.reduce((sum, i) => sum + (i.mrp * i.qty), 0),
      discountAmount: items.reduce((sum, i) => sum + i.discount, 0),
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
        amount: i.amount
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
        setCurrentPurId(data.purId);
        setFormMode(targetStatus === 'LOCKED' ? 'LOCKED' : 'VIEW');
        fetchHistory(); // Refresh history list
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
          message: data.message || 'Failed to save invoice to server.'
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
    }
  }, [currentPurId, companyId, companyCount, docNo, docDate, customerName, mobileNumber, items, fetchHistory]);

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
  }, [formMode, items.length, performLoadInvoice, saveToBackend]);

  const handleSaveInvoice = useCallback(() => {
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
  }, [formMode, saveToBackend]);

  const handleCompleteSale = useCallback(() => {
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
    saveToBackend('LOCKED');
  }, [formMode, items.length, saveToBackend]);

  // Keyboard Shortcuts (F2 New, F3 Load, F10 Complete, F12 Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') { e.preventDefault(); handleNewSale(); }
      if (e.key === 'F3') { e.preventDefault(); setIsHistoryOpen(true); }
      if (e.key === 'F10') { e.preventDefault(); handleCompleteSale(); }
      if (e.key === 'F12') { e.preventDefault(); handleSaveInvoice(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewSale, handleCompleteSale, handleSaveInvoice]);

  // State for Layout Toggle
  const [viewMode, setViewMode] = useState<'modern' | 'classic'>('modern');

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
  const netPayable = items.reduce((sum, item) => sum + item.amount, 0);

  // Tax breakdown estimation (assuming 5% GST split into 2.5% CGST and 2.5% SGST for demo)
  const subtotalExclTax = netPayable / 1.05;
  const cgstAmount = (netPayable - subtotalExclTax) / 2;
  const sgstAmount = cgstAmount;

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
      if (!docNo || !docNo.trim() || !docDate || !docDate.trim() || !customerName || !customerName.trim() || customerName.toLowerCase() === 'walk-in customer') {
        const isNameMissing = !customerName || !customerName.trim() || customerName.toLowerCase() === 'walk-in customer';
        setPopup({
          isOpen: true,
          type: 'warning',
          title: isNameMissing ? 'Enter Customer Name' : 'Missing Header Info',
          message: isNameMissing ? 'Please enter Customer Name first.' : 'Please enter Doc No and Date first.',
          subMessage: isNameMissing ? 'Customer name is required to scan items.' : 'Header details cannot be empty.'
        });
        return;
      }
      if (!barcodeInput.trim()) return;

      setIsScanningItem(true);
      try {
        const response = await fetch(`${API_BASE_URL}/product/scan/${barcodeInput}`);

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
            } catch (textErr) {}
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

        const newItem: LineItem = {
          id: Date.now().toString(),
          barcode: data.barcodedesc,
          sourceCode: data.barcodeSourceBarcode,
          productCode: data.productCode,
          color: data.colorName,
          isIndividual: data.productIndividualBarcode === "YES" || data.productIndividualBarcode === true,
          category: data.categoryDescription,
          size: data.barcodeSize,
          mrp: data.barcodeMrp,
          selPrice: data.barcodeSelPrice,
          discount: data.barcodeMrp - data.barcodeSelPrice,
          hsn: data.hsnCode,
          taxDesc: 'GST 5%',
          taxAmt: 0,
          qty: 1,
          amount: data.barcodeSelPrice
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
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          qty,
          amount: item.selPrice * qty
        };
      }
      return item;
    }));
  };

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
    handleUpdateQty
  };
};
