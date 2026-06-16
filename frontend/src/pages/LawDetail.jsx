import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';
import toast from 'react-hot-toast';
import SkeletonLoader from '../components/SkeletonLoader';

const LawDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [law, setLaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchLawDetails = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/laws/${id}`);
        setLaw(res.data.data);
        
        // Retrieve some mock cases relating to this section for visual compliance with the "Task List" design
        setCases([
          { firNumber: 'FIR/2026/0891', suspect: 'A. KUMAR', investigator: 'INSP. SHARMA', status: 'Investigation', date: '2026-05-12' },
          { firNumber: 'FIR/2026/1102', suspect: 'R. SINGH', investigator: 'INSP. PATEL', status: 'Trial Phase', date: '2026-05-24' },
          { firNumber: 'FIR/2026/0430', suspect: 'V. VERMA', investigator: 'SUB-INSP. DEVI', status: 'Disposed', date: '2026-04-18' }
        ]);
      } catch (err) {
        toast.error('Failed to load statutory record details.');
        navigate('/laws');
      } finally {
        setLoading(false);
      }
    };

    fetchLawDetails();
  }, [id, navigate]);

  const handleToggleArchive = async () => {
    try {
      const endpoint = law.isArchived ? `/laws/${law._id}/restore` : `/laws/${law._id}/archive`;
      await API.patch(endpoint);
      toast.success(`Section ${law.sectionNumber} successfully ${law.isArchived ? 'restored' : 'archived'}.`);
      setLaw({ ...law, isArchived: !law.isArchived });
    } catch (err) {
      toast.error('Failed to update archive status.');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col p-8 lg:p-12 justify-center items-center font-mono text-xs uppercase bg-jurist-bg">
        <SkeletonLoader type="card" count={3} />
      </div>
    );
  }

  if (!law) return null;

  const isHigh = law.importance === 'high' || law.sectionNumber === '302' || law.sectionNumber === '120B';

  return (
    <div className="flex-1 p-8 lg:p-12 bg-jurist-bg text-jurist-text min-h-screen">
      <Helmet>
        <title>{`SEC. ${law.sectionNumber}: ${law.title} | Momentum OS`}</title>
        <meta name="description" content={`Detailed statutory review dossier for Section ${law.sectionNumber} of the Indian Penal Code.`} />
      </Helmet>

      {/* Header and Back navigation */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-black pb-6">
        <div>
          <button
            onClick={() => navigate('/laws')}
            className="mb-4 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase hover:text-jurist-primary transition-colors text-black"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO STATUTORY REGISTRY
          </button>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold uppercase bg-black text-white px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black">
              {law.chapter ? `CHAPTER ${law.chapter}` : law.actName}
            </span>
            <span className="font-mono text-xs font-bold uppercase bg-jurist-primary text-white px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black">
              SEC. {law.sectionNumber}
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-none mt-3 text-black">
            {law.title}
          </h1>
        </div>
        
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => toast.error('Editing mode requires administrative authentication check.')}
                className="brutal-border bg-[#000000] text-white px-4 py-2 font-display text-lg uppercase tracking-wider shadow-brutal hover:bg-jurist-primary active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                EDIT STATUTE
              </button>
              <button
                onClick={handleToggleArchive}
                className={`brutal-border text-black px-4 py-2 font-display text-lg uppercase tracking-wider shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2 ${law.isArchived ? 'bg-green-400 hover:bg-green-500' : 'bg-gray-300 hover:bg-gray-400'}`}
              >
                <span className="material-symbols-outlined text-base">{law.isArchived ? 'unarchive' : 'archive'}</span>
                {law.isArchived ? 'RESTORE STATUTE' : 'ARCHIVE STATUTE'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Statutory text card */}
          <div className="brutal-border bg-white shadow-brutal p-8 text-left relative overflow-hidden">
            {isHigh && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-jurist-primary brutal-border-l brutal-border-b flex items-center justify-center -mr-3 -mt-3 rotate-12 z-10 border-l-2 border-b-2 border-black">
                <span className="material-symbols-outlined text-white text-4xl">warning</span>
              </div>
            )}
            <h3 className="font-display text-3xl uppercase tracking-tight border-b-4 border-black pb-2 mb-6 text-black">
              📜 STATUTORY DEFINITION & PRESCRIBED CHARGES
            </h3>
            <p className="font-body text-lg leading-relaxed border-l-8 border-black pl-6 py-2 text-black mb-8">
              {law.description}
            </p>

            {law.punishmentDetails && (
              <div className="brutal-border bg-black text-white p-6 font-mono text-sm space-y-3">
                <div className="text-jurist-primary font-bold tracking-wider">// PENAL CONSEQUENCE REGISTER</div>
                <p className="leading-relaxed opacity-90">
                  {law.punishmentDetails}
                </p>
              </div>
            )}
          </div>

          {/* Related Case files Kanban snippet */}
          <div className="brutal-border bg-white shadow-brutal p-8 text-left">
            <h3 className="font-display text-3xl uppercase tracking-tight border-b-4 border-black pb-2 mb-6 text-black">
              📁 LINKED ACTIVE CASE FILES & TRIALS
            </h3>
            
            <div className="space-y-4 font-mono text-xs">
              {cases.map((c, index) => (
                <div key={index} className="brutal-border p-4 bg-jurist-bg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
                  <div className="space-y-1">
                    <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold block w-max">{c.firNumber}</span>
                    <strong className="text-black text-sm block">ACCUSED SUSPECT: {c.suspect}</strong>
                    <span className="text-black/60 block">INVESTIGATING OFFICER: {c.investigator}</span>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-between">
                    <span className="px-2 py-1 bg-white brutal-border font-bold uppercase">{c.status}</span>
                    <span className="text-black/50">{c.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Dossier details */}
        <div className="space-y-8">
          <div className="brutal-border bg-white p-6 shadow-brutal text-left">
            <h3 className="font-display text-2xl uppercase border-b-2 border-black pb-2 mb-4">
              🛡️ DOSSIER CLASSIFICATIONS
            </h3>
            <div className="space-y-3 font-mono text-xs uppercase">
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span>COGNIZABILITY:</span>
                <span className="font-bold text-jurist-primary">{law.cognizable ? 'COGNIZABLE (NO WARRANT NEEDED)' : 'NON-COGNIZABLE'}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span>BAIL REGISTRY:</span>
                <span className="font-bold text-jurist-primary">{law.bailable ? 'BAILABLE (RIGHT TO BAIL)' : 'NON-BAILABLE'}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span>SEVERITY INDEX:</span>
                <span className="font-bold text-jurist-primary">{law.importance?.toUpperCase() || 'MEDIUM'}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span>JURISDICTIONAL COURT:</span>
                <span className="font-bold text-black">{law.triableBy || 'ANY MAGISTRATE'}</span>
              </div>
              <div className="flex justify-between">
                <span>STATE APPLICABILITY:</span>
                <span className="font-bold text-black">{law.state || 'ALL STATE TERRITORIES'}</span>
              </div>
            </div>
          </div>

          <div className="brutal-border bg-black text-white p-6 shadow-brutal text-left">
            <h3 className="font-display text-2xl uppercase border-b-2 border-gray-700 pb-2 mb-4 text-jurist-primary">
              📋 LEGISLATIVE HISTORICAL LOGS
            </h3>
            <div className="space-y-4 font-mono text-[10px] leading-relaxed text-gray-300">
              {law.updateHistory && law.updateHistory.length > 0 ? (
                law.updateHistory.map((history, idx) => (
                  <div key={idx} className="border-l-2 border-jurist-primary pl-3">
                    <strong className="text-white block">
                      {new Date(history.updatedAt).toLocaleDateString('en-CA')} // {history.updatedBy || 'SYSTEM'}
                    </strong>
                    {history.changes}
                  </div>
                ))
              ) : (
                <div className="border-l-2 border-jurist-primary pl-3">
                  <strong className="text-white block">
                    {new Date(law.createdAt).toLocaleDateString('en-CA')} // SYSTEM REGISTERED
                  </strong>
                  Section record imported from standard legislative source datasets.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawDetail;
