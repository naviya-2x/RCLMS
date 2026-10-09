import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Modal } from './Modal';
import { CollegeCrest } from './CollegeCrest';
import { Barcode } from './Barcode';
import { Printer } from 'lucide-react';

export const PrintLibraryCardModal: React.FC = () => {
  const { printData, setPrintData } = useLibrary();

  if (!printData || printData.type !== 'card') return null;

  const member = printData.payload;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => setPrintData(null)}
      title="Official Library Digital Pass"
      subtitle="Institutional student & faculty ID pass"
      size="md"
    >
      <div className="space-y-4">
        {/* Printable Card Container */}
        <div
          id="printable-section"
          className="w-full max-w-sm mx-auto bg-gradient-to-br from-[#1C0404] via-[#120202] to-[#0A0101] text-white p-5 rounded-3xl shadow-2xl border border-amber-500/30 relative overflow-hidden select-none"
        >
          {/* Top Brand Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <CollegeCrest size="sm" lightMode={true} />
            <div className="text-right">
              <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase block font-semibold">
                MEMBER PASS
              </span>
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider block font-mono">
                {member.type}
              </span>
            </div>
          </div>

          {/* Middle Body */}
          <div className="mt-4 flex gap-4 items-center">
            {/* Photo Avatar Frame */}
            <div className="w-20 h-24 rounded-2xl bg-black/40 border border-amber-400/30 overflow-hidden flex flex-col items-center justify-center text-center p-1 flex-shrink-0 shadow-inner">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-base">
                {member.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
              </div>
              <span className="text-[8px] font-mono text-amber-400 mt-1 uppercase">
                {member.admissionNo || 'RC-PASS'}
              </span>
            </div>

            {/* Info Column */}
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-extrabold text-sm text-white truncate leading-tight">
                {member.name}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                {member.grade || member.department || 'Rahula College'}
              </p>

              {member.house && (
                <div className="mt-2">
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300 border border-white/10 inline-block">
                    {member.house} House
                  </span>
                </div>
              )}

              <div className="mt-2 text-[9px] text-neutral-400 space-y-0.5 font-mono">
                <div>ID: {member.memberId}</div>
                <div>EXP: {member.expiryDate}</div>
              </div>
            </div>
          </div>

          {/* Barcode Strip */}
          <div className="mt-4 pt-3 border-t border-white/10 bg-white rounded-xl p-2 flex flex-col items-center">
            <Barcode value={member.memberId} width={180} height={35} showText={false} />
            <span className="text-[9px] font-mono font-bold text-neutral-800 tracking-wider mt-1">
              {member.memberId}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={() => setPrintData(null)}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-white bg-red-800 hover:bg-red-700 rounded-xl shadow-sm flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
