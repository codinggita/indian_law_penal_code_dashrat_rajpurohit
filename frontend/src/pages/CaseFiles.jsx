import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';

const initialCases = [
  {
    id: '1',
    firNumber: 'FIR 104/2026',
    sections: 'SEC. 302, 120B IPC',
    officer: 'Inspector R. Singh',
    updatedAt: '2026-06-01',
    status: 'investigation',
    subject: 'Homicide near Northern sector boundary',
  },
  {
    id: '2',
    firNumber: 'FIR 211/2026',
    sections: 'SEC. 379, 411 IPC',
    officer: 'Sub-Inspector A. Verma',
    updatedAt: '2026-06-03',
    status: 'fir',
    subject: 'Larceny of high-grade copper coil',
  },
  {
    id: '3',
    firNumber: 'FIR 94/2026',
    sections: 'SEC. 420 IPC',
    officer: 'Inspector S. Roy',
    updatedAt: '2026-05-28',
    status: 'trial',
    subject: 'Financial embezzlement at registry node',
  },
  {
    id: '4',
    firNumber: 'FIR 45/2026',
    sections: 'SEC. 498A IPC',
    officer: 'Inspector P. Patil',
    updatedAt: '2026-05-15',
    status: 'disposed',
    subject: 'Statutory dispute mediation settlement',
  },
];

const CaseFiles = () => {
  const { isAdmin } = useAuth();
  const [cases, setCases] = useState(initialCases);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newCase, setNewCase] = useState({
    firNumber: '',
    sections: '',
    officer: '',
    subject: '',
    status: 'fir',
  });

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!newCase.firNumber || !newCase.sections || !newCase.officer) {
      toast.error('All asterisk fields are required.');
      return;
    }

    const created = {
      id: Date.now().toString(),
      firNumber: newCase.firNumber,
      sections: newCase.sections,
      officer: newCase.officer,
      subject: newCase.subject || 'General investigation case file',
      updatedAt: new Date().toISOString().split('T')[0],
      status: newCase.status,
    };

    setCases((prev) => [...prev, created]);
    setIsModalOpen(false);
    setNewCase({ firNumber: '', sections: '', officer: '', subject: '', status: 'fir' });
    toast.success(`${created.firNumber} successfully enlisted in registry!`);
  };

  const handleMoveCase = (id, direction) => {
    const statuses = ['fir', 'investigation', 'trial', 'disposed'];
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const currIdx = statuses.indexOf(c.status);
        let nextIdx = currIdx + direction;
        if (nextIdx < 0) nextIdx = 0;
        if (nextIdx >= statuses.length) nextIdx = statuses.length - 1;
        return { ...c, status: statuses[nextIdx], updatedAt: new Date().toISOString().split('T')[0] };
      })
    );
    toast.success('Case file status reassigned.');
  };

  const renderColumn = (title, statusName, bgColor, borderColor) => {
    const filtered = cases.filter((c) => c.status === statusName);
    return (
      <div className="flex-1 flex flex-col min-w-[280px] border-2 border-black bg-white shadow-brutalist-md text-left">
        {/* Column Header */}
        <div className={`p-4 border-b-2 border-black ${bgColor} text-black font-headline font-black text-sm uppercase tracking-wider flex justify-between items-center`}>
          <span>{title}</span>
          <span className="bg-black text-white px-2 py-0.5 text-xs font-mono">{filtered.length}</span>
        </div>
        
        {/* Column Cards Container */}
        <div className="p-4 flex-1 space-y-4 overflow-y-auto min-h-[400px]">
          {filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center border-2 border-black border-dashed p-8 text-center text-black/40 font-mono text-xs select-none">
              📂 STAGE EMPTY
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className={`border-2 border-black p-4 bg-brand-beige shadow-brutalist-sm hover:shadow-brutalist-md hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all relative group text-left`}
              >
                <div className="font-mono text-[10px] font-black uppercase text-brand-crimson mb-1">
                  {c.firNumber}
                </div>
                <h4 className="font-headline font-black text-base uppercase mb-2 leading-tight">
                  {c.sections}
                </h4>
                <p className="font-mono text-xs text-black/70 mb-4 line-clamp-2">
                  {c.subject}
                </p>
                <div className="border-t border-black/10 pt-2 flex justify-between items-center text-[10px] font-mono">
                  <span>OFFICER: {c.officer.toUpperCase()}</span>
                  <span className="text-black/50">{c.updatedAt}</span>
                </div>
                
                {/* Drag / Transition Controls — Admin only */}
                {isAdmin && (
                  <div className="flex border-t-2 border-black mt-3 pt-2 gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMoveCase(c.id, -1)}
                      disabled={statusName === 'fir'}
                      className="flex-1 py-1 border border-black bg-white hover:bg-black hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-black font-mono text-[9px] font-black uppercase"
                    >
                      ◀ BACK
                    </button>
                    <button
                      onClick={() => handleMoveCase(c.id, 1)}
                      disabled={statusName === 'disposed'}
                      className="flex-1 py-1 border border-black bg-black text-white hover:bg-brand-crimson disabled:opacity-40 disabled:hover:bg-black font-mono text-[9px] font-black uppercase"
                    >
                      NEXT ▶
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto bg-sandy dark:bg-black text-black dark:text-white min-h-screen">
      <Helmet>
        <title>Active Case Files | Momentum OS</title>
        <meta name="description" content="Kanban dashboard tracking active FIR cases and criminal investigation files." />
      </Helmet>
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-black pb-4 gap-4 text-left">
        <div>
          <h2 className="font-display text-4xl uppercase tracking-wider text-black dark:text-white">
            📂 Case Files Registry
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-black/60 dark:text-white/60">
            Track statutory enforcement actions, investigations, and judicial trial stages
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="brutal-border bg-black text-white px-4 py-2 font-display text-lg uppercase tracking-wider shadow-brutal hover:bg-brand-crimson active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">create_new_folder</span>
            REGISTER CASE
          </button>
        )}
        {!isAdmin && (
          <span className="font-mono text-xs font-bold uppercase px-3 py-1.5 border-2 border-black bg-amber-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            🔒 READ-ONLY MODE // CLEARANCE LEVEL 1
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Sidebar statistics metrics */}
        <div className="xl:col-span-1 space-y-6 text-left">
          <div className="brutal-border bg-white p-6 shadow-brutal text-black">
            <h3 className="font-display text-xl uppercase border-b-2 border-black pb-2 mb-4">
              Dossier Overview
            </h3>
            <div className="space-y-4 font-mono text-xs uppercase">
              <div className="flex justify-between border-b border-black/10 pb-1.5">
                <span>FIR Registered:</span>
                <span className="font-bold">{cases.filter(c => c.status === 'fir').length}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1.5">
                <span>Investigation:</span>
                <span className="font-bold">{cases.filter(c => c.status === 'investigation').length}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1.5">
                <span>Trial Stage:</span>
                <span className="font-bold">{cases.filter(c => c.status === 'trial').length}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1.5">
                <span>Resolved:</span>
                <span className="font-bold">{cases.filter(c => c.status === 'disposed').length}</span>
              </div>
              <div className="flex justify-between pt-2 text-brand-crimson font-black text-sm">
                <span>TOTAL ACTIVE:</span>
                <span>{cases.filter(c => c.status !== 'disposed').length}</span>
              </div>
            </div>
          </div>

          <div className="brutal-border bg-black text-white p-4 font-mono text-[10px] uppercase shadow-brutal leading-relaxed">
            <span className="text-brand-crimson font-black block mb-2">// BOARD INSTRUCTIONS</span>
            Reassign stages using the quick transition buttons on each case dossier. Real-time logging is enabled.
          </div>
        </div>

        {/* Kanban Board columns layout */}
        <div className="xl:col-span-4 flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
          {renderColumn('FIR Registry', 'fir', 'bg-red-200', 'border-red-400')}
          {renderColumn('Investigation', 'investigation', 'bg-amber-100', 'border-amber-400')}
          {renderColumn('Trial Stage', 'trial', 'bg-blue-100', 'border-blue-400')}
          {renderColumn('Disposed', 'disposed', 'bg-green-100', 'border-green-400')}
        </div>
      </div>

      {/* Register Case Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="REGISTER NEW CASE FILE"
        >
          <form onSubmit={handleCreateCase} className="space-y-4 text-left font-body">
            <Input
              label="FIR Registry Code *"
              name="firNumber"
              value={newCase.firNumber}
              onChange={(e) => setNewCase({ ...newCase, firNumber: e.target.value })}
              placeholder="e.g. FIR 402/2026"
              required
            />
            
            <Input
              label="Statutory Section Violation *"
              name="sections"
              value={newCase.sections}
              onChange={(e) => setNewCase({ ...newCase, sections: e.target.value })}
              placeholder="e.g. SEC. 302, 120B IPC"
              required
            />
            
            <Input
              label="Investigating Officer [USER_ID] *"
              name="officer"
              value={newCase.officer}
              onChange={(e) => setNewCase({ ...newCase, officer: e.target.value })}
              placeholder="e.g. Inspector R. Singh"
              required
            />

            <div className="flex flex-col gap-2">
              <label className="block font-label font-bold uppercase tracking-wide text-ink text-sm">
                Case Subject Description
              </label>
              <textarea
                value={newCase.subject}
                onChange={(e) => setNewCase({ ...newCase, subject: e.target.value })}
                placeholder="Enter details of the offense and incident..."
                rows="3"
                className="w-full p-3 brutal-border bg-[#EAE7DC] text-black focus:outline-none focus:ring-0 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-body text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5 font-mono text-xs">
              <label className="font-bold uppercase block">INITIAL BOARD STAGE</label>
              <select
                value={newCase.status}
                onChange={(e) => setNewCase({ ...newCase, status: e.target.value })}
                className="w-full p-2 brutal-border bg-[#EAE7DC] text-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <option value="fir">FIR Registered</option>
                <option value="investigation">Under Investigation</option>
                <option value="trial">Trial Stage</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t-2 border-black border-dashed">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 brutal-border bg-white text-black hover:bg-gray-200 transition-colors uppercase font-bold text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 brutal-btn text-xs"
              >
                COMMIT DOSSIER
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CaseFiles;
