import React, { useState, useRef } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { SupabaseSyncModal } from './SupabaseSyncModal';
import {
  Settings as SettingsIcon,
  Save,
  Clock,
  Database,
  CheckCircle2,
  Download,
  Upload,
  Trash2,
  Cloud,
  Server,
  AlertTriangle,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportDatabaseJson,
    importDatabaseJson,
    clearAllData,
    addToast,
    isSupabaseConfigured,
  } = useLibrary();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  const [libraryName, setLibraryName] = useState(settings.libraryName);
  const [institutionName, setInstitutionName] = useState(settings.institutionName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);

  const [openingWeekdays, setOpeningWeekdays] = useState(settings.openingHoursWeekdays);
  const [openingSaturday, setOpeningSaturday] = useState(settings.openingHoursSaturday);

  const [studentDays, setStudentDays] = useState(settings.defaultStudentLoanDays);
  const [teacherDays, setTeacherDays] = useState(settings.defaultTeacherLoanDays);
  const [staffDays, setStaffDays] = useState(settings.defaultStaffLoanDays);

  const [maxStudentBooks, setMaxStudentBooks] = useState(settings.maxStudentBooks);
  const [maxTeacherBooks, setMaxTeacherBooks] = useState(settings.maxTeacherBooks);

  const [finePerDay, setFinePerDay] = useState(settings.finePerDayLkr);
  const [gracePeriod, setGracePeriod] = useState(settings.gracePeriodDays);
  const [renewalLimit, setRenewalLimit] = useState(settings.maxRenewalCount);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDatabaseJson(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      libraryName,
      institutionName,
      address,
      phone,
      email,
      openingHoursWeekdays: openingWeekdays,
      openingHoursSaturday: openingSaturday,
      defaultStudentLoanDays: Number(studentDays),
      defaultTeacherLoanDays: Number(teacherDays),
      defaultStaffLoanDays: Number(staffDays),
      maxStudentBooks: Number(maxStudentBooks),
      maxTeacherBooks: Number(maxTeacherBooks),
      finePerDayLkr: Number(finePerDay),
      gracePeriodDays: Number(gracePeriod),
      maxRenewalCount: Number(renewalLimit),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white dark:bg-[#14171F] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-red-700 dark:text-amber-400" />
            <span>Library Parameters & System Settings</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure borrowing quotas, overdue rates in LKR, operating schedules, and Supabase cloud database backend.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 text-xs font-bold text-white bg-red-800 hover:bg-red-700 rounded-xl shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Database & Supabase Cloud Connection Card */}
      <div className="bg-white dark:bg-[#14171F] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-800/40 text-amber-400 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span>Database & Supabase Cloud Backend</span>
                {isSupabaseConfigured ? (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Supabase Live Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Local Storage Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-neutral-500">
                Centralized PostgreSQL database connection for 30,000+ books and multi-staff synchronization.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Server className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? 'Manage Supabase Connection' : 'Connect Supabase Cloud'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={exportDatabaseJson}
            className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-left transition flex items-center gap-3"
          >
            <Download className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-white">Export Full JSON Backup</p>
              <p className="text-[10px] text-neutral-500">Download entire collection & circulation data</p>
            </div>
          </button>

          <label className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-left transition flex items-center gap-3 cursor-pointer">
            <Upload className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-white">Restore from Backup</p>
              <p className="text-[10px] text-neutral-500">Upload and restore a previous JSON backup</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all collections and member records? This action cannot be undone.')) {
                clearAllData();
              }
            }}
            className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-neutral-200 dark:border-neutral-800 hover:border-rose-300 text-left transition flex items-center gap-3 group"
          >
            <Trash2 className="w-4 h-4 text-rose-500 flex-shrink-0 group-hover:scale-110 transition" />
            <div>
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Reset Local Collections</p>
              <p className="text-[10px] text-neutral-500">Purge local browser cache & start empty</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveAll} className="space-y-6 text-xs">
        {/* Section 1: Institutional Details */}
        <div className="bg-white dark:bg-[#14171F] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
              Institutional Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Library Name
              </label>
              <input
                type="text"
                value={libraryName}
                onChange={(e) => setLibraryName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                College / Institution Name
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Campus Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Official Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 font-mono bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Circulation Rules & Fines */}
        <div className="bg-white dark:bg-[#14171F] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
              Circulation Durations & Overdue Rates
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Student Loan Period (Days)
              </label>
              <input
                type="number"
                value={studentDays}
                onChange={(e) => setStudentDays(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono font-bold bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Teacher Loan Period (Days)
              </label>
              <input
                type="number"
                value={teacherDays}
                onChange={(e) => setTeacherDays(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono font-bold bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Max Student Quota (Books)
              </label>
              <input
                type="number"
                value={maxStudentBooks}
                onChange={(e) => setMaxStudentBooks(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono font-bold bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Overdue Rate (LKR / Day)
              </label>
              <input
                type="number"
                step="0.5"
                value={finePerDay}
                onChange={(e) => setFinePerDay(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono font-bold text-red-700 dark:text-amber-400 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Grace Period (Days)
              </label>
              <input
                type="number"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Max Renewals Allowed
              </label>
              <input
                type="number"
                value={renewalLimit}
                onChange={(e) => setRenewalLimit(Number(e.target.value))}
                className="w-full px-3 py-2 font-mono bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Operating Hours */}
        <div className="bg-white dark:bg-[#14171F] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <Clock className="w-4 h-4 text-red-700 dark:text-amber-400" />
            <h3 className="text-sm font-bold font-heading text-neutral-900 dark:text-white">
              Campus Operating Hours
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Weekdays (Monday – Friday)
              </label>
              <input
                type="text"
                value={openingWeekdays}
                onChange={(e) => setOpeningWeekdays(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Saturday Reference Session
              </label>
              <input
                type="text"
                value={openingSaturday}
                onChange={(e) => setOpeningSaturday(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 font-bold text-white bg-red-800 hover:bg-red-700 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Supabase Sync Modal */}
      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
};
