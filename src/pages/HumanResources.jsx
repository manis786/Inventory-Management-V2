import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { formatPKR } from '../data/store';
import { 
  Users, UserPlus, Fingerprint, Banknote, CalendarCheck, 
  Search, ShieldCheck, Printer, FileSpreadsheet, UserCheck, Clock, UserX,
  Trash2, Plus, CheckCircle, AlertCircle
} from 'lucide-react';

export function HumanResources() {
  const { employees, addEmployee, deleteEmployee, logAttendance, addToast } = useApp();
  
  // Local active tab control inside HR Module
  const [activeTab, setActiveTab] = useState('directory'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Add Employee Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'STAFF',
    department: 'Karachi HQ Showroom',
    baseSalary: 45000,
    phone: '',
    email: '',
    status: 'Active'
  });

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name.trim()) {
      addToast('Please enter employee name', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await addEmployee(newStaff);
      setIsAddModalOpen(false);
      setNewStaff({
        name: '',
        role: 'STAFF',
        department: 'Karachi HQ Showroom',
        baseSalary: 45000,
        phone: '',
        email: '',
        status: 'Active'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (emp) => {
    if (confirm(`Are you sure you want to remove employee "${emp.name}" (${emp.id || emp._id})?`)) {
      await deleteEmployee(emp.id || emp._id);
    }
  };

  const handleToggleAttendance = async (empId, currentStatus) => {
    const nextStatus = currentStatus === 'Present' ? 'Late' : (currentStatus === 'Late' ? 'Absent' : 'Present');
    const checkIn = nextStatus === 'Absent' ? '-' : (nextStatus === 'Late' ? '09:45 AM' : '09:00 AM');
    const checkOut = nextStatus === 'Absent' ? '-' : '06:00 PM';
    const hours = nextStatus === 'Absent' ? '0 hrs' : (nextStatus === 'Late' ? '8.2 hrs' : '9.0 hrs');

    await logAttendance(empId, {
      status: nextStatus,
      checkIn,
      checkOut,
      hours
    });
  };

  // 1. Dynamic Live Attendance Status (Today)
  const todayStr = new Date().toISOString().split('T')[0];
  const attendanceData = (employees || []).map(emp => {
    const todayLog = (emp.attendance || []).find(a => a.date === todayStr);
    return {
      id: emp.id || emp._id,
      name: emp.name,
      role: emp.role,
      status: todayLog ? todayLog.status : 'Present',
      checkIn: todayLog ? todayLog.checkIn : '09:00 AM',
      checkOut: todayLog ? todayLog.checkOut : '06:00 PM',
      hours: todayLog ? todayLog.hours : '9.0 hrs'
    };
  });

  // Calculate Attendance Summary Counters
  const totalStaffCount = attendanceData.length || 1;
  const presentCount = attendanceData.filter(a => a.status === 'Present').length;
  const lateCount = attendanceData.filter(a => a.status === 'Late').length;
  const absentCount = attendanceData.filter(a => a.status === 'Absent').length;

  const presentPercent = Math.round((presentCount / totalStaffCount) * 100);
  const latePercent = Math.round((lateCount / totalStaffCount) * 100);
  const absentPercent = Math.round((absentCount / totalStaffCount) * 100);

  // 2. Dynamic Monthly Payroll Calculation Rollups
  const payrollData = (employees || []).map(emp => {
    const salary = Number(emp.baseSalary || 45000);
    const deductions = emp.role === "AUDITOR" ? 3000 : 0;
    const allowances = emp.role === "MANAGER" ? 5000 : 2000;
    const netSalary = salary + allowances - deductions;
    return {
      id: emp.id || emp._id,
      name: emp.name,
      baseSalary: salary,
      allowances,
      deductions,
      netSalary,
      payoutStatus: emp.status === 'Active' ? 'Processed' : 'Hold'
    };
  });

  const totalPayrollBudget = payrollData.reduce((acc, p) => acc + p.netSalary, 0);

  // --- ACTIONS ---
  const triggerExport = (sheetName) => {
    addToast(`Spooling HR records... Exporting [${sheetName}] as Microsoft Excel format.`, 'success');
  };

  const processMonthlyPayouts = () => {
    addToast("Generating direct bank transfer slip vouchers for all verified active staff nodes.", "success");
  };

  // --- FILTER ENGINES ---
  const filteredEmployees = (employees || []).filter(emp => {
    const matchesSearch = (emp.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (emp.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // --- TABLE COLUMNS SCHEMA ---
  const directoryColumns = [
    { key: 'id', label: 'Employee ID', className: 'font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold' },
    { key: 'name', label: 'Full Name', render: (row) => <span className="font-semibold text-slate-800 dark:text-slate-100">{row.name}</span> },
    { key: 'department', label: 'Entity Cost Center / Node' },
    { key: 'role', label: 'System Access Role', render: (row) => <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{row.role}</span> },
    { key: 'baseSalary', label: 'Base Structured Salary', render: (row) => <span className="font-bold">{formatPKR(row.baseSalary)}</span> },
    { key: 'status', label: 'Status', render: (row) => <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600"><UserCheck className="w-3 h-3"/> {row.status}</span> },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-center',
      render: (row) => (
        <button
          onClick={() => handleDeleteStaff(row)}
          title="Delete Employee"
          className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  const attendanceColumns = [
    { key: 'id', label: 'Emp ID', className: 'font-mono text-xs text-slate-400' },
    { key: 'name', label: 'Staff Member', className: 'font-semibold text-xs' },
    { 
      key: 'status', 
      label: 'Shift Status', 
      render: (row) => {
        if (row.status === 'Present') return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center gap-1 w-max"><UserCheck className="w-3 h-3"/> On Time</span>;
        if (row.status === 'Late') return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Late Entry</span>;
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 flex items-center gap-1 w-max"><UserX className="w-3 h-3"/> Absent</span>;
      }
    },
    { key: 'checkIn', label: 'Punch In (Biometric)', className: 'font-mono text-xs' },
    { key: 'checkOut', label: 'Punch Out (Biometric)', className: 'font-mono text-xs' },
    { key: 'hours', label: 'Logged Hours', className: 'font-bold text-slate-700 dark:text-slate-300 text-xs' },
    {
      key: 'changeStatus',
      label: 'Quick Toggle',
      className: 'text-center',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[10px] py-0 px-2"
          onClick={() => handleToggleAttendance(row.id, row.status)}
        >
          Cycle Status
        </Button>
      )
    }
  ];

  const payrollColumns = [
    { key: 'id', label: 'Emp ID', className: 'font-mono text-xs text-slate-400' },
    { key: 'name', label: 'Staff Member', className: 'font-semibold text-xs' },
    { key: 'baseSalary', label: 'Basic Fix', render: (row) => <span className="text-xs">{formatPKR(row.baseSalary)}</span> },
    { key: 'allowances', label: 'Allowances (+)', className: 'text-emerald-600 text-xs', render: (row) => <span>+{formatPKR(row.allowances)}</span> },
    { key: 'deductions', label: 'Deductions (-)', className: 'text-rose-600 text-xs', render: (row) => row.deductions > 0 ? <span>-{formatPKR(row.deductions)}</span> : <span>-</span> },
    { key: 'netSalary', label: 'Net Payable Disbursed', className: 'font-black text-slate-900 dark:text-slate-100 text-xs', render: (row) => <span>{formatPKR(row.netSalary)}</span> },
    { 
      key: 'payoutStatus', 
      label: 'Voucher Status',
      render: (row) => row.payoutStatus === 'Processed' 
        ? <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">Paid</span>
        : <span className="text-[10px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">On Hold</span>
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* MODULE HEADER BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800 no-print">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" /> Human Resources & Payroll Node
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Manage corporate employment metrics, verify live shift check-ins, and authorize centralized monthly payroll payouts.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200" icon={FileSpreadsheet} onClick={() => triggerExport(activeTab)}>Export Dataset</Button>
          {activeTab === 'payroll' && (
            <Button variant="primary" size="sm" className="h-9 text-xs bg-indigo-600" icon={Banknote} onClick={processMonthlyPayouts}>Release All Salaries</Button>
          )}
        </div>
      </div>

      {/* THREE MODULE CONTROLLER NAVIGATION TABS */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 no-print">
        <button 
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${activeTab === 'directory' ? 'border-b-indigo-600 text-indigo-600 dark:text-indigo-400 font-black' : 'border-b-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Users className="w-3.5 h-3.5"/> Staff Profiles Directory
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${activeTab === 'attendance' ? 'border-b-indigo-600 text-indigo-600 dark:text-indigo-400 font-black' : 'border-b-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Fingerprint className="w-3.5 h-3.5"/> Live Attendance Log
        </button>
        <button 
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${activeTab === 'payroll' ? 'border-b-indigo-600 text-indigo-600 dark:text-indigo-400 font-black' : 'border-b-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Banknote className="w-3.5 h-3.5"/> Monthly Payroll Registry
        </button>
      </div>

      {/* --- TAB 1: EMPLOYEE DIRECTORY INTERFACE --- */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* SEARCH FILTERS */}
          <Card className="no-print border-slate-200/80 shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <Input 
                  placeholder="Search via employee code or name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs border-slate-200"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)} 
                  className="h-9 text-xs border-slate-200 bg-white dark:bg-slate-900 min-w-[140px]"
                >
                  <option value="ALL">All Roles Status</option>
                  <option value="ADMIN">Administrators</option>
                  <option value="MANAGER">Branch Managers</option>
                  <option value="CASHIER">Cashier Desk</option>
                  <option value="AUDITOR">Auditor Board</option>
                  <option value="STAFF">General Staff</option>
                </Select>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="h-9 text-xs bg-indigo-600" 
                  icon={UserPlus}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add New Staff
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* MAIN DATA GRID CONTAINER */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <Table columns={directoryColumns} data={filteredEmployees} emptyMessage="No matching active corporate employees registered." />
          </div>
        </div>
      )}

      {/* --- TAB 2: ATTENDANCE REALTIME SHEET --- */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {/* CORE ATTENDANCE COUNTERS METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/20 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Present Strengths Today</p>
                <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">{presentCount} Employees</h4>
              </div>
              <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 font-bold text-xs">{presentPercent}%</div>
            </div>
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/20 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Late Arrivals Counter</p>
                <h4 className="text-base font-black text-amber-500 mt-0.5">{lateCount} Head Log</h4>
              </div>
              <div className="w-8 h-8 rounded bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 font-bold text-xs">{latePercent}%</div>
            </div>
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/20 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Unexcused Absents Pool</p>
                <h4 className="text-base font-black text-rose-500 mt-0.5">{absentCount} Head Log</h4>
              </div>
              <div className="w-8 h-8 rounded bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 font-bold text-xs">{absentPercent}%</div>
            </div>
          </div>

          {/* MAIN ATTENDANCE DATA GRID */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Biometric Live Validation Roster</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time gateway tracking logs synchronized natively with institutional entry terminals.</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] dark:bg-emerald-950/30 dark:text-emerald-400"><ShieldCheck className="w-3.5 h-3.5"/> Terminal Live Sync</span>
            </div>
            <Table columns={attendanceColumns} data={attendanceData} emptyMessage="No terminal checks recorded inside this node." />
          </div>
        </div>
      )}

      {/* --- TAB 3: PAYROLL CALCULATION MATRIX --- */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-50/20 border border-indigo-100/50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-xs">
            <div className="flex items-center gap-2.5">
              <CalendarCheck className="w-4 h-4 text-indigo-600"/>
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">Active Accounting Month Allocation:</span>
                <span className="text-[10px] text-slate-400">Current computation index running over active staff salary rollups.</span>
              </div>
            </div>
            <div className="font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded text-slate-700 dark:text-slate-200 font-bold">
              Total Budget Inflow Required: <span className="text-indigo-600 dark:text-indigo-400 font-black">{formatPKR(totalPayrollBudget)}</span>
            </div>
          </div>

          {/* PAYROLL MANAGEMENT DATA TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <Table columns={payrollColumns} data={payrollData} emptyMessage="Payroll allocation vector clear or un-compiled." />
          </div>
        </div>
      )}

      {/* ADD EMPLOYEE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Employee / Staff Member"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Tariq Mehmood"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            />
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Role</label>
              <Select
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                className="h-10 text-xs border-slate-200"
              >
                <option value="STAFF">General Staff</option>
                <option value="CASHIER">Cashier Desk</option>
                <option value="MANAGER">Branch Manager</option>
                <option value="AUDITOR">Auditor Board</option>
                <option value="ADMIN">Administrator</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Department / Cost Center"
              placeholder="e.g. Karachi HQ Showroom"
              value={newStaff.department}
              onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
            />
            <Input
              label="Base Structured Salary (PKR)"
              type="number"
              min="0"
              required
              value={newStaff.baseSalary}
              onChange={(e) => setNewStaff({ ...newStaff, baseSalary: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              placeholder="+92 300 1234567"
              value={newStaff.phone}
              onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="staff@martpro.pk"
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={submitting}
              className="bg-indigo-600"
              icon={UserPlus}
            >
              Register Staff Member
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
export default HumanResources;