import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPKR } from '../data/store';
import { Minus, Plus, Trash2, CreditCard, Banknote, Smartphone, BookOpen, ShoppingCart } from 'lucide-react';

export function POSSales() {
  const { 
    products, cart, addToCart, removeFromCart, updateCartQty, 
    cartDiscount, setCartDiscount, cartTaxPercent, setCartTaxPercent, 
    checkoutCart, customers, cartCustomer, setCartCustomer,
    cartPaymentMethod, setCartPaymentMethod
  } = useApp();

  const [cashReceived, setCashReceived] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = cartDiscount.type === 'flat' ? Number(cartDiscount.value) : (subtotal * Number(cartDiscount.value)) / 100;
  const taxedAmount = ((subtotal - discountAmount) * cartTaxPercent) / 100;
  const grandTotal = subtotal - discountAmount + taxedAmount;
  const changeDue = Math.max(0, cashReceived - grandTotal);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* CATALOG */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-4 gap-3">
          {products.map(p => (
            <div key={p.id} onClick={() => p.stock > 0 && addToCart(p)} 
                 className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-indigo-500 transition-all">
              <div className="text-2xl mb-1">{p.image}</div>
              <h3 className="text-xs font-bold truncate">{p.name}</h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{formatPKR(p.salePrice)}</p>
              <p className="text-[9px] text-slate-500">Stock: {p.stock}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BILLING CONSOLE */}
      <div className="w-[400px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center font-bold">
          <span>Checkout</span>
          <ShoppingCart size={18} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.map(item => (
            <div key={item.product.id} className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-950 p-2 rounded-lg">
              <span className="text-lg">{item.product.image}</span>
              <span className="flex-1 font-bold">{item.product.name}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => updateCartQty(item.product.id, item.quantity - 1)}><Minus size={12}/></button>
                {item.quantity}
                <button onClick={() => updateCartQty(item.product.id, item.quantity + 1)}><Plus size={12}/></button>
              </div>
              <span className="font-bold text-indigo-500">{formatPKR(item.total)}</span>
              <button onClick={() => removeFromCart(item.product.id)} className="text-rose-500"><Trash2 size={14}/></button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <select className="w-full bg-slate-100 dark:bg-slate-800 p-2 text-xs rounded" onChange={(e) => setCartCustomer(customers.find(c => c.id === e.target.value))}>
            <option value="">Walk-in Customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <div className="grid grid-cols-4 gap-1">
            {[ {id:'Cash', icon:Banknote}, {id:'Card', icon:CreditCard}, {id:'Mobile', icon:Smartphone}, {id:'Credit', icon:BookOpen} ].map(m => (
              <button key={m.id} onClick={() => setCartPaymentMethod(m.id)} 
                      className={`p-2 rounded flex flex-col items-center ${cartPaymentMethod === m.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <m.icon size={14}/> <span className="text-[9px]">{m.id}</span>
              </button>
            ))}
          </div>

          {cartPaymentMethod === 'Cash' && (
            <input type="number" placeholder="Cash Received" className="w-full p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs" onChange={(e) => setCashReceived(Number(e.target.value))} />
          )}

          <div className="text-xs space-y-1">
            <div className="flex justify-between"><span>Subtotal:</span><span>{formatPKR(subtotal)}</span></div>
            {cartPaymentMethod === 'Cash' && <div className="flex justify-between text-emerald-500"><span>Change:</span><span>{formatPKR(changeDue)}</span></div>}
            <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>{formatPKR(grandTotal)}</span></div>
          </div>

          <button onClick={checkoutCart} className="w-full py-3 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default POSSales;