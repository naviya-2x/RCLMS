import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  BarChart3,
  Calendar,
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  BookOpen,
  Users,
  Receipt,
  Layers,
  TrendingUp,
  Boxes
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { books, members, circulation, fines, inventory, addToast, setPrintData } = useLibrary();

  const [reportType, setReportType] = useState<
    'circulation' | 'popular_books' | 'fines' | 'inventory'
  >('circulation');

  // Real aggregated stats from actual database
  const totalVolume = books.reduce((a, b) => a + (b.totalCopies || 1), 0);
  const activeLoansCount = circulation.filter((c) => c.status === 'active' || c.status === 'renewed').length;
  const overdueCount = circulation.filter((c) => c.status === 'overdue').length;
  const returnedCount = circulation.filter((c) => c.status === 'returned').length;
  const totalPaidFines = fines.filter((f) => f.status === 'paid').reduce((a, b) => a + b.amount, 0);
  const totalUnpaidFines = fines.filter((f) => f.status === 'unpaid').reduce((a, b) => a + b.amount, 0);

  // Category distribution from real catalog
  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {};
    books.forEach((b) => {
      const cat = b.category || 'Uncategorized';
      map[cat] = (map[cat] || 0) + (b.totalCopies || 1);
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [books]);

  const handleExportExcel = () => {
    const headers = 'Metric,Value,Status,Generated\n';
    const rows = [
      `Total Cataloged Books,${totalVolume},In Stock,${new Date().toLocaleDateString()}`,
      `Total Registered Members,${members.length},Active,${new Date().toLocaleDateString()}`,
      `Active Circulation Loans,${activeLoansCount},Issued,${new Date().toLocaleDateString()}`,
      `Overdue Loans,${overdueCount},Overdue,${new Date().toLocaleDateString()}`,
      `Collected Fines (LKR),${totalPaidFines.toFixed(2)},Settled,${new Date().toLocaleDateString()}`,
      `Outstanding Fines (LKR),${totalUnpaidFines.toFixed(2)},Unpaid,${new Date().toLocaleDateString()}`,
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rahula_College_Library_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    addToast({
      type: 'success',
      title: 'Report Downloaded',
      message: 'Exported library metrics CSV file.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-[#14171F] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-700 dark:text-amber-400" />
            <span>Library Analytics & Reports</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Circulation summaries, inventory reports, and audit logs.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 text-xs font-bold text-white bg-red-800 hover:bg-red-700 rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="bg-white dark:bg-[#14171F] p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => setReportType('circulation')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            reportType === 'circulation'
              ? 'bg-red-800 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Circulation Overview</span>
        </button>
        <button
          onClick={() => setReportType('popular_books')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            reportType === 'popular_books'
              ? 'bg-red-800 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Catalog Summary</span>
        </button>
        <button
          onClick={() => setReportType('fines')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            reportType === 'fines'
              ? 'bg-red-800 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Fines Ledger</span>
        </button>
      </div>

      {/* Report Content Panels */}
      {reportType === 'circulation' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#14171F] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="text-xs font-semibold text-neutral-500">Active Checkouts</span>
            <p className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">{activeLoansCount}</p>
            <span className="text-[11px] text-blue-500">Currently in circulation</span>
          </div>
          <div className="bg-white dark:bg-[#14171F] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="text-xs font-semibold text-neutral-500">Overdue Items</span>
            <p className="text-2xl font-bold font-mono text-rose-500">{overdueCount}</p>
            <span className="text-[11px] text-rose-400">Exceeded due date</span>
          </div>
          <div className="bg-white dark:bg-[#14171F] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="text-xs font-semibold text-neutral-500">Returned Checkouts</span>
            <p className="text-2xl font-bold font-mono text-emerald-500">{returnedCount}</p>
            <span className="text-[11px] text-emerald-400">Completed returns</span>
          </div>
        </div>
      )}

      {reportType === 'popular_books' && (
        <div className="bg-white dark:bg-[#14171F] p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
            Category & Subject Volume Summary
          </h3>
          {categoryStats.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">No catalog records found.</p>
          ) : (
            <div className="space-y-2">
              {categoryStats.map((c) => (
                <div key={c.name} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 text-xs border border-neutral-200 dark:border-neutral-800">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{c.name}</span>
                  <span className="font-mono font-bold text-amber-500">{c.count} copies</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {reportType === 'fines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#14171F] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="text-xs font-semibold text-neutral-500">Collected Revenue</span>
            <p className="text-2xl font-bold font-mono text-emerald-500">Rs. {totalPaidFines.toFixed(2)}</p>
            <span className="text-[11px] text-emerald-400">Paid fines settled</span>
          </div>
          <div className="bg-white dark:bg-[#14171F] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-1">
            <span className="text-xs font-semibold text-neutral-500">Unpaid Overdue Fines</span>
            <p className="text-2xl font-bold font-mono text-rose-500">Rs. {totalUnpaidFines.toFixed(2)}</p>
            <span className="text-[11px] text-rose-400">Outstanding balance</span>
          </div>
        </div>
      )}
    </div>
  );
};
