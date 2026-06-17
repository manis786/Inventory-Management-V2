import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { formatPKR } from '../data/store';
import { 
  Users, UserPlus, Fingerprint, Banknote, CalendarCheck, 
  Search, ShieldCheck, Printer, FileSpreadsheet, UserCheck, Clock, UserX 
} from 'lucide-react';

export function HumanResources() {
  const { addToast } = useApp();
  
  // Local active tab control inside HR Module
  const [activeTab, setActiveTab] = useState('directory'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // 1. Mock Database Vector: Employees / Staff Directory
  const [employees, setEmployees] = useState([
    { id: "EMP-001", name: "Muhammad Anis", role: "ADMIN", department: "Management", baseSalary: 125000, joinedDate: "2025-01-10", status: "Active" },
    { id: "EMP-002", name: "Asad Ali", role: "MANAGER", department: "Karachi HQ Showroom", baseSalary: 75000, joinedDate: "2025-06-15", status: "Active" },
    { id: "EMP-003", name: "Kamran Khan", role: "CASHIER", department: "Karachi HQ Showroom", baseSalary: 45000, joinedDate: "2025-09-01", status: "Active" },
    { id: "EMP-004", name: "Zain Baloch", role: "CASHIER", department: "Lahore Branch Outlet", baseSalary: 42000, joinedDate: "2026-02-11", status: "Active" },
    { id: "EMP-005", name: "Bilal Ahmed", role: "AUDITOR", department: "Finance Node", baseSalary: 90000, joinedDate: "2025-03-20", status: "Active" }
  ]);

  // 2. Mock Database Vector: Live Daily Attendance Status (Today)
  const attendanceData = [
    { id: "EMP-001", name: "Muhammad Anis", role: "ADMIN", status: "Present", checkIn: "08:55 AM", checkOut: "06:05 PM", hours: "9.1 hrs" },
    { id: "EMP-002", name: "Asad Ali", role: "MANAGER", status: "Present", checkIn: "09:02 AM", checkOut: "06:15 PM", hours: "9.2 hrs" },
    { id: "EMP-003", name: "Kamran Khan", role: "CASHIER", status: "Late", checkIn: "09:45 AM", checkOut: "06:00 PM", hours: "8.2 hrs" },
    { id: "EMP-004", name: "Zain Baloch", role: "CASHIER", status: "Present", checkIn: "08:50 AM", checkOut: "06:00 PM", hours: "9.1 hrs" },
    { id: "EMP-005", name: "Bilal Ahmed", role: "AUDITOR", status: "Absent", checkIn: "-", checkOut: "-", hours: "0 hrs" }
  ];

  // 3. Mock Database Vector: Monthly Payroll Calculation Rollups
  const payrollData = employees.map(emp => {
    // Basic structural formula for demonstration
    const deductions = emp.role === "AUDITOR" ? 3000 : 0; // Simulated absent fine
    const allowances = emp.role === "MANAGER" ? 5000 : 2000; // Fuel/Mobile allowance
    const netSalary = emp.baseSalary + allowances - deductions;
    return {
      ...emp,
      allowances,
      deductions,
      netSalary,
      payoutStatus: emp.id === "EMP-005" ? "Hold" : "Processed"
    };
  });

  // --- ACTIONS ---
  const triggerExport = (sheetName) => {
    addToast(`Spooling HR records... Exporting [${sheetName}] as Microsoft Excel format.`, 'success');
  };

  const processMonthlyPayouts = () => {
    addToast("Generating direct bank transfer slip vouchers for all verified active staff nodes.", "success");
  };

  // --- FILTER ENGINES ---
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.id.toLowerCase().includes(searchQuery.toLowerCase());
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
    { key: 'status', label: 'Employment Status', render: (row) => <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600"><UserCheck className="w-3 h-3"/> {row.status}</span> }
  ];

  const attendanceColumns = [
    { key: 'id', label: 'Emp ID', className: 'font-mono text-xs text-slate-400' },
    { key: 'name', label: 'Staff Member', className: 'font-semibold' },
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
    { key: 'hours', label: 'Logged Hours', className: 'font-bold text-slate-700 dark:text-slate-300' }
  ];

  const payrollColumns = [
    { key: 'id', label: 'Emp ID', className: 'font-mono text-xs text-slate-400' },
    { key: 'name', label: 'Staff Member', className: 'font-semibold' },
    { key: 'baseSalary', label: 'Basic Fix', render: (row) => <span>{formatPKR(row.baseSalary)}</span> },
    { key: 'allowances', label: 'Allowances (+)', className: 'text-emerald-600 text-xs', render: (row) => <span>+{formatPKR(row.allowances)}</span> },
    { key: 'deductions', label: 'Deductions (-)', className: 'text-rose-600 text-xs', render: (row) => row.deductions > 0 ? <span>-{formatPKR(row.deductions)}</span> : <span>-</span> },
    { key: 'netSalary', label: 'Net Payable Disbursed', className: 'font-black text-slate-900 dark:text-slate-100', render: (row) => <span>{formatPKR(row.netSalary)}</span> },
    { 
      key: 'payoutStatus', 
      label: 'Voucher Status',
      render: (row) => row.payoutStatus === 'Processed' 
        ? <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">Paid</span>
        : <span className="text-[11px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded">On Hold</span>
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
          className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${activeTab === 'directory' ? 'border-b-indigo-600 text-indigo-600 font-black' : 'border-b-transparent text-slate-450 hover:text-slate-200'}`}
        >
          <Users className="w-3.5 h-3.5"/> Staff Profiles Directory
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${activeTab === 'attendance' ? 'border-b-indigo-600 text-indigo-600 font-black' : 'border-b-transparent text-slate-450 hover:text-slate-200'}`}
        >
          <Fingerprint className="w-3.5 h-3.5"/> Live Attendance Log
        </button>
        <button 
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${activeTab === 'payroll' ? 'border-b-indigo-600 text-indigo-600 font-black' : 'border-b-transparent text-slate-450 hover:text-slate-200'}`}
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
                </Select>
                <Button variant="primary" size="sm" className="h-9 text-xs bg-indigo-600" icon={UserPlus}>Add New Staff</Button>
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
              <div><p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Present Strengths Today</p><h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">4 Employees</h4></div>
              <div className="w-8 h-8 rounded bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 font-bold text-xs">80%</div>
            </div>
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/20 flex justify-between items-center">
              <div><p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Late Arrivals Counter</p><h4 className="text-base font-black text-amber-500 mt-0.5">1 Head Log</h4></div>
              <div className="w-8 h-8 rounded bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 font-bold text-xs">15%</div>
            </div>
            <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/20 flex justify-between items-center">
              <div><p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Unexcused Absents Pool</p><h4 className="text-base font-black text-rose-500 mt-0.5">1 Head Log</h4></div>
              <div className="w-8 h-8 rounded bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 font-bold text-xs">5%</div>
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
                <span className="text-[10px] text-slate-400">Current computation index running over June 2026 data logs.</span>
              </div>
            </div>
            <div className="font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded text-slate-700 dark:text-slate-200 font-bold">
              Total Budget Inflow Required: <span className="text-indigo-600 dark:text-indigo-400 font-black">{formatPKR(389000)}</span>
            </div>
          </div>

          {/* PAYROLL MANAGEMENT DATA TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <Table columns={payrollColumns} data={payrollData} emptyMessage="Payroll allocation vector clear or un-compiled." />
          </div>
        </div>
      )}

    </div>
  );
}
export default HumanResources;