import { useEffect, useState } from 'react';
import {
  CalendarDays,
  CheckSquare,
  CircleDollarSign,
  Download,
  FileText,
  Loader2,
  Mail,
  MapPin,
  PackageSearch,
  Phone,
  Printer,
  Search,
  ShoppingBag,
  Square,
  Trash2,
  Truck,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

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

const getOrderNumber = (order) =>
  `SO-${
    String(order.id || '')
      .slice(-6)
      .toUpperCase() || '000000'
  }`;

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

export default function OrderManagement() {
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

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

  const generateInvoicePDF = (order) => {
    const customer = getCustomerInfo(order);
    const items = getOrderItems(order);
    const total = getOrderTotal(order);
    const pdf = new jsPDF();
    const dark = [17, 24, 39];
    const slate = [100, 116, 139];
    const light = [248, 250, 252];
    const border = [226, 232, 240];
    const accent = statusThemes[order.status]?.accent || [37, 99, 235];

    pdf.setFillColor(...dark);
    pdf.rect(0, 0, 210, 30, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Himalaya Crackers', 14, 19);

    pdf.setFontSize(9);
    pdf.text('Sales Order', 196, 12, { align: 'right' });
    pdf.setFontSize(14);
    pdf.text(getOrderNumber(order), 196, 20, { align: 'right' });

    pdf.setDrawColor(...border);
    pdf.roundedRect(14, 38, 88, 38, 4, 4);
    pdf.roundedRect(108, 38, 88, 38, 4, 4);

    pdf.setTextColor(...slate);
    pdf.setFontSize(9);
    pdf.text('Customer', 18, 46);
    pdf.text('Order Details', 112, 46);

    pdf.setTextColor(...dark);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(customer.name, 18, 54);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(...slate);
    pdf.text(pdf.splitTextToSize(customer.address, 76), 18, 61);
    pdf.text(customer.phone, 18, 72);
    pdf.text(customer.email, 18, 77);

    pdf.text('Order Date', 112, 54);
    pdf.text('Status', 112, 63);
    pdf.text('Amount', 112, 72);

    pdf.setTextColor(...dark);
    pdf.text(formatDate(order.createdAt), 153, 54, { align: 'left' });
    pdf.setTextColor(...accent);
    pdf.text(order.status || 'Pending', 153, 63, { align: 'left' });
    pdf.setTextColor(...dark);
    pdf.text(formatCurrency(total), 153, 72, { align: 'left' });

    autoTable(pdf, {
      startY: 88,
      head: [['Item', 'Qty', 'Rate', 'Amount']],
      body: items.map((item) => [
        item.name || 'Unnamed item',
        item.qty,
        formatCurrency(item.price),
        formatCurrency(item.total),
      ]),
      theme: 'grid',
      styles: {
        fontSize: 9,
        textColor: dark,
        lineColor: border,
        lineWidth: 0.2,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: light,
        textColor: dark,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
      },
      columnStyles: {
        1: { halign: 'center', cellWidth: 20 },
        2: { halign: 'right', cellWidth: 30 },
        3: { halign: 'right', cellWidth: 34 },
      },
    });

    const finalY = pdf.lastAutoTable?.finalY || 88;

    pdf.setDrawColor(...border);
    pdf.roundedRect(126, finalY + 10, 70, 30, 4, 4);
    pdf.setTextColor(...slate);
    pdf.text('Subtotal', 132, finalY + 20);
    pdf.text('Shipping', 132, finalY + 28);
    pdf.setTextColor(...dark);
    pdf.text(formatCurrency(total), 190, finalY + 20, { align: 'right' });
    pdf.text('Included', 190, finalY + 28, { align: 'right' });

    pdf.setFillColor(...light);
    pdf.roundedRect(126, finalY + 44, 70, 18, 4, 4, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.text('Grand Total', 132, finalY + 55);
    pdf.text(formatCurrency(total), 190, finalY + 55, { align: 'right' });

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...slate);
    pdf.text('Thank you for your business.', 14, 285);

    pdf.save(`${getOrderNumber(order)}.pdf`);
  };

  const handlePrintOrder = (order) => {
    const customer = getCustomerInfo(order);
    const items = getOrderItems(order);
    const total = getOrderTotal(order);
    const statusStyles = {
      Pending: 'background:#fff7ed;color:#c2410c;border:1px solid #fdba74;',
      Processing: 'background:#eff6ff;color:#1d4ed8;border:1px solid #93c5fd;',
      Shipped: 'background:#f5f3ff;color:#6d28d9;border:1px solid #c4b5fd;',
      Delivered: 'background:#ecfdf5;color:#047857;border:1px solid #86efac;',
      Cancel: 'background:#fef2f2;color:#b91c1c;border:1px solid #fca5a5;',
    };
    const statusInlineStyle =
      statusStyles[order.status] ||
      'background:#f8fafc;color:#334155;border:1px solid #cbd5e1;';
    const printWindow = window.open('', '_blank', 'width=1100,height=800');

    if (!printWindow) {
      toast.error('Please allow pop-ups to print the invoice');
      return;
    }

    const itemRows = items
      .map(
        (item) => `
          <tr>
            <td>${item.name || 'Unnamed item'}</td>
            <td style="text-align:center;">${item.qty}</td>
            <td style="text-align:right;">${formatCurrency(item.price)}</td>
            <td style="text-align:right;">${formatCurrency(item.total)}</td>
          </tr>
        `
      )
      .join('');

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${getOrderNumber(order)}</title>
          <style>
            body {
              margin: 0;
              padding: 32px;
              background: #f8fafc;
              font-family: Arial, sans-serif;
              color: #0f172a;
            }
            .sheet {
              max-width: 920px;
              margin: 0 auto;
              background: #fff;
              border: 1px solid #e2e8f0;
              border-radius: 24px;
              overflow: hidden;
            }
            .hero {
              background: linear-gradient(135deg, #0f172a, #1e3a8a);
              color: #fff;
              padding: 28px 32px;
              display: flex;
              justify-content: space-between;
              gap: 24px;
            }
            .hero h1 {
              margin: 0 0 6px;
              font-size: 28px;
            }
            .hero p {
              margin: 0;
              color: rgba(255,255,255,0.75);
            }
            .content {
              padding: 28px 32px 36px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 18px;
              margin-bottom: 24px;
            }
            .card {
              border: 1px solid #e2e8f0;
              border-radius: 18px;
              padding: 18px;
            }
            .label {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #64748b;
              margin-bottom: 10px;
            }
            .value {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            .muted {
              font-size: 14px;
              color: #475569;
              line-height: 1.6;
            }
            .status {
              display: inline-block;
              border: 1px solid #e2e8f0;
              border-radius: 999px;
              padding: 6px 12px;
              font-size: 12px;
              font-weight: 700;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }
            th {
              background: #f8fafc;
              color: #334155;
              text-align: left;
              padding: 12px 14px;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.06em;
            }
            td {
              border-top: 1px solid #e2e8f0;
              padding: 14px;
              font-size: 14px;
            }
            .totals {
              width: 320px;
              margin-left: auto;
              margin-top: 24px;
              border: 1px solid #e2e8f0;
              border-radius: 18px;
              padding: 18px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              color: #475569;
            }
            .grand-total {
              margin-top: 16px;
              padding-top: 14px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              font-size: 20px;
              font-weight: 700;
            }
            @media print {
              body {
                background: #fff;
                padding: 0;
              }
              .sheet {
                border: none;
                border-radius: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="hero">
              <div>
                <h1>Himalaya Crackers</h1>
                <p>Sales order preview</p>
              </div>
              <div>
                <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.08em; opacity:0.72; margin-bottom:8px;">Order</div>
                <div style="font-size:24px; font-weight:700;">${getOrderNumber(order)}</div>
              </div>
            </div>
            <div class="content">
              <div class="grid">
                <div class="card">
                  <div class="label">Customer</div>
                  <div class="value">${customer.name}</div>
                  <div class="muted">${customer.address}</div>
                  <div class="muted">${customer.phone}</div>
                  <div class="muted">${customer.email}</div>
                </div>
                <div class="card">
                  <div class="label">Order Details</div>
                  <div class="muted" style="margin-bottom:10px;">Date: ${formatDate(order.createdAt)}</div>
                  <div class="muted" style="margin-bottom:10px;">Amount: ${formatCurrency(total)}</div>
                  <span class="status" style="${statusInlineStyle}">${order.status || 'Pending'}</span>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align:center;">Qty</th>
                    <th style="text-align:right;">Rate</th>
                    <th style="text-align:right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
              <div class="totals">
                <div class="totals-row"><span>Subtotal</span><strong>${formatCurrency(total)}</strong></div>
                <div class="totals-row"><span>Shipping</span><strong>Included</strong></div>
                <div class="grand-total"><span>Grand Total</span><span>${formatCurrency(total)}</span></div>
              </div>
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
          <p className="mt-1 text-sm text-slate-500">
            Manage customer orders, dispatch status, and printable sales
            documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Export
          </button>
          <button className="rounded-md bg-[#0f6fff] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#0c5dd4]">
            New Sales Order
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Orders', value: orders.length, icon: ShoppingBag },
          { label: 'Open Orders', value: openOrders, icon: Truck },
          {
            label: 'Revenue',
            value: formatCurrency(totalRevenue),
            icon: CircleDollarSign,
          },
          { label: 'Items Sold', value: itemUnits, icon: PackageSearch },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-md border border-slate-200 bg-white px-4 py-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                <item.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4 md:px-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search order no, customer, phone or email"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition ${filter === status ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 border-b border-slate-200 xl:border-b-0 xl:border-r">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 md:px-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleVisibleSelection}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600"
                  aria-label={
                    allVisibleSelected
                      ? 'Clear visible selections'
                      : 'Select visible orders'
                  }
                >
                  {allVisibleSelected ? (
                    <CheckSquare size={16} />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
                <div>
                  <p className="font-medium text-slate-800">
                    {filteredOrders.length} records
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedOrders.length > 0
                      ? `${selectedOrders.length} selected`
                      : `${deliveredOrders} delivered orders in all records`}
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <CalendarDays size={15} className="text-slate-400" />
                <span>Last synced from Firestore</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-white">
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <th className="px-5 py-3">Sel</th>
                      <th className="px-5 py-3">Sales Order</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-5 py-16 text-center">
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
                          className={
                            isActive ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                          }
                        >
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => toggleOrderSelection(order.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600"
                              aria-label={`Select ${getOrderNumber(order)}`}
                            >
                              {selectedOrders.includes(order.id) ? (
                                <CheckSquare size={16} />
                              ) : (
                                <Square size={16} />
                              )}
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="text-left"
                            >
                              <p className="font-semibold text-slate-900">
                                {getOrderNumber(order)}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {getOrderItems(order).length} line items
                              </p>
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-slate-800">
                              {customer.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {customer.phone}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900">
                              {formatCurrency(total)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {customer.email}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={order.status || 'Pending'}
                              onChange={(event) =>
                                handleUpdateStatus(order.id, event.target.value)
                              }
                              className={`rounded-md border px-3 py-2 text-xs font-semibold outline-none transition ${statusTheme.badge}`}
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
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                              >
                                <FileText size={15} />
                                Open
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(order.id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                aria-label={`Delete ${getOrderNumber(order)}`}
                              >
                                <Trash2 size={15} />
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
                        <p className="text-sm text-slate-500">
                          {customer.phone}
                        </p>
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
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="bg-slate-50 xl:min-h-180">
            {activeOrder ? (
              <div className="h-full p-4 md:p-5">
                <div className="sticky top-5 space-y-4">
                  <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Selected Order
                      </p>
                      <h2 className="mt-1 text-xl font-semibold text-slate-900">
                        {getOrderNumber(activeOrder)}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Created on {formatDate(activeOrder.createdAt)}
                      </p>
                    </div>

                    <div className="space-y-4 px-4 py-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Status
                          </p>
                          <span
                            className={`mt-2 inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold ${statusThemes[activeOrder.status]?.badge || 'border-slate-200 bg-slate-50 text-slate-700'}`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${statusThemes[activeOrder.status]?.dot || 'bg-slate-400'}`}
                            ></span>
                            {activeOrder.status || 'Pending'}
                          </span>
                        </div>
                        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Total
                          </p>
                          <p className="mt-2 text-lg font-semibold text-slate-900">
                            {formatCurrency(getOrderTotal(activeOrder))}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 rounded-md border border-slate-200 bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Customer
                        </p>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {activeCustomer.name}
                          </p>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <MapPin size={15} className="mt-0.5 text-slate-400" />
                          <span>{activeCustomer.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={15} className="text-slate-400" />
                          <span>{activeCustomer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail size={15} className="text-slate-400" />
                          <span>{activeCustomer.email}</span>
                        </div>
                      </div>

                      <div className="space-y-3 rounded-md border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            Line Items
                          </p>
                          <p className="text-xs text-slate-500">
                            {activeItems.length} items
                          </p>
                        </div>
                        <div className="space-y-2">
                          {activeItems.map((item, index) => (
                            <div
                              key={`${item.id || item.name}-${index}`}
                              className="flex items-start justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3"
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-800">
                                  {item.name || 'Unnamed item'}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  Qty {item.qty} x {formatCurrency(item.price)}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-slate-900">
                                {formatCurrency(item.total)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-md border border-slate-200 bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          Document Actions
                        </p>
                        <div className="mt-3 grid gap-2">
                          <button
                            type="button"
                            onClick={() => generateInvoicePDF(activeOrder)}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0f6fff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c5dd4]"
                          >
                            <Download size={15} />
                            Download PDF
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePrintOrder(activeOrder)}
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            <Printer size={15} />
                            Print Template
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-80 items-center justify-center p-5">
                <div className="max-w-xs text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-white text-slate-400 shadow-sm">
                    <FileText size={18} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-900">
                    Select an order to view details
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    The selected sales order will appear here with export and
                    print actions.
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
