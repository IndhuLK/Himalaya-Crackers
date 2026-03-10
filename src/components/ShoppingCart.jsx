import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Rocket,
  Trash2,
  Plus,
  Minus,
  User,
  Mail,
  PhoneCall,
  MapPin,
  Building,
  Hash,
} from 'lucide-react';
import { useCart } from '../Context/CartContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ShoppingCartPopup = ({ open, onClose }) => {
  const { cartItems, updateQty, removeFromCart, clearCart } = useCart();
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

  if (!open) return null;

  const handleCheckout = async () => {
    if (
      !customer.name ||
      !customer.mobile ||
      !customer.address ||
      !customer.pincode
    ) {
      alert('Please fill all required fields!');
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
      alert('Error placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-120 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-6xl bg-white h-full flex flex-col md:flex-row shadow-2xl animate-in slide-in-from-right duration-300">
        {/* --- LEFT: CART ITEMS --- */}
        <div
          className={`flex-1 flex flex-col border-r bg-slate-50 ${step === 'checkout' ? 'hidden md:flex' : 'flex'}`}
        >
          <div className="p-5 border-b bg-white flex justify-between items-center sticky top-0 z-10">
            <h2 className="font-black text-xl flex items-center gap-2 italic">
              <ShoppingCart className="text-blue-600" /> SHOPPING CART
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full"
            >
              <X />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                <ShoppingCart size={100} strokeWidth={1} />
                <p className="font-black text-xl mt-4 italic uppercase tracking-widest">
                  Basket is Empty
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white p-4 rounded-4xl border border-slate-100 shadow-sm transition-hover hover:shadow-md"
                >
                  <div className="bg-blue-50 p-4 rounded-2xl shrink-0">
                    <Rocket className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-800 text-sm uppercase truncate">
                      {item.name}
                    </h4>
                    <p className="text-blue-600 font-bold">
                      ₹{item.price * item.qty}
                    </p>
                  </div>

                  {/* ✅ FIXED QTY LOGIC */}
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-black">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg shadow-lg"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="bg-white border-t p-8 space-y-4">
            <div className="flex justify-between font-black text-2xl italic tracking-tighter">
              <span>GRAND TOTAL</span>
              <span className="text-blue-600">₹{subtotal}</span>
            </div>
            <button
              onClick={() => setStep('checkout')}
              disabled={cartItems.length === 0}
              className="md:hidden w-full bg-slate-900 text-white py-5 rounded-4xl font-black uppercase tracking-widest shadow-xl disabled:bg-slate-200"
            >
              Continue to Shipping
            </button>
          </div>
        </div>

        {/* --- RIGHT: SHIPPING FORM --- */}
        <div
          className={`w-full md:w-[450px] flex flex-col bg-white ${step === 'cart' ? 'hidden md:flex' : 'flex'}`}
        >
          <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
            <h3 className="font-black uppercase tracking-widest italic">
              Shipping Details
            </h3>
            <button onClick={() => setStep('cart')} className="md:hidden">
              <X />
            </button>
          </div>

          <div className="p-8 space-y-6 overflow-y-auto">
            <Input label="Full Name *" icon={User}>
              <input
                name="name"
                placeholder="Receiver Name"
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
            </Input>
            <Input label="WhatsApp Number *" icon={PhoneCall}>
              <input
                name="mobile"
                type="tel"
                placeholder="9123456789"
                onChange={(e) =>
                  setCustomer({ ...customer, mobile: e.target.value })
                }
              />
            </Input>
            <Input label="Delivery Address *" icon={MapPin}>
              <textarea
                name="address"
                rows="2"
                placeholder="Complete Address"
                onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
                }
              />
            </Input>
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" icon={Building}>
                <input
                  name="city"
                  placeholder="City"
                  onChange={(e) =>
                    setCustomer({ ...customer, city: e.target.value })
                  }
                />
              </Input>
              <Input label="Pincode *" icon={Hash}>
                <input
                  name="pincode"
                  type="number"
                  placeholder="600001"
                  onChange={(e) =>
                    setCustomer({ ...customer, pincode: e.target.value })
                  }
                />
              </Input>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
              className="w-full mt-6 bg-[#F2A31E] hover:bg-orange-600 text-white py-5 rounded-4xl font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:bg-slate-200"
            >
              {loading ? 'Placing Order...' : 'Order via WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 tracking-widest">
      <Icon size={12} className="text-blue-600" /> {label}
    </label>
    {React.cloneElement(children, {
      className:
        'w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm',
    })}
  </div>
);

export default ShoppingCartPopup;
