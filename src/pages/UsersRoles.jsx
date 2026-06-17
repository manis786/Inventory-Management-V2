import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ActivityTimeline } from '../components/shared/ActivityTimeline';
import { USER_ACTIVITIES } from '../data/users';
import { PlusCircle, ShieldAlert, ShieldCheck, Check, X, Shield, History, Users } from 'lucide-react';

export function UsersRoles() {
  const {
    users,
    addUser,
    updateUser,
    loginAsUser,
    currentUser,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('list');

  // Add User states
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    role: 'CASHIER',
    branch: 'Karachi HQ'
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim()) {
      addToast('Please fill out name, username, and email.', 'error');
      return;
    }

    addUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      username: formData.username,
      role: formData.role,
      branch: formData.branch
    });

    setModalOpen(false);
  };

  const handleToggleStatus = (user) => {
    if (user.id === currentUser.id) {
      addToast('You cannot deactivate your own logged-in user profile!', 'error');
      return;
    }

    const updated = {
      ...user,
      status: user.status === 'active' ? 'inactive' : 'active'
    };
    updateUser(updated);
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      role: 'CASHIER',
      branch: 'Karachi HQ'
    });
    setModalOpen(true);
  };

  // Matrix check helper
  const roleHasAccess = (role, mod) => {
    const permissions = {
      ADMIN: ['Dashboard', 'POS Sales', 'Products', 'Categories', 'Inventory', 'Purchases', 'Suppliers', 'Customers', 'Finance', 'Expenses', 'Reports', 'Users & Roles', 'Settings'],
      MANAGER: ['Dashboard', 'POS Sales', 'Products', 'Categories', 'Inventory', 'Purchases', 'Suppliers', 'Customers', 'Expenses', 'Reports', 'Settings'],
      CASHIER: ['Dashboard', 'POS Sales', 'Customers', 'Products'],
      AUDITOR: ['Dashboard', 'Finance', 'Expenses', 'Reports', 'Suppliers', 'Customers']
    };
    return permissions[role]?.includes(mod) || false;
  };

  const listColumns = [
    {
      key: 'avatar',
      label: '',
      render: (row) => <span className="text-xl select-none">{row.avatar || '👤'}</span>
    },
    {
      key: 'name',
      label: 'Employee Details',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-805 dark:text-slate-100">{row.name}</span>
          <span className="text-[10px] text-slate-400">Username: {row.username} | Email: {row.email}</span>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Security Role',
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
          row.role === 'ADMIN'
            ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:text-rose-405'
            : row.role === 'MANAGER'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
              : row.role === 'CASHIER'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                : 'bg-cyan-55 border-cyan-200 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-400'
        }`}>
          {row.role}
        </span>
      )
    },
    { key: 'branch', label: 'Assigned Outlet', sortable: true },
    { key: 'lastLogin', label: 'Last Login time' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      label: 'Controls',
      sortable: false,
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          {row.id !== currentUser.id && (
            <Button
              variant="outline"
              size="sm"
              className="py-1 px-2 text-xs font-semibold"
              onClick={() => handleToggleStatus(row)}
            >
              {row.status === 'active' ? 'Block' : 'Activate'}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="py-1 px-2 text-xs font-bold text-indigo-650 hover:underline cursor-pointer"
            onClick={() => loginAsUser(row.id)}
          >
            Masquerade
          </Button>
        </div>
      )
    }
  ];

  const modules = ['Dashboard', 'POS Sales', 'Products', 'Categories', 'Inventory', 'Purchases', 'Suppliers', 'Customers', 'Finance', 'Expenses', 'Reports', 'Users & Roles', 'Settings'];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-855 dark:text-white tracking-tight">
            Security, Users & Roles
          </h1>
          <p className="text-xs text-slate-405 dark:text-slate-500">
            Define system credentials, set granular screen permissions, and audit user logs.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={PlusCircle}
          onClick={handleOpenAdd}
        >
          Add Staff Account
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        tabs={[
          { value: 'list', label: 'Employee Database', icon: <Users className="w-3.5 h-3.5" /> },
          { value: 'matrix', label: 'Permissions Matrix', icon: <Shield className="w-3.5 h-3.5" /> },
          { value: 'audit', label: 'System Access Audits', icon: <History className="w-3.5 h-3.5" /> }
        ]}
      />

      {/* EMPLOYEE DATABASE */}
      {activeTab === 'list' && (
        <Table
          columns={listColumns}
          data={users}
          sortColumn="id"
          sortDirection="asc"
          emptyMessage="No employees registered in the system."
        />
      )}

      {/* PERMISSIONS MATRIX */}
      {activeTab === 'matrix' && (
        <Card className="max-w-3xl mx-auto overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-805">
            <CardTitle>Role Access Control Matrix (RBAC)</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900 font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4 font-bold text-slate-800 dark:text-slate-200">System Modules</th>
                  <th className="p-4 text-center">Administrator</th>
                  <th className="p-4 text-center">Branch Manager</th>
                  <th className="p-4 text-center">Cashier Terminal</th>
                  <th className="p-4 text-center">Financial Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {modules.map((mod) => (
                  <tr key={mod} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 text-slate-707 dark:text-slate-205">
                    <td className="p-4 font-bold">{mod}</td>
                    {['ADMIN', 'MANAGER', 'CASHIER', 'AUDITOR'].map((role) => {
                      const hasAccess = roleHasAccess(role, mod);
                      return (
                        <td key={role} className="p-4 text-center">
                          <div className="flex items-center justify-center">
                            {hasAccess ? (
                              <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20">
                                <Check className="w-4 h-4 shrink-0" />
                              </div>
                            ) : (
                              <div className="p-0.5 rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/20">
                                <X className="w-4 h-4 shrink-0" />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* SYSTEM ACCESS AUDITS TIMELINE */}
      {activeTab === 'audit' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>System Activity Timeline logs</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ActivityTimeline activities={USER_ACTIVITIES} />
          </CardContent>
        </Card>
      )}

      {/* REGISTER STAFF MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Staff Account Credentials"
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Full Employee Name"
            placeholder="e.g. Rahat Jamil"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Username prefix"
              placeholder="e.g. rahat.cashier"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <Input
              label="Contact phone"
              placeholder="e.g. 0345-1234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Input
            label="Corporate Email Address"
            type="email"
            placeholder="name@martpro.pk"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Assigned Security Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="ADMIN">Administrator</option>
              <option value="MANAGER">Branch Manager</option>
              <option value="CASHIER">Cashier Counter</option>
              <option value="AUDITOR">Financial Auditor</option>
            </Select>

            <Select
              label="Work Outlet Location"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
            >
              <option value="Karachi HQ">Karachi HQ Showroom</option>
              <option value="Lahore Branch">Lahore Branch Outlet</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Generate Staff Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
export default UsersRoles;
