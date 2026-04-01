import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ExternalLink, FileText, Loader2, Search, Trash2 } from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { useToast } from '../components/Toast';

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;

const formatDate = (value) => {
  if (!value) return 'Not available';

  const parsed = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Not available';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
};

export default function InvoiceManagement() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const linkedOrderId = searchParams.get('orderId');

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const invoicesQuery = query(
      collection(db, 'invoices'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      invoicesQuery,
      (snapshot) => {
        const invoiceList = snapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));
        setInvoices(invoiceList);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const visibleInvoices = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    return invoices.filter((invoice) => {
      if (linkedOrderId && invoice.orderId !== linkedOrderId) return false;

      if (!searchValue) return true;

      return (
        String(invoice.invoiceNumber || '')
          .toLowerCase()
          .includes(searchValue) ||
        String(invoice.orderNumber || '')
          .toLowerCase()
          .includes(searchValue) ||
        String(invoice.customerName || '')
          .toLowerCase()
          .includes(searchValue) ||
        String(invoice.orderId || '')
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [invoices, linkedOrderId, searchTerm]);

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Delete this invoice?')) return;

    try {
      await deleteDoc(doc(db, 'invoices', invoiceId));
      toast.success('Invoice deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          <Loader2 className="animate-spin text-blue-600" size={18} />
          Loading invoices...
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
            <span className="text-slate-700">Invoices</span>
          </div>
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-slate-900">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            All generated invoices are saved here with INV-YYMM-RAND format.
          </p>
          {linkedOrderId && (
            <p className="mt-2 text-xs text-slate-500">
              Showing invoices linked to order ID: {linkedOrderId}
            </p>
          )}
        </div>

        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
        >
          <ExternalLink size={16} />
          Go to Orders
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by Invoice No, Order No, Customer, or Order ID"
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  Invoice No
                </th>
                <th className="px-4 py-3 text-left font-semibold">Order No</th>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Created At
                </th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-400">
                      <FileText size={18} />
                    </div>
                    No invoices found.
                  </td>
                </tr>
              )}

              {visibleInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {invoice.invoiceNumber || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {invoice.orderNumber || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {invoice.customerName || 'Walk-in Customer'}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {formatCurrency(invoice.total)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {invoice.status || 'Pending'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(invoice.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/admin/orders/${invoice.orderId || ''}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <ExternalLink size={13} />
                        Open Order
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                        title="Delete Invoice"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
