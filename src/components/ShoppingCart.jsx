import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  User,
  Mail,
  PhoneCall,
  MapPin,
  Building,
  Hash,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  Package,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { useToast } from './Toast';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ShoppingCartPopup = ({ open, onClose }) => {
  const { cartItems, updateQty, removeFromCart, clearCart } = useCart();
  const toast = useToast();
  const [step, setStep] = useState('cart');
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    pincode: '',
  });

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  if (!open) return null;

  const handleCheckout = async () => {
    if (
      !customer.name ||
      !customer.mobile ||
      !customer.address ||
      !customer.pincode
    ) {
      toast.warning('Please fill all required fields!');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        customer,
        items: cartItems,
        total: subtotal,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });

      const phone = '919500694734';
      let msg = `*NEW ORDER – HIMALAYA CRACKERS*%0A%0A`;
      msg += `Name: ${customer.name}%0A`;
      msg += `Mobile: ${customer.mobile}%0A%0A`;
      msg += `*Items:*%0A`;
      cartItems.forEach((i, idx) => {
        msg += `${idx + 1}. ${i.name} (x${i.qty}) - ₹${i.price * i.qty}%0A`;
      });
      msg += `%0A*Total: ₹${subtotal}*`;

      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
      clearCart();
      onClose();
      setStep('cart');
    } catch (e) {
      toast.error('Error placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-120 flex justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="relative w-full max-w-130 bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* HEADER */}
        <div className="relative px-5 py-4 border-b border-slate-100 bg-white flex items-center justify-between">
          {step === 'checkout' && (
            <button
              onClick={() => setStep('cart')}
              className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors md:hidden"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <div
            className={`flex items-center gap-2.5 ${step === 'checkout' ? 'hidden md:flex' : ''}`}
          >
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 tracking-tight">
                {step === 'cart' ? 'Your Cart' : 'Checkout'}
              </h2>
              {cartItems.length > 0 && step === 'cart' && (
                <p className="text-[10px] font-medium text-slate-400">
                  {itemCount} item{itemCount > 1 ? 's' : ''} • ₹{subtotal}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* STEPPER - visible on checkout */}
        {step === 'checkout' && (
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Cart
              </span>
            </div>
            <div className="flex-1 h-px bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">2</span>
              </div>
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                Shipping
              </span>
            </div>
            <div className="flex-1 h-px bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-[8px] text-slate-400 font-bold">3</span>
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                Order
              </span>
            </div>
          </div>
        )}

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto">
          {step === 'cart' ? (
            /* ==================== CART VIEW ==================== */
            <div className="flex flex-col h-full">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border-4 border-white shadow-sm">
                    <ShoppingCart size={28} className="text-slate-300" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">
                    Cart is empty
                  </h3>
                  <p className="text-sm text-slate-400 text-center mb-6">
                    Start adding some amazing crackers!
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-2.5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all group"
                    >
                      {/* Product Image/Icon */}
                      <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-slate-100">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={18} className="text-slate-300" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-800 truncate leading-tight mb-0.5">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">
                          ₹{item.price} each
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          ₹{item.price * item.qty}
                        </p>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center bg-slate-50 rounded-lg border border-slate-100">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-l-lg transition-colors text-slate-500"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-black text-slate-800">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-slate-900 text-white rounded-r-lg hover:bg-emerald-500 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ==================== CHECKOUT VIEW ==================== */
            <div className="p-5 space-y-5">
              {/* Order Summary Mini */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Order Summary
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">
                    {itemCount} items
                  </span>
                </div>
                <div className="space-y-1.5 max-h-28 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-xs"
                    >
                      <span className="text-slate-600 font-medium truncate mr-3">
                        {item.name} ×{item.qty}
                      </span>
                      <span className="font-bold text-slate-800 shrink-0">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-sm font-black text-emerald-600">
                    ₹{subtotal}
                  </span>
                </div>
              </div>

              {/* Shipping Form */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <MapPin size={13} className="text-blue-500" />
                  Shipping Information
                </h4>

                <InputField label="Full Name" icon={User} required>
                  <input
                    name="name"
                    placeholder="Receiver's full name"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                  />
                </InputField>

                <InputField label="WhatsApp Number" icon={PhoneCall} required>
                  <input
                    name="mobile"
                    type="tel"
                    placeholder="9123456789"
                    value={customer.mobile}
                    onChange={(e) =>
                      setCustomer({ ...customer, mobile: e.target.value })
                    }
                  />
                </InputField>

                <InputField label="Email" icon={Mail}>
                  <input
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({ ...customer, email: e.target.value })
                    }
                  />
                </InputField>

                <InputField label="Delivery Address" icon={MapPin} required>
                  <textarea
                    name="address"
                    rows="2"
                    placeholder="House/Flat no, Street, Area..."
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                  />
                </InputField>

                <div className="grid grid-cols-2 gap-3">
                  <InputField label="City" icon={Building}>
                    <input
                      name="city"
                      placeholder="City"
                      value={customer.city}
                      onChange={(e) =>
                        setCustomer({ ...customer, city: e.target.value })
                      }
                    />
                  </InputField>
                  <InputField label="Pincode" icon={Hash} required>
                    <input
                      name="pincode"
                      type="number"
                      placeholder="600001"
                      value={customer.pincode}
                      onChange={(e) =>
                        setCustomer({ ...customer, pincode: e.target.value })
                      }
                    />
                  </InputField>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM BAR */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 bg-white p-4 space-y-3">
            {step === 'cart' ? (
              <>
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-bold text-slate-500">
                    Subtotal
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{subtotal}
                  </span>
                </div>
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-[0.98]"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>
                <p className="text-center text-[10px] text-slate-400 font-medium">
                  <Sparkles size={10} className="inline mr-1 text-orange-400" />
                  Free delivery on orders above ₹5000
                </p>
              </>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Order via WhatsApp
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, icon: Icon, required, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 tracking-widest">
      <Icon size={11} className="text-blue-500" /> {label}
      {required && <span className="text-red-400">*</span>}
    </label>
    {React.cloneElement(children, {
      className:
        'w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all',
    })}
  </div>
);

export default ShoppingCartPopup;
