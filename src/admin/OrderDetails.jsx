import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Printer,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { useToast } from '../components/Toast';

const statusThemes = {
  Pending: 'border-orange-200 bg-orange-50 text-orange-700',
  Processing: 'border-sky-200 bg-sky-50 text-sky-700',
  Shipped: 'border-violet-200 bg-violet-50 text-violet-700',
  Delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Cancel: 'border-red-200 bg-red-50 text-red-700',
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

const formatDocumentCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const generateRandomSuffix = () =>
  String(Math.floor(Math.random() * 10000)).padStart(4, '0');

const generateInvoiceNumber = () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `INV-${year}${month}-${generateRandomSuffix()}`;
};

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
    typeof order?.customer === 'string'
      ? { name: order.customer }
      : order?.customer || {};
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
  (order?.items || []).map((item) => ({
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
  return Number(order?.total || computedTotal || 0);
};

const getOrderNumber = (order) => {
  if (!order) return 'N/A';
  if (order.orderNumber) return order.orderNumber;

  let createdDate = new Date();
  if (order.createdAt) {
    createdDate = order.createdAt?.toDate
      ? order.createdAt.toDate()
      : new Date(order.createdAt);
  }

  const year = String(createdDate.getFullYear()).slice(-2);
  const month = String(createdDate.getMonth() + 1).padStart(2, '0');

  let hash = 0;
  for (let i = 0; i < order.id?.length; i++) {
    hash = (hash << 5) - hash + order.id.charCodeAt(i);
    hash |= 0;
  }
  const suffix = String(Math.abs(hash) % 10000).padStart(4, '0');
  return `ORD-${year}${month}-${suffix}`;
};

export default function OrderDetails() {
  const { orderId } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'orders', orderId),
      (snapshot) => {
        if (!snapshot.exists()) {
          setOrder(null);
          setLoading(false);
          return;
        }

        setOrder({ id: snapshot.id, ...snapshot.data() });
        setLoading(false);
      },
      () => {
        setOrder(null);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  const customer = useMemo(() => getCustomerInfo(order), [order]);
  const items = useMemo(() => getOrderItems(order), [order]);
  const total = useMemo(() => getOrderTotal(order), [order]);

  const createInvoiceRecord = async (activeOrder, source = 'pdf') => {
    if (activeOrder.invoiceGenerated && activeOrder.invoiceNumber) {
      return { invoiceNumber: activeOrder.invoiceNumber, isExisting: true };
    }

    const existingInvoiceSnapshot = await getDocs(
      query(collection(db, 'invoices'), where('orderId', '==', activeOrder.id))
    );

    if (!existingInvoiceSnapshot.empty) {
      const existingInvoiceDoc = existingInvoiceSnapshot.docs[0];
      const existingInvoiceData = existingInvoiceDoc.data();
      const existingInvoiceNumber =
        existingInvoiceData.invoiceNumber || activeOrder.invoiceNumber;

      await updateDoc(doc(db, 'orders', activeOrder.id), {
        invoiceGenerated: true,
        invoiceNumber: existingInvoiceNumber,
        invoiceId: existingInvoiceDoc.id,
      });

      return { invoiceNumber: existingInvoiceNumber, isExisting: true };
    }

    const invoiceNumber = activeOrder.invoiceNumber || generateInvoiceNumber();
    const invoiceRef = await addDoc(collection(db, 'invoices'), {
      invoiceNumber,
      orderId: activeOrder.id,
      orderNumber: getOrderNumber(activeOrder),
      customerName: customer.name,
      customerPhone: customer.phone,
      total,
      status: activeOrder.status || 'Pending',
      source,
      createdAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'orders', activeOrder.id), {
      invoiceGenerated: true,
      invoiceNumber,
      invoiceId: invoiceRef.id,
    });

    return { invoiceNumber, isExisting: false };
  };

  const downloadInvoicePDF = async () => {
    if (!order) return;

    let invoiceNumber = generateInvoiceNumber();
    try {
      const invoiceResult = await createInvoiceRecord(order, 'pdf');
      invoiceNumber = invoiceResult.invoiceNumber;
      if (invoiceResult.isExisting) {
        toast.info('Existing invoice number reused for this order.');
      }
    } catch (error) {
      console.error(error);
      toast.warning('Invoice downloaded, but failed to save invoice record.');
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const darkGray = [31, 41, 55];
    const text = [31, 41, 55];
    const muted = [107, 114, 128];
    const borderGray = [209, 213, 219];
    const rowAlt = [249, 250, 251];

    pdf.setDrawColor(...darkGray);
    pdf.setLineWidth(1.6);
    pdf.line(14, 12, 196, 12);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(...text);
    pdf.text('Himalaya Crackers', 14, 24);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...muted);
    pdf.text('Premium Quality Crackers & Fireworks', 14, 29);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.setTextColor(...text);
    pdf.text('INVOICE', 196, 23, { align: 'right' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...muted);
    pdf.text('Invoice No.', 196, 28, { align: 'right' });
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(...text);
    pdf.text(invoiceNumber, 196, 33, { align: 'right' });

    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.3);
    pdf.line(14, 37, 196, 37);

    const boxY = 42;
    const boxH = 40;
    pdf.setDrawColor(...borderGray);
    pdf.rect(14, boxY, 88, boxH);
    pdf.rect(108, boxY, 88, boxH);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...text);
    pdf.text('BILL TO', 17, boxY + 6);
    pdf.setDrawColor(...borderGray);
    pdf.line(17, boxY + 8, 99, boxY + 8);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(customer.name, 17, boxY + 14);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...text);
    const addressLines = pdf.splitTextToSize(customer.address, 78);
    pdf.text(addressLines, 17, boxY + 19);
    const addressY = boxY + 19 + addressLines.length * 3.6;
    pdf.text(customer.phone, 17, Math.min(addressY, boxY + 33));
    pdf.text(customer.email, 17, Math.min(addressY + 4, boxY + 37));

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...text);
    pdf.text('ORDER DETAILS', 111, boxY + 6);
    pdf.line(111, boxY + 8, 193, boxY + 8);

    const details = [
      ['Order Date', formatDate(order.createdAt)],
      ['Status', order.status || 'Pending'],
      ['Order No', getOrderNumber(order)],
    ];
    details.forEach((detail, idx) => {
      const y = boxY + 14 + idx * 8;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.setTextColor(...muted);
      pdf.text(detail[0], 111, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(...text);
      pdf.text(detail[1], 111, y + 3.8);
    });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...text);
    pdf.text('ORDER ITEMS', 14, 90);
    pdf.setDrawColor(...borderGray);
    pdf.line(14, 92, 196, 92);

    autoTable(pdf, {
      startY: 95,
      head: [['Item Description', 'Qty', 'Unit Price', 'Amount']],
      body: items.map((item) => [
        item.name || 'Unnamed item',
        String(item.qty),
        formatDocumentCurrency(item.price),
        formatDocumentCurrency(item.total),
      ]),
      theme: 'grid',
      styles: {
        fontSize: 8,
        textColor: text,
        font: 'helvetica',
        cellPadding: 3.2,
        lineColor: borderGray,
        lineWidth: 0.2,
      },
      headStyles: {
        textColor: [255, 255, 255],
        fillColor: darkGray,
        fontStyle: 'bold',
        fontSize: 7.5,
        halign: 'left',
        lineColor: darkGray,
      },
      alternateRowStyles: {
        fillColor: rowAlt,
      },
      columnStyles: {
        0: { cellWidth: 92, halign: 'left' },
        1: { halign: 'center', cellWidth: 18 },
        2: { halign: 'right', cellWidth: 34 },
        3: { halign: 'right', cellWidth: 34 },
      },
    });

    const finalY = pdf.lastAutoTable?.finalY || 150;
    const totalsY = finalY + 7;
    const boxX = 132;
    const boxW = 64;

    pdf.setDrawColor(...borderGray);
    pdf.rect(boxX, totalsY, boxW, 20);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(...muted);
    pdf.text('Subtotal', boxX + 3, totalsY + 5);
    pdf.text(formatDocumentCurrency(total), boxX + boxW - 3, totalsY + 5, {
      align: 'right',
    });
    pdf.text('Shipping', boxX + 3, totalsY + 10);
    pdf.text('FREE', boxX + boxW - 3, totalsY + 10, { align: 'right' });
    pdf.text('Tax', boxX + 3, totalsY + 15);
    pdf.text('Included', boxX + boxW - 3, totalsY + 15, { align: 'right' });

    pdf.setFillColor(...darkGray);
    pdf.rect(boxX, totalsY + 20, boxW, 8, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.text('TOTAL DUE', boxX + 3, totalsY + 25.3);
    pdf.text(formatDocumentCurrency(total), boxX + boxW - 3, totalsY + 25.3, {
      align: 'right',
    });

    pdf.setDrawColor(...borderGray);
    pdf.setLineWidth(0.3);
    pdf.line(14, 260, 196, 260);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.2);
    pdf.setTextColor(...muted);
    pdf.text('Payment Terms: 30 days net', 105, 266, { align: 'center' });
    pdf.text('Delivery: 5-7 working days', 105, 270, { align: 'center' });
    pdf.text(
      'Thank you for your business. For queries, contact: info@himalayacrackers.com',
      105,
      274,
      { align: 'center' }
    );

    pdf.save(`${invoiceNumber}.pdf`);
  };

  const printInvoice = async () => {
    if (!order) return;

    let invoiceNumber = generateInvoiceNumber();
    try {
      const invoiceResult = await createInvoiceRecord(order, 'print');
      invoiceNumber = invoiceResult.invoiceNumber;
      if (invoiceResult.isExisting) {
        toast.info('Existing invoice number reused for this order.');
      }
    } catch (error) {
      console.error(error);
      toast.warning('Invoice opened, but failed to save invoice record.');
    }

    const printWindow = window.open('', '_blank', 'width=1100,height=900');

    if (!printWindow) {
      toast.error('Please allow pop-ups to print the invoice');
      return;
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
            * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; background: #ffffff; padding: 20px; line-height: 1.5; }
            .container { max-width: 900px; margin: 0 auto; background: #ffffff; }
            .accent-line { height: 3px; background: #1f2937; margin-bottom: 30px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #d1d5db; }
            .header-left h1 { font-size: 28px; font-weight: 600; color: #1f2937; margin-bottom: 4px; }
            .header-left p { font-size: 13px; color: #6b7280; }
            .header-right { text-align: right; }
            .header-right h2 { font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 6px; }
            .header-right .order-label { font-size: 12px; color: #6b7280; margin-bottom: 2px; }
            .header-right .order-number { font-size: 14px; font-weight: 600; color: #1f2937; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; page-break-inside: avoid; }
            .info-box h3 { font-size: 11px; text-transform: uppercase; color: #1f2937; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #d1d5db; }
            .info-box p { font-size: 13px; color: #374151; line-height: 1.6; margin-bottom: 4px; }
            .info-row { margin-top: 8px; padding-top: 8px; border-top: 1px solid #d1d5db; }
            .info-label { font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 600; margin-bottom: 2px; }
            .info-value { font-size: 13px; color: #1f2937; font-weight: 500; }
            .table-section { margin-bottom: 30px; }
            .table-section h3 { font-size: 11px; text-transform: uppercase; color: #1f2937; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #d1d5db; }
            table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            table thead { background: #1f2937; color: white; }
            table th { padding: 12px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
            table td { page-break-inside: avoid; }
            table th:nth-child(2), table th:nth-child(3), table th:nth-child(4) { text-align: right; }
            .totals-section { display: flex; justify-content: flex-end; margin-bottom: 30px; page-break-inside: avoid; }
            .totals-box { width: 280px; border: 1px solid #d1d5db; }
            .total-row { display: flex; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid #d1d5db; font-size: 13px; }
            .total-row .label { color: #6b7280; font-weight: 500; }
            .total-row .value { color: #1f2937; font-weight: 600; }
            .grand-total { display: flex; justify-content: space-between; padding: 14px 15px; background: #1f2937; color: white; font-size: 14px; font-weight: 700; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #d1d5db; text-align: center; page-break-inside: avoid; }
            .footer p { font-size: 12px; color: #6b7280; line-height: 1.6; margin-bottom: 4px; }
            @media print { 
              body { padding: 0; background: white; margin: 0; } 
              .container { box-shadow: none; margin: 0; padding: 15px; width: 100%; max-width: 100%; } 
              @page { margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="accent-line"></div>
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
                <div class="info-row"><div class="info-label">Order Date</div><div class="info-value">${formatDate(order.createdAt)}</div></div>
                <div class="info-row"><div class="info-label">Status</div><div class="info-value">${order.status || 'Pending'}</div></div>
                <div class="info-row"><div class="info-label">Order No</div><div class="info-value">${getOrderNumber(order) || 'N/A'}</div></div>
              </div>
            </div>
            <div class="table-section">
              <h3>Order Items</h3>
              <table>
                <thead><tr><th>Item Description</th><th>Qty</th><th>Unit Price</th><th>Amount</th></tr></thead>
                <tbody>${itemRows}</tbody>
              </table>
            </div>
            <div class="totals-section">
              <div class="totals-box">
                <div class="total-row"><span class="label">Subtotal</span><span class="value">${formatDocumentCurrency(total)}</span></div>
                <div class="total-row"><span class="label">Shipping</span><span class="value">FREE</span></div>
                <div class="total-row"><span class="label">Tax</span><span class="value">Included</span></div>
                <div class="grand-total"><span>TOTAL DUE</span><span>${formatDocumentCurrency(total)}</span></div>
              </div>
            </div>
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
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Order not found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            This order may have been deleted or does not exist.
          </p>
          <Link
            to="/admin/orders"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const statusTheme =
    statusThemes[order.status] || 'border-slate-200 bg-slate-50 text-slate-700';

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Sales</span>
            <span>/</span>
            <span className="text-slate-700">Order Details</span>
          </div>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-slate-900">
            {getOrderNumber(order)}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadInvoicePDF}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 hover:border-blue-300"
          >
            <Download size={16} />
            Download Invoice
          </button>
          <button
            type="button"
            onClick={printInvoice}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Printer size={16} />
            Print
          </button>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink size={16} />
            Back to Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Order Date
          </p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Status
          </p>
          <span
            className={`mt-2 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold ${statusTheme}`}
          >
            {order.status || 'Pending'}
          </span>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Grand Total
          </p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            Customer Information
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="font-semibold text-slate-900">{customer.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-slate-400" />
              <p className="text-sm text-slate-700">{customer.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-slate-400" />
              <p className="break-all text-sm text-slate-700">
                {customer.email}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-slate-400" />
              <p className="text-sm text-slate-700">{customer.address}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            Order Summary
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <p className="text-slate-600">Items</p>
              <p className="font-semibold text-slate-900">{items.length}</p>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <p className="text-slate-600">Total Quantity</p>
              <p className="font-semibold text-slate-900">
                {items.reduce((sum, item) => sum + item.qty, 0)} units
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm font-semibold text-slate-700">
                Grand Total
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(total)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          Products ({items.length} items)
        </p>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={`${item.id || item.name}-${index}`}
              className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex-1">
                <p className="font-semibold text-slate-900">
                  {item.name || 'Unnamed Product'}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium">{item.qty}</span> x{' '}
                  {formatCurrency(item.price)} ={' '}
                  <span className="font-semibold">
                    {formatCurrency(item.total)}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Amount</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(item.total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
