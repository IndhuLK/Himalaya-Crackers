import { useEffect, useState } from 'react';
import {
  ExternalLink,
  CalendarDays,
  CheckSquare,
  CircleDollarSign,
  Download,
  FileText,
  Loader2,
  PackageSearch,
  Plus,
  Printer,
  Search,
  ShoppingBag,
  Square,
  TrendingUp,
  Trash2,
  Truck,
  Percent,
  AlertCircle,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Link, useSearchParams } from 'react-router-dom';

import { db } from '../config/firebase';
import { useToast } from '../components/Toast';

const statusOptions = [
  'All',
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancel',
];

const statusThemes = {
  Pending: {
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
    dot: 'bg-orange-500',
    accent: [245, 158, 11],
  },
  Processing: {
    badge: 'border-sky-200 bg-sky-50 text-sky-700',
    dot: 'bg-sky-500',
    accent: [14, 165, 233],
  },
  Shipped: {
    badge: 'border-violet-200 bg-violet-50 text-violet-700',
    dot: 'bg-violet-500',
    accent: [139, 92, 246],
  },
  Delivered: {
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
    accent: [16, 185, 129],
  },
  Cancel: {
    badge: 'border-red-200 bg-red-50 text-red-700',
    dot: 'bg-red-500',
    accent: [239, 68, 68],
  },
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

const formatDocumentCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const generateRandomSuffix = () => {
  // Generate 4-digit random number (0000-9999)
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
};

const generateOrderNumber = () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2); // 26 for 2026
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 01-12
  const random = generateRandomSuffix(); // 4-digit random number
  return `ORD-${year}${month}-${random}`;
};

const generateInvoiceNumber = () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = generateRandomSuffix();
  return `INV-${year}${month}-${random}`;
};

const formatOrderNumber = (value) =>
  `SO-${String(value || 0).padStart(4, '0')}`;

const formatDate = (value) => {
  if (!value) return 'Not available';

  const parsed = value?.toDate ? value.toDate() : new Date(value);

  if (Number.isNaN(parsed.getTime())) return 'Not available';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};

const getCustomerInfo = (order) => {
  const customer =
    typeof order.customer === 'string'
      ? { name: order.customer }
      : order.customer || {};
  const address = [customer.address, customer.city, customer.pincode]
    .filter(Boolean)
    .join(', ');

  return {
    name: customer.name || 'Walk-in Customer',
    email: customer.email || 'No email added',
    phone: customer.mobile || 'No mobile added',
    address: address || 'Address not available',
  };
};

const getOrderItems = (order) =>
  (order.items || []).map((item) => ({
    ...item,
    qty: Number(item.qty || 0),
    price: Number(item.price || 0),
    total: Number(item.qty || 0) * Number(item.price || 0),
  }));

const getOrderTotal = (order) => {
  const computedTotal = getOrderItems(order).reduce(
    (sum, item) => sum + item.total,
    0
  );
  return Number(order.total || computedTotal || 0);
};

const migrateOrdersToNewFormat = async () => {
  try {
    const existingOrdersRef = collection(db, 'orders');
    const snapshot = await getDocs(existingOrdersRef);

    let updated = 0;
    const updates = [];

    snapshot.forEach((docSnapshot) => {
      const order = docSnapshot.data();
      // Only update if doesn't have new format order number
      if (!order.orderNumber || order.orderNumber.startsWith('SO-')) {
        const newOrderNumber = generateOrderNumber();
        updates.push(
          updateDoc(doc(db, 'orders', docSnapshot.id), {
            orderNumber: newOrderNumber,
          })
        );
        updated++;
      }
    });

    if (updates.length > 0) {
      await Promise.all(updates);
      console.log(`Migrated ${updated} orders to new format`);
      return updated;
    }
    return 0;
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};

export default function OrderManagement() {
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isMigrating, setIsMigrating] = useState(false);
  const linkedOrderId = searchParams.get('orderId');

  const handleMigrateOrders = async () => {
    if (
      !window.confirm(
        'Migrate all existing orders to new ORD-26MM-[RAND] format?'
      )
    )
      return;

    setIsMigrating(true);
    try {
      const count = await migrateOrdersToNewFormat();
      if (count > 0) {
        toast.success(`Updated ${count} orders to new format`);
      } else {
        toast.info('All orders already using new format');
      }
    } catch (error) {
      console.error(error);
      toast.error('Migration failed');
    } finally {
      setIsMigrating(false);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailableProducts(productList);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const orderList = snapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data(),
        }));

        setOrders(orderList);
        setLoading(false);
      },
      (error) => {
        console.error('Firebase Fetch Error:', error);
        setLoading(false);
        toast.error('Unable to load orders');
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const filteredOrders = orders.filter((order) => {
    const customer = getCustomerInfo(order);
    const searchValue = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !searchValue ||
      customer.name.toLowerCase().includes(searchValue) ||
      customer.email.toLowerCase().includes(searchValue) ||
      customer.phone.toLowerCase().includes(searchValue) ||
      getOrderNumber(order).toLowerCase().includes(searchValue) ||
      String(order.id || '')
        .toLowerCase()
        .includes(searchValue);
    const matchesFilter = filter === 'All' || order.status === filter;

    return matchesSearch && matchesFilter;
  });

  const allVisibleSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedOrders.includes(order.id));

  const totalRevenue = orders.reduce(
    (sum, order) => sum + getOrderTotal(order),
    0
  );
  const openOrders = orders.filter((order) =>
    ['Pending', 'Processing', 'Shipped'].includes(order.status)
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === 'Delivered'
  ).length;
  const itemUnits = orders.reduce(
    (sum, order) =>
      sum + getOrderItems(order).reduce((qtySum, item) => qtySum + item.qty, 0),
    0
  );
  const getOrderNumber = (order) => {
    if (order.orderNumber) return order.orderNumber;

    // Fallback: Generate consistent format based on order ID
    let createdDate = new Date();
    if (order.createdAt) {
      createdDate = order.createdAt?.toDate
        ? order.createdAt.toDate()
        : new Date(order.createdAt);
    }

    const year = String(createdDate.getFullYear()).slice(-2);
    const month = String(createdDate.getMonth() + 1).padStart(2, '0');

    // Generate consistent 4-digit suffix from order ID hash
    let hash = 0;
    for (let i = 0; i < order.id?.length; i++) {
      hash = (hash << 5) - hash + order.id.charCodeAt(i);
      hash |= 0;
    }
    const suffix = String(Math.abs(hash) % 10000).padStart(4, '0');
    return `ORD-${year}${month}-${suffix}`;
  };

  const createInvoiceRecord = async (order, source = 'pdf') => {
    const customer = getCustomerInfo(order);
    const total = getOrderTotal(order);

    if (order.invoiceGenerated && order.invoiceNumber) {
      return { invoiceNumber: order.invoiceNumber, isExisting: true };
    }

    if (order.id) {
      const existingInvoiceSnapshot = await getDocs(
        query(collection(db, 'invoices'), where('orderId', '==', order.id))
      );

      if (!existingInvoiceSnapshot.empty) {
        const existingInvoiceDoc = existingInvoiceSnapshot.docs[0];
        const existingInvoiceData = existingInvoiceDoc.data();
        const existingInvoiceNumber =
          existingInvoiceData.invoiceNumber || order.invoiceNumber;

        await updateDoc(doc(db, 'orders', order.id), {
          invoiceGenerated: true,
          invoiceNumber: existingInvoiceNumber,
          invoiceId: existingInvoiceDoc.id,
        });

        return { invoiceNumber: existingInvoiceNumber, isExisting: true };
      }
    }

    const invoiceNumber = order.invoiceNumber || generateInvoiceNumber();
    const invoiceRef = await addDoc(collection(db, 'invoices'), {
      invoiceNumber,
      orderId: order.id || null,
      orderNumber: getOrderNumber(order),
      customerName: customer.name,
      customerPhone: customer.phone,
      total,
      status: order.status || 'Pending',
      source,
      createdAt: serverTimestamp(),
    });

    if (order.id) {
      await updateDoc(doc(db, 'orders', order.id), {
        invoiceGenerated: true,
        invoiceNumber,
        invoiceId: invoiceRef.id,
      });
    }

    return { invoiceNumber, isExisting: false };
  };

  useEffect(() => {
    if (!linkedOrderId || orders.length === 0) return;

    const linkedOrder = orders.find((order) => order.id === linkedOrderId);
    if (linkedOrder) {
      setFilter('All');
      setSearchTerm('');
      setSelectedOrder(linkedOrder);
    }
  }, [linkedOrderId, orders]);
  const activeOrder =
    filteredOrders.find((order) => order.id === selectedOrder?.id) ||
    filteredOrders[0] ||
    null;
  const activeCustomer = activeOrder ? getCustomerInfo(activeOrder) : null;
  const activeItems = activeOrder ? getOrderItems(activeOrder) : [];

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      toast.success('Order status updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await deleteDoc(doc(db, 'orders', id));
      setSelectedOrders((prev) => prev.filter((orderId) => orderId !== id));
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
      toast.success('Order deleted');
    } catch (error) {
      console.error(error);
      toast.error('Error deleting order');
    }
  };

  const toggleOrderSelection = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleVisibleSelection = () => {
    if (allVisibleSelected) {
      setSelectedOrders((prev) =>
        prev.filter((id) => !filteredOrders.some((order) => order.id === id))
      );
      return;
    }

    setSelectedOrders((prev) => [
      ...new Set([...prev, ...filteredOrders.map((order) => order.id)]),
    ]);
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.warning('No data to export');
      return;
    }

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'Status',
      'Total Amount',
      'Items',
    ];
    const csvData = orders.map((order) => {
      const customer = getCustomerInfo(order);
      const items = getOrderItems(order)
        .map((item) => `${item.name}(${item.qty})`)
        .join('; ');
      return [
        getOrderNumber(order),
        formatDate(order.createdAt),
        customer.name,
        customer.phone,
        customer.email,
        order.status || 'Pending',
        getOrderTotal(order),
        `"${items}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `sales_orders_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported to CSV');
  };

  const handleSaveOrder = async (orderData) => {
    setIsSaving(true);
    try {
      const newOrderNumber = generateOrderNumber();

      await addDoc(collection(db, 'orders'), {
        ...orderData,
        orderNumber: newOrderNumber,
        createdAt: serverTimestamp(),
        status: 'Pending',
      });
      setShowNewOrderModal(false);
      toast.success('Sales Order Created Successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };

  const generateInvoicePDF = async (order) => {
    const customer = getCustomerInfo(order);
    const items = getOrderItems(order);
    const total = getOrderTotal(order);
    let invoiceNumber = generateInvoiceNumber();

    try {
      const invoiceResult = await createInvoiceRecord(order, 'pdf');
      invoiceNumber = invoiceResult.invoiceNumber;
      if (invoiceResult.isExisting) {
        toast.info(
          'Invoice already exists for this order. Reusing same number.'
        );
      }
    } catch (error) {
      console.error(error);
      toast.warning('Invoice generated, but failed to save in invoice tab');
    }

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Professional Colors
    const darkGray = [31, 41, 55];
    const lightGray = [156, 163, 175];
    const borderGray = [209, 213, 219];
    const white = [255, 255, 255];
    const text = [17, 24, 39];

    // TOP BORDER - Professional accent line
    pdf.setDrawColor(31, 41, 55);
    pdf.setLineWidth(2);
    pdf.line(0, 8, 210, 8);

    // HEADER - Company Info
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(...text);
    pdf.text('HIMALAYA CRACKERS', 14, 20);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...lightGray);
    pdf.text('Premium Quality Crackers & Fireworks', 14, 25);

    // INVOICE TITLE
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(...text);
    pdf.text('INVOICE', 180, 20, { align: 'right' });

    // Invoice Number
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...lightGray);
    pdf.text('Invoice No.', 180, 26, { align: 'right' });
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(...text);
    pdf.text(invoiceNumber, 180, 31, { align: 'right' });

    // DIVIDER
    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.3);
    pdf.line(14, 38, 196, 38);

    // BILLING SECTION
    let yPos = 45;

    // Bill To
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...text);
    pdf.text('BILL TO:', 14, yPos);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(...text);
    pdf.text(customer.name, 14, yPos + 6);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...text);
    const addressLines = pdf.splitTextToSize(customer.address, 80);
    pdf.text(addressLines, 14, yPos + 11);

    let addressY = yPos + 11 + addressLines.length * 3.5;
    pdf.text(customer.phone, 14, addressY);
    pdf.text(customer.email, 14, addressY + 5);

    // INVOICE DETAILS - Right Column
    const detailX = 130;
    const details = [
      ['Date:', formatDate(order.createdAt)],
      ['Status:', order.status || 'Pending'],
      ['Order No:', getOrderNumber(order) || 'N/A'],
    ];

    details.forEach((detail, idx) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(...lightGray);
      pdf.text(detail[0], detailX, yPos + idx * 5.5);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(...text);
      pdf.text(detail[1], detailX + 20, yPos + idx * 5.5);
    });

    // ITEMS TABLE
    yPos = 85;

    autoTable(pdf, {
      startY: yPos,
      head: [['Item Description', 'Qty', 'Unit Price', 'Amount']],
      body: items.map((item) => [
        item.name || 'Unnamed item',
        String(item.qty),
        formatDocumentCurrency(item.price),
        formatDocumentCurrency(item.total),
      ]),
      theme: 'plain',
      styles: {
        fontSize: 8.5,
        textColor: text,
        font: 'helvetica',
        cellPadding: 4,
        lineColor: borderGray,
        lineWidth: 0.3,
      },
      headStyles: {
        textColor: white,
        fillColor: darkGray,
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'left',
        lineColor: darkGray,
      },
      bodyStyles: {
        lineColor: borderGray,
      },
      columnStyles: {
        0: { cellWidth: 90, halign: 'left' },
        1: { halign: 'center', cellWidth: 18 },
        2: { halign: 'right', cellWidth: 35 },
        3: { halign: 'right', cellWidth: 35 },
      },
    });

    // TOTALS SECTION
    const finalY = pdf.lastAutoTable?.finalY || 140;
    const totalsX = 130;
    const totalsY = finalY + 8;

    // Subtotal Line
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...text);
    pdf.text('Subtotal:', totalsX, totalsY);
    pdf.text(formatDocumentCurrency(total), 196, totalsY, { align: 'right' });

    // Shipping Line
    pdf.text('Shipping:', totalsX, totalsY + 5);
    pdf.text('FREE', 196, totalsY + 5, { align: 'right' });

    // Tax Line
    pdf.text('Tax:', totalsX, totalsY + 10);
    pdf.text('Included', 196, totalsY + 10, { align: 'right' });

    // TOTAL DIVIDER
    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.3);
    pdf.line(totalsX, totalsY + 14, 196, totalsY + 14);

    // GRAND TOTAL
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(...darkGray);
    pdf.text('TOTAL DUE:', totalsX, totalsY + 20);
    pdf.setFontSize(12);
    pdf.text(formatDocumentCurrency(total), 196, totalsY + 20, {
      align: 'right',
    });

    // FOOTER DIVIDER
    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.3);
    pdf.line(14, 260, 196, 260);

    // FOOTER
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...lightGray);
    pdf.text(
      'Payment Terms: 30 days net | Delivery: 5-7 working days | Thank you for your business',
      105,
      267,
      { align: 'center' }
    );

    pdf.save(`${invoiceNumber}.pdf`);
  };

  const handlePrintOrder = async (order) => {
    const customer = getCustomerInfo(order);
    const items = getOrderItems(order);
    const total = getOrderTotal(order);
    let invoiceNumber = generateInvoiceNumber();

    const printWindow = window.open('', '_blank', 'width=1100,height=900');

    if (!printWindow) {
      toast.error('Please allow pop-ups to print the invoice');
      return;
    }

    try {
      const invoiceResult = await createInvoiceRecord(order, 'print');
      invoiceNumber = invoiceResult.invoiceNumber;
      if (invoiceResult.isExisting) {
        toast.info(
          'Invoice already exists for this order. Reusing same number.'
        );
      }
    } catch (error) {
      console.error(error);
      toast.warning('Invoice opened, but failed to save in invoice tab');
    }

    const itemRows = items
      .map(
        (item, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
            <td style="padding: 12px; border-bottom: 1px solid #d1d5db; font-size: 13px; color: #374151;">${item.name || 'Unnamed item'}</td>
            <td style="padding: 12px; border-bottom: 1px solid #d1d5db; text-align: center; font-size: 13px; color: #374151;">${item.qty}</td>
            <td style="padding: 12px; border-bottom: 1px solid #d1d5db; text-align: right; font-size: 13px; color: #374151;">${formatDocumentCurrency(item.price)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #d1d5db; text-align: right; font-size: 13px; color: #374151; font-weight: 600;">${formatDocumentCurrency(item.total)}</td>
          </tr>
        `
      )
      .join('');

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              color: #1f2937;
              background: #ffffff;
              padding: 20px;
              line-height: 1.5;
            }

            .container {
              max-width: 900px;
              margin: 0 auto;
              background: #ffffff;
            }

            /* TOP ACCENT LINE */
            .accent-line {
              height: 3px;
              background: #1f2937;
              margin-bottom: 30px;
            }

            /* HEADER */
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #d1d5db;
            }

            .header-left h1 {
              font-size: 28px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 4px;
            }

            .header-left p {
              font-size: 13px;
              color: #6b7280;
            }

            .header-right {
              text-align: right;
            }

            .header-right h2 {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 6px;
            }

            .header-right .order-label {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 2px;
            }

            .header-right .order-number {
              font-size: 14px;
              font-weight: 600;
              color: #1f2937;
            }

            /* INFO GRID */
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
              page-break-inside: avoid;
            }

            .info-box h3 {
              font-size: 11px;
              text-transform: uppercase;
              color: #1f2937;
              font-weight: 700;
              letter-spacing: 0.5px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #d1d5db;
            }

            .info-box p {
              font-size: 13px;
              color: #374151;
              line-height: 1.6;
              margin-bottom: 4px;
            }

            .info-row {
              margin-top: 8px;
              padding-top: 8px;
              border-top: 1px solid #d1d5db;
            }

            .info-label {
              font-size: 11px;
              text-transform: uppercase;
              color: #6b7280;
              font-weight: 600;
              margin-bottom: 2px;
            }

            .info-value {
              font-size: 13px;
              color: #1f2937;
              font-weight: 500;
            }

            /* TABLE */
            .table-section {
              margin-bottom: 30px;
            }

            .table-section h3 {
              font-size: 11px;
              text-transform: uppercase;
              color: #1f2937;
              font-weight: 700;
              letter-spacing: 0.5px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #d1d5db;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              page-break-inside: auto;
            }

            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }

            thead {
              display: table-header-group;
            }

            table thead {
              background: #1f2937;
              color: white;
            }

            table th {
              padding: 12px;
              text-align: left;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }

            table th:nth-child(2),
            table th:nth-child(3),
            table th:nth-child(4) {
              text-align: right;
            }

            table td {
              page-break-inside: avoid;
            }

            /* TOTALS */
            .totals-section {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 30px;
              page-break-inside: avoid;
            }

            .totals-box {
              width: 280px;
              border: 1px solid #d1d5db;
            }

            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 15px;
              border-bottom: 1px solid #d1d5db;
              font-size: 13px;
            }

            .total-row .label {
              color: #6b7280;
              font-weight: 500;
            }

            .total-row .value {
              color: #1f2937;
              font-weight: 600;
            }

            .grand-total {
              display: flex;
              justify-content: space-between;
              padding: 14px 15px;
              background: #1f2937;
              color: white;
              font-size: 14px;
              font-weight: 700;
            }

            /* FOOTER */
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #d1d5db;
              text-align: center;
              page-break-inside: avoid;
            }

            .footer p {
              font-size: 12px;
              color: #6b7280;
              line-height: 1.6;
              margin-bottom: 4px;
            }

            /* PRINT STYLES */
            @media print {
              body {
                padding: 0;
                background: white;
                margin: 0;
              }

              .container {
                box-shadow: none;
                margin: 0;
                padding: 15px;
                width: 100%;
                max-width: 100%;
              }

              @page {
                margin: 10mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- ACCENT LINE -->
            <div class="accent-line"></div>

            <!-- HEADER -->
            <div class="header">
              <div class="header-left">
                <h1>Himalaya Crackers</h1>
                <p>Premium Quality Crackers & Fireworks</p>
              </div>
              <div class="header-right">
                <h2>INVOICE</h2>
                <div class="order-label">Invoice No.</div>
                <div class="order-number">${invoiceNumber}</div>
              </div>
            </div>

            <!-- INFO GRID -->
            <div class="info-grid">
              <div class="info-box">
                <h3>Bill To</h3>
                <p><strong>${customer.name}</strong></p>
                <p>${customer.address}</p>
                <p>${customer.phone}</p>
                <p>${customer.email}</p>
              </div>

              <div class="info-box">
                <h3>Order Details</h3>
                <div class="info-row">
                  <div class="info-label">Order Date</div>
                  <div class="info-value">${formatDate(order.createdAt)}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Status</div>
                  <div class="info-value">${order.status || 'Pending'}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Order No</div>
                  <div class="info-value">${getOrderNumber(order) || 'N/A'}</div>
                </div>
              </div>
            </div>

            <!-- TABLE -->
            <div class="table-section">
              <h3>Order Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </div>

            <!-- TOTALS -->
            <div class="totals-section">
              <div class="totals-box">
                <div class="total-row">
                  <span class="label">Subtotal</span>
                  <span class="value">${formatDocumentCurrency(total)}</span>
                </div>
                <div class="total-row">
                  <span class="label">Shipping</span>
                  <span class="value">FREE</span>
                </div>
                <div class="total-row">
                  <span class="label">Tax</span>
                  <span class="value">Included</span>
                </div>
                <div class="grand-total">
                  <span>TOTAL DUE</span>
                  <span>${formatDocumentCurrency(total)}</span>
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="footer">
              <p><strong>Payment Terms:</strong> 30 days net</p>
              <p><strong>Delivery:</strong> 5-7 working days</p>
              <p>Thank you for your business. For queries, contact: info@himalayacrackers.com</p>
            </div>
          </div>

          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="animate-spin text-blue-600" size={18} />
          Loading sales orders...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Sales</span>
            <span>/</span>
            <span className="text-slate-700">Sales Orders</span>
          </div>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-slate-900">
            Sales Orders
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage customer orders, track shipments, and handle sales documents
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleMigrateOrders}
            disabled={isMigrating}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100 hover:border-amber-300 disabled:opacity-50"
            title="Update existing orders to new ORD-26MM-[RAND] format"
          >
            {isMigrating ? 'Migrating...' : 'Migrate Orders'}
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Orders',
            value: orders.length,
            icon: ShoppingBag,
            bg: 'bg-blue-50',
            icon_color: 'text-blue-600',
          },
          {
            label: 'Open Orders',
            value: openOrders,
            icon: Truck,
            bg: 'bg-amber-50',
            icon_color: 'text-amber-600',
          },
          {
            label: 'Revenue',
            value: formatCurrency(totalRevenue),
            icon: CircleDollarSign,
            bg: 'bg-emerald-50',
            icon_color: 'text-emerald-600',
          },
          {
            label: 'Delivered',
            value: deliveredOrders,
            icon: Truck,
            bg: 'bg-green-50',
            icon_color: 'text-green-600',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2.5 text-3xl font-bold text-slate-900">
                  {item.value}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.bg}`}
              >
                <item.icon size={20} className={item.icon_color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4 md:px-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-lg">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search order number, customer name, email or phone..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {statusOptions.map((status) => {
                const count =
                  status === 'All'
                    ? orders.length
                    : orders.filter((order) => order.status === status).length;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilter(status)}
                    className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition whitespace-nowrap ${
                      filter === status
                        ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {status}{' '}
                    <span className="inline-block ml-1 w-4 text-right font-semibold text-xs">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-linear-to-r from-slate-50 to-white px-4 py-4 text-sm text-slate-600 md:px-5">
            <div>
              <p className="font-semibold text-slate-800">
                {filteredOrders.length} records
              </p>
              <p className="text-xs text-slate-500">
                {deliveredOrders} delivered in total
              </p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <CalendarDays size={15} className="text-slate-400" />
              <span className="text-xs text-slate-400">Real-time</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr className="text-left text-xs font-semibold uppercase tracking-widest text-slate-600">
                    <th className="px-5 py-3.5">Order ID</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-5 py-16 text-center">
                        <div className="mx-auto max-w-sm space-y-2">
                          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                            <PackageSearch size={18} />
                          </div>
                          <p className="text-sm font-medium text-slate-900">
                            No sales orders found
                          </p>
                          <p className="text-sm text-slate-500">
                            Change the filter or search text to continue.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {filteredOrders.map((order) => {
                    const customer = getCustomerInfo(order);
                    const total = getOrderTotal(order);
                    const statusTheme = statusThemes[order.status] || {
                      badge: 'border-slate-200 bg-slate-50 text-slate-700',
                      dot: 'bg-slate-400',
                    };
                    const isActive = activeOrder?.id === order.id;

                    return (
                      <tr
                        key={order.id}
                        className={`transition ${
                          isActive
                            ? 'bg-blue-50 hover:bg-blue-100'
                            : 'hover:bg-slate-50'
                        } border-b border-slate-100`}
                      >
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="text-left hover:opacity-75 transition"
                          >
                            <p className="font-bold text-slate-900">
                              {getOrderNumber(order)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {getOrderItems(order).length} items
                            </p>
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-slate-800">
                              {customer.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {customer.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-bold text-slate-900">
                              {formatCurrency(total)}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {customer.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={order.status || 'Pending'}
                            onChange={(event) =>
                              handleUpdateStatus(order.id, event.target.value)
                            }
                            className={`rounded-lg border px-3 py-2 text-xs font-semibold outline-none transition cursor-pointer ${statusTheme.badge}`}
                          >
                            {statusOptions
                              .filter((status) => status !== 'All')
                              .map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => generateInvoicePDF(order)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition"
                              title="Generate Invoice"
                            >
                              <FileText size={14} />
                              <span className="hidden lg:inline">
                                Generate Invoice
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintOrder(order)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                              title="Print"
                            >
                              <Printer size={14} />
                              <span className="hidden lg:inline">Print</span>
                            </button>
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                              title="View Details"
                            >
                              <ExternalLink size={14} />
                              <span className="hidden lg:inline">View</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                              aria-label={`Delete ${getOrderNumber(order)}`}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-3 p-4 md:hidden">
            {filteredOrders.length === 0 && (
              <div className="rounded-md border border-slate-200 bg-white p-8 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                  <PackageSearch size={18} />
                </div>
                <p className="text-sm font-medium text-slate-900">
                  No sales orders found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try a different search or status.
                </p>
              </div>
            )}

            {filteredOrders.map((order) => {
              const customer = getCustomerInfo(order);
              const total = getOrderTotal(order);
              const statusTheme = statusThemes[order.status] || {
                badge: 'border-slate-200 bg-slate-50 text-slate-700',
                dot: 'bg-slate-400',
              };

              return (
                <div
                  key={order.id}
                  className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="text-left"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {getOrderNumber(order)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleOrderSelection(order.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600"
                    >
                      {selectedOrders.includes(order.id) ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {customer.name}
                      </p>
                      <p className="text-sm text-slate-500">{customer.phone}</p>
                    </div>
                    <div className="flex items-center justify-between border border-slate-200 bg-slate-50 px-3 py-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          Amount
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                          {formatCurrency(total)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold ${statusTheme.badge}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${statusTheme.dot}`}
                        ></span>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => generateInvoicePDF(order)}
                        className="flex-1 min-w-max inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition"
                        title="Generate Invoice"
                      >
                        <FileText size={14} />
                        Generate Invoice
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePrintOrder(order)}
                        className="flex-1 min-w-max inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                        title="Print"
                      >
                        <Printer size={14} />
                        Print
                      </button>
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="flex-1 min-w-max inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                        title="View Details"
                      >
                        <ExternalLink size={14} />
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {showNewOrderModal && (
        <NewOrderModal
          onClose={() => setShowNewOrderModal(false)}
          onSave={handleSaveOrder}
          products={availableProducts}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

function NewOrderModal({ onClose, onSave, products, isSaving }) {
  const [customer, setCustomer] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchProduct, setSearchProduct] = useState('');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.category.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const addItem = (product) => {
    const existing = selectedItems.find((item) => item.id === product.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          id: product.id,
          name: product.name,
          price: product.ourPrice,
          qty: 1,
        },
      ]);
    }
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id ? { ...item, qty: newQty } : item
      )
    );
  };

  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleSave = () => {
    if (!customer.name) return alert('Customer name is required');
    if (selectedItems.length === 0) return alert('Add at least one item');
    onSave({
      customer,
      items: selectedItems,
      total,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">
            Create New Sales Order
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Customer Details
              </h3>
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={customer.mobile}
                  onChange={(e) =>
                    setCustomer({ ...customer, mobile: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                />
                <textarea
                  placeholder="Full Address"
                  rows="2"
                  className="w-full px-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Add Products
              </h3>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
              </div>
              <div className="border border-slate-100 rounded-lg max-h-48 overflow-y-auto divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        ₹{product.ourPrice}
                      </p>
                    </div>
                    <button
                      onClick={() => addItem(product)}
                      className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Selected Items
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedItems.map((item) => (
                    <tr key={item.id} className="bg-white">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-6 h-6 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        ₹{item.price}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        ₹{item.price * item.qty}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {selectedItems.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-8 text-center text-slate-400"
                      >
                        No items added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Grand Total
            </p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{total.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-200 bg-white text-slate-700 rounded-md font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 disabled:bg-blue-400"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                'Save Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
