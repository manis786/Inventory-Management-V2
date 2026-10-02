import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import {
  Save,
  RotateCcw,
  Store,
  Percent,
  MapPin,
  HelpCircle,
  ToggleLeft,
  Sun,
  Moon,
  Palette
} from 'lucide-react';

export function Settings() {
  const {
    storeSettings,
    cartTaxPercent,
    saveStoreSettings,
    addToast,
    theme,
    toggleTheme
  } = useApp();

  // Local Form state
  const [storeName, setStoreName] = useState(storeSettings.name || '');
  const [storeTagline, setStoreTagline] = useState(storeSettings.tagline || '');
  const [storeOwner, setStoreOwner] = useState(storeSettings.owner || '');
  const [storeAddress, setStoreAddress] = useState(storeSettings.address || '');
  const [storePhone, setStorePhone] = useState(storeSettings.phone || '');
  const [storeEmail, setStoreEmail] = useState(storeSettings.email || '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (storeSettings) {
      if (storeSettings.name) setStoreName(storeSettings.name);
      if (storeSettings.tagline) setStoreTagline(storeSettings.tagline);
      if (storeSettings.owner) setStoreOwner(storeSettings.owner);
      if (storeSettings.address) setStoreAddress(storeSettings.address);
      if (storeSettings.phone) setStorePhone(storeSettings.phone);
      if (storeSettings.email) setStoreEmail(storeSettings.email);
      if (storeSettings.ntn) setStoreNtn(storeSettings.ntn);
    }
  }, [storeSettings]);

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveStoreSettings({
        name: storeName,
        tagline: storeTagline,
        owner: storeOwner,
        address: storeAddress,
        phone: storePhone,
        email: storeEmail,
        ntn: storeNtn,
        branches: storeSettings.branches || [],
        cartTaxPercent: cartTaxPercent
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Handle factory reset simulation
  const handleResetData = () => {
    if (confirm('Warning! This will clear all added products, expenses, transactions, and reset the dashboard state to default factory levels. Proceed?')) {
      addToast('Resetting database local state...', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header section */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            ERP Settings & Controls
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Configure supermarket metadata, adjust default retail taxes, and configure outlets.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Form: General settings (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-805">
              <CardTitle className="flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-600" />
                Store General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Supermarket Brand Name"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
                <Input
                  label="Marketing Tagline"
                  value={storeTagline}
                  onChange={(e) => setStoreTagline(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Authorized Owner Name"
                  required
                  value={storeOwner}
                  onChange={(e) => setStoreOwner(e.target.value)}
                />
                <Input
                  label="Registered NTN Number"
                  value={storeNtn}
                  onChange={(e) => setStoreNtn(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone"
                  required
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                />
                <Input
                  label="Corporate Support Email"
                  type="email"
                  required
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                />
              </div>

              <Input
                label="HQ Registered Address"
                required
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Branch Configuration list */}
          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-805">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Multi-branch Locations Registry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Branch ID</th>
                    <th className="p-3">Location Name</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {storeSettings.branches.map((b) => (
                    <tr key={b.id} className="text-slate-700 dark:text-slate-200">
                      <td className="p-3 font-bold font-mono">{b.id}</td>
                      <td className="p-3 font-semibold">{b.name}</td>
                      <td className="p-3 text-slate-400">{b.address}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          b.isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-405'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455'
                        }`}>
                          {b.isActive ? 'Active Counter' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right Form: Tax & System Control settings (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          {/* Appearance & Theme Card */}
          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                Appearance & Theme Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your preferred interface theme for all modules.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'border-indigo-600 bg-indigo-950/50 text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  Dark Mode
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Tax config Card */}
          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-805">
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-indigo-600" />
                GST Tax Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <Input
                label="FBR Retail Sales GST Tax (%)"
                type="number"
                required
                min="0"
                max="100"
                value={cartTaxPercent}
                onChange={(e) => setCartTaxPercent(Number(e.target.value))}
              />

              <div className="bg-slate-50 dark:bg-slate-955/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-[10px] text-slate-455 dark:text-slate-500 leading-normal flex items-start gap-2 select-none">
                <HelpCircle className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <p>
                  Adjusting the sales GST tax dynamically propagates calculations to the POS cashier register, receipts template, and audit reports.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System settings reset */}
          <Card className="border-rose-100 dark:border-rose-950/20 bg-rose-50/5">
            <CardHeader className="py-3 px-4 border-b border-rose-100 dark:border-rose-950/10">
              <CardTitle className="text-xs uppercase font-black text-rose-700 dark:text-rose-400">Danger Zone controls</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Clear all database logs, sales tickets, purchase orders, expenses, and restore original factory-mock levels.
              </p>
              <Button
                variant="danger"
                type="button"
                className="w-full text-xs py-2 shadow-sm"
                icon={RotateCcw}
                onClick={handleResetData}
              >
                Reset System State
              </Button>
            </CardContent>
          </Card>

          {/* Action trigger button */}
          <Button
            variant="success"
            type="submit"
            loading={saving}
            className="w-full py-2.5 font-bold shadow-md"
            icon={Save}
          >
            Save Settings Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
export default Settings;
