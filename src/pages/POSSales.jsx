import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { formatPKR } from '../data/store';
import { Minus, Plus, Trash2, CreditCard, Banknote, Smartphone, BookOpen, ShoppingCart, ScanBarcode } from 'lucide-react';

export function POSSales() {
  const {
    products, cart, addToCart, removeFromCart, updateCartQty,
    cartDiscount, setCartDiscount, cartTaxPercent, setCartTaxPercent,
    customers, cartCustomer, setCartCustomer,
    cartPaymentMethod, setCartPaymentMethod, clearCart
  } = useApp();

  const [cashReceived, setCashReceived] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');

  const barcodeInputRef = useRef(null);

  // Totals Calculations using .salePrice
  const subtotal = (cart || []).reduce((sum, item) => {
    const itemPrice = item.product?.salePrice || item.salePrice || 0;
    return sum + (item.quantity * itemPrice);
  }, 0);

  const discountAmount = cartDiscount?.type === 'flat' ? Number(cartDiscount.value || 0) : (subtotal * Number(cartDiscount?.value || 0)) / 100;
  const taxedAmount = ((subtotal - discountAmount) * (cartTaxPercent || 0)) / 100;
  const grandTotal = subtotal - discountAmount + taxedAmount;
  const changeDue = Math.max(0, cashReceived - grandTotal);

  // Auto focus barcode input on mount
  useEffect(() => {
    if (barcodeInputRef.current) barcodeInputRef.current.focus();
  }, []);

  // Keyboard Shortcuts (F2: Pay, F4: Focus Cash, Escape: Clear)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        document.getElementById('checkout-btn')?.click();
      } else if (e.key === 'F4') {
        e.preventDefault();
        document.getElementById('cash-input')?.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (confirm("Are you sure you want to clear the cart?")) clearCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, grandTotal, clearCart]);

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matchedProduct = (products || []).find(
      p => p.sku === barcodeInput.trim() || p.id === barcodeInput.trim()
    );

    if (matchedProduct) {
      if (matchedProduct.stock <= 0) {
        alert(`${matchedProduct.name} Out of Stock hai!`);
      } else {
        addToCart(matchedProduct);
      }
    } else {
      alert("Product code nahi mila!");
    }
    setBarcodeInput('');
    barcodeInputRef.current?.focus();
  };

  const checkoutCart = async () => {
    if (!cart || cart.length === 0) return alert("Basket khali hai!");
    if (isSubmitting) return;

    setIsSubmitting(true);

    const saleData = {
      customerId: cartCustomer?._id || null,
      items: cart.map(item => {
        const pId = item.product?._id || item._id;
        const pPrice = item.product?.salePrice || item.salePrice || 0;
        return {
          productId: pId,
          quantity: item.quantity,
          price: pPrice,
          total: item.quantity * pPrice
        };
      }),
      subTotal: subtotal,
      discount: discountAmount,
      tax: taxedAmount,
      grandTotal: grandTotal,
      paymentMethod: cartPaymentMethod || 'Cash'
    };

    try {
      const response = await axios.post('http://localhost:5000/api/sales', saleData);
      if (response.status === 201 || response.status === 200) {
        alert("Sale Completed Successfully! 🎉");
        clearCart();
        setCashReceived(0);
        setCartCustomer(null);
        if (setCartDiscount) setCartDiscount({ type: 'percentage', value: 0 });
        if (setCartTaxPercent) setCartTaxPercent(0);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Sale save nahi hosaki: " + (error.response?.data?.error || error.response?.data?.message || "Server Error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-40px)] overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-2 gap-4">

      {/* LEFT AREA: Barcode & Only Available Stocks */}
      <div className="flex-1 flex flex-col space-y-4">

        {/* Barcode Search Box */}
        <form onSubmit={handleBarcodeSubmit} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs min-w-[120px]">
            <ScanBarcode size={18} />
            <span>Scan Barcode:</span>
          </div>
          <input
            ref={barcodeInputRef}
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="Scan with Gun or Type Barcode/SKU and press Enter..."
            className="flex-1 bg-slate-50 dark:bg-slate-950 p-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-colors">
            Enter
          </button>
        </form>

        {/* Catalog Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-1 content-start overflow-y-auto">
          {(products || [])
            .filter(p => p.stock > 0)
            .map(p => (
              <div
                key={p._id}
                onClick={() => addToCart(p)}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-indigo-500 transition-all flex flex-col justify-between shadow-sm relative group"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pr-2">{p.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Barcode: {p.barcode || p.sku || p.id || p.productCode || 'N/A'}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{formatPKR(p.salePrice)}</p>
                  <p className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
                    Stock: {p.stock}
                  </p>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* RIGHT SIDEBAR: Basket Checkout Console */}
      <div className="w-[380px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center font-bold">
          <span className="text-xs tracking-wide">Checkout Basket</span>
          <ShoppingCart size={18} className="text-indigo-600" />
        </div>

        {/* Basket Loop Grid List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
          {!cart || cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <ShoppingCart size={24} className="mb-2 opacity-40" />
              <p className="text-[11px] font-medium">Basket khali hai</p>
            </div>
          ) : (
            cart.map(item => {
              const itemId = item.product._id || item._id;
              const itemPrice = item.product?.salePrice || item.salePrice || 0;
              return (
                <div key={itemId} className="flex items-center gap-2 text-xs bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate text-slate-700 dark:text-slate-300">{item.product.name}</h4>
                    <p className="text-[10px] text-indigo-500 font-black">{formatPKR(itemPrice)}</p>
                  </div>

                  {/* Quantity Edit Counter Box */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button type="button" onClick={() => item.quantity <= 1 ? removeFromCart(itemId) : updateCartQty(itemId, item.quantity - 1)} className="text-slate-500 hover:text-indigo-600 p-0.5">
                      <Minus size={11} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 1) updateCartQty(itemId, val);
                      }}
                      className="w-8 text-center bg-transparent font-black text-xs text-slate-800 dark:text-slate-100 outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button type="button" onClick={() => updateCartQty(itemId, item.quantity + 1)} className="text-slate-500 hover:text-indigo-600 p-0.5">
                      <Plus size={11} />
                    </button>
                  </div>

                  <span className="font-black text-slate-800 dark:text-slate-200 min-w-[65px] text-right">
                    {formatPKR(item.quantity * itemPrice)}
                  </span>
                  <button type="button" onClick={() => removeFromCart(itemId)} className="text-rose-500 hover:text-rose-600 pl-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Customer & Parameters Controls Form Panel */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">

          {/* Customer Lookup Dropdown Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400">Select Customer:</label>
            <select
              value={cartCustomer?._id || ''}
              className="w-full bg-slate-100 dark:bg-slate-800 p-2 text-xs rounded-lg outline-none font-semibold text-slate-700 dark:text-slate-200"
              onChange={(e) => {
                const selected = (customers || []).find(c => c._id === e.target.value);
                setCartCustomer(selected || null);
              }}
            >
              <option value="">Walk-in Customer</option>
              {(customers || []).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          {/* Discounts & Live Tax parameters fields */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">Discount (%):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={cartDiscount?.value || ''}
                placeholder="0"
                onChange={(e) => setCartDiscount && setCartDiscount({ type: 'percentage', value: Number(e.target.value) })}
                className="w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black text-center outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">Tax GST (%):</label>
              <input
                type="number"
                min="0"
                max="100"
                value={cartTaxPercent || ''}
                placeholder="0"
                onChange={(e) => setCartTaxPercent && setCartTaxPercent(Number(e.target.value))}
                className="w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black text-center outline-none"
              />
            </div>
          </div>

          {/* Payment Mode Selector Box Grid */}
          <div className="grid grid-cols-4 gap-1">
            {[{ id: 'Cash', icon: Banknote }, { id: 'Card', icon: CreditCard }, { id: 'Mobile', icon: Smartphone }, { id: 'Credit', icon: BookOpen }].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setCartPaymentMethod(m.id)}
                className={`p-2 rounded-lg flex flex-col items-center gap-1 border transition-all ${cartPaymentMethod === m.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400'}`}
              >
                <m.icon size={14} />
                <span className="text-[9px] font-bold">{m.id}</span>
              </button>
            ))}
          </div>

          {/* Cash Change Calculator Panel */}
          {cartPaymentMethod === 'Cash' && (
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10px] font-bold text-slate-400">Cash Received (Press F4 to focus):</label>
              <input
                id="cash-input"
                type="number"
                value={cashReceived || ''}
                placeholder="0"
                className="w-full p-2 bg-slate-100 dark:bg-slate-800 font-black rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                onChange={(e) => setCashReceived(Number(e.target.value))}
              />
            </div>
          )}

          {/* Subtotal, Tax and Final Bill Summary */}
          <div className="text-xs space-y-1 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
            <div className="flex justify-between text-slate-500 font-medium"><span>Subtotal:</span><span>{formatPKR(subtotal)}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-amber-500 font-bold"><span>Discount:</span><span>-{formatPKR(discountAmount)}</span></div>}
            {taxedAmount > 0 && <div className="flex justify-between text-sky-500 font-bold"><span>Tax GST:</span><span>+{formatPKR(taxedAmount)}</span></div>}
            {cartPaymentMethod === 'Cash' && <div className="flex justify-between text-emerald-500 font-black"><span>Change Due:</span><span>{formatPKR(changeDue)}</span></div>}
            <div className="flex justify-between font-black text-base pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Total Bill:</span>
              <span className="text-lg text-slate-900 dark:text-white">{formatPKR(grandTotal)}</span>
            </div>
          </div>

          {/* Action Trigger Save Button */}
          <button
            id="checkout-btn"
            onClick={checkoutCart}
            disabled={isSubmitting}
            className={`w-full py-3 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center ${isSubmitting ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
              }`}
          >
            {isSubmitting ? 'Processing Sale...' : 'Pay Now (F2)'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default POSSales;