import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import SkeletonLoader from '../components/SkeletonLoader';

const LawsListing = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });

  // Local Filters
  const [search, setSearch] = useState('');
  const [chapter, setChapter] = useState('ALL CHAPTERS'); // 'ALL CHAPTERS', 'CH XVI: OFFENCES AFFECTING HUMAN BODY', etc.
  const [severity, setSeverity] = useState(''); // '', 'high', 'medium', 'low'
  const [cognizableOnly, setCognizableOnly] = useState(false);
  const [bailableOnly, setBailableOnly] = useState(false);

  // Selected dossier details
  const [selectedLaw, setSelectedLaw] = useState(null);
  const [dossierOpen, setDossierOpen] = useState(false);

  // CRUD Admin states
  const [crudOpen, setCrudOpen] = useState(false);
  const [editingLaw, setEditingLaw] = useState(null);

  const fetchLaws = async (pageNumber = 1, append = false) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pageNumber);
      queryParams.append('limit', 6);

      if (search) queryParams.append('search', search);

      // Map chapter dropdown to database categories
      if (chapter === 'CH XVI: OFFENCES AFFECTING HUMAN BODY') {
        queryParams.append('category', 'Of Offences Affecting The Human Body');
      } else if (chapter === 'CH XVII: OFFENCES AGAINST PROPERTY') {
        queryParams.append('category', 'Of Offences Against Property');
      } else if (chapter === 'CH IV: GENERAL EXCEPTIONS') {
        queryParams.append('category', 'Of General Exceptions');
      }

      if (severity) queryParams.append('importance', severity.toLowerCase());
      if (cognizableOnly) queryParams.append('cognizable', 'true');
      if (bailableOnly) queryParams.append('bailable', 'true');

      const response = await API.get(`/laws?${queryParams.toString()}`);
      const newLaws = response.data.data || [];
      const newPagination = response.data.pagination || { page: 1, totalPages: 1, total: 0 };

      if (append) {
        setLaws((prev) => {
          const existingIds = new Set(prev.map(l => l._id));
          const filteredNew = newLaws.filter(l => !existingIds.has(l._id));
          return [...prev, ...filteredNew];
        });
      } else {
        setLaws(newLaws);
      }

      setPagination({
        page: newPagination.page,
        limit: newPagination.limit,
        total: newPagination.total,
        totalPages: newPagination.totalPages,
      });
    } catch (err) {
      toast.error('Failed to load statutory records.');
    } finally {
      setLoading(false);
    }
  };

  // Run search when filters update
  useEffect(() => {
    fetchLaws(1, false);
  }, [chapter, severity, cognizableOnly, bailableOnly]);

  const handleExecuteScan = (e) => {
    e.preventDefault();
    fetchLaws(1, false);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchLaws(pagination.page + 1, true);
    }
  };

  const handleOpenDossier = (law) => {
    setSelectedLaw(law);
    setDossierOpen(true);
  };

  const handleDeleteLaw = async (law) => {
    if (window.confirm(`Are you absolutely sure you want to delete SEC. ${law.sectionNumber}: ${law.title}?`)) {
      try {
        await API.delete(`/laws/${law._id}`);
        toast.success(`Section ${law.sectionNumber} successfully purged from database.`);
        fetchLaws(1, false);
      } catch (err) {
        toast.error('Failed to purge statutory record.');
      }
    }
  };

  const handleToggleArchive = async (law) => {
    try {
      const endpoint = law.isArchived ? `/laws/${law._id}/restore` : `/laws/${law._id}/archive`;
      await API.patch(endpoint);
      toast.success(`Section ${law.sectionNumber} successfully ${law.isArchived ? 'restored' : 'archived'}.`);
      fetchLaws(1, false);
    } catch (err) {
      toast.error('Failed to update archive status.');
    }
  };

  // Formik validation for Create / Edit law
  const formik = useFormik({
    initialValues: {
      sectionNumber: editingLaw?.sectionNumber || '',
      title: editingLaw?.title || '',
      description: editingLaw?.description || '',
      actName: editingLaw?.actName || 'IPC',
      chapter: editingLaw?.chapter || '',
      category: editingLaw?.category || '',
      bailable: editingLaw?.bailable ?? false,
      cognizable: editingLaw?.cognizable ?? true,
      triableBy: editingLaw?.triableBy || '',
      punishmentDetails: editingLaw?.punishmentDetails || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      sectionNumber: Yup.string().required('Section designation code is required'),
      title: Yup.string().required('Statutory title is required'),
      description: Yup.string().required('Statutory description text is required'),
      category: Yup.string().required('Chapter title group is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingLaw) {
          await API.patch(`/laws/${editingLaw._id}`, values);
          toast.success(`SEC. ${values.sectionNumber} updated successfully.`);
        } else {
          await API.post('/laws', values);
          toast.success(`SEC. ${values.sectionNumber} registered successfully.`);
        }
        setCrudOpen(false);
        setEditingLaw(null);
        resetForm();
        fetchLaws(1, false);
      } catch (err) {
        toast.error(err.response?.data?.message || 'API transaction failed.');
      }
    },
  });

  return (
    <div className="flex-1 p-8 lg:p-12 bg-jurist-bg text-jurist-text min-h-screen">
      <Helmet>
        <title>Penal Code Statutory Registry | Momentum OS</title>
        <meta name="description" content="Explore and search the complete database of Indian Penal Code statutes with details on cognizable and bailable offenses." />
        <meta property="og:title" content="Statutory Registry - Momentum OS" />
        <meta property="og:description" content="Browse legal code statutes and query offense categories." />
      </Helmet>

      <header className="mb-12 border-b-4 border-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-7xl uppercase tracking-tighter leading-none mb-2">STATUTORY REGISTRY</h1>
          <p className="font-mono text-sm font-bold uppercase bg-black text-white inline-block px-2 py-1 shadow-brutal">
            INDIAN PENAL CODE DATABASE // ACCESS GRANTED
          </p>
        </div>
        <div className="text-left md:text-right flex flex-col md:items-end gap-2">
          {isAdmin && (
            <button
              onClick={() => {
                setEditingLaw(null);
                setCrudOpen(true);
              }}
              className="brutal-border bg-[#000000] text-white px-4 py-2 font-display text-lg uppercase tracking-wider shadow-brutal hover:bg-jurist-primary active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2 mb-2"
            >
              <span className="material-symbols-outlined text-base">add</span>
              CREATE OFFENSE
            </button>
          )}
          <div>
            <p className="font-mono text-xs font-bold uppercase">LAST SYNC: NOMINAL</p>
            <p className="font-mono text-xs font-bold uppercase text-jurist-primary">STATUS: SECURE</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Filters / Identify Protocol */}
        <div className="xl:col-span-1 space-y-6">
          <div className="brutal-border bg-white shadow-brutal p-6">
            <h3 className="font-display text-2xl uppercase border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">filter_alt</span>
              IDENTIFY PROTOCOL
            </h3>
            <form onSubmit={handleExecuteScan} className="space-y-4 font-label font-bold text-sm uppercase text-left">
              {/* Text Search inside protocol */}
              <div className="space-y-2">
                <label htmlFor="keywordSearch" className="block">KEYWORD SCAN</label>
                <div className="flex items-center brutal-border bg-white px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="material-symbols-outlined text-jurist-text mr-2 text-sm font-bold">search</span>
                  <input
                    id="keywordSearch"
                    name="keywordSearch"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none outline-none font-mono text-xs placeholder:text-gray-500 uppercase w-full focus:ring-0 p-0 text-black"
                    placeholder="QUERY KEYWORD..."
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="chapterDesignation" className="block">CHAPTER DESIGNATION</label>
                <select
                  id="chapterDesignation"
                  name="chapterDesignation"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  className="w-full brutal-border p-2 bg-[#EAE7DC] text-black focus:outline-none focus:ring-0 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono text-xs font-bold"
                >
                  <option value="ALL CHAPTERS">ALL CHAPTERS</option>
                  <option value="CH XVI: OFFENCES AFFECTING HUMAN BODY">CH XVI: OFFENCES AFFECTING HUMAN BODY</option>
                  <option value="CH XVII: OFFENCES AGAINST PROPERTY">CH XVII: OFFENCES AGAINST PROPERTY</option>
                  <option value="CH IV: GENERAL EXCEPTIONS">CH IV: GENERAL EXCEPTIONS</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block">SEVERITY INDEX</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSeverity(severity === 'high' ? '' : 'high')}
                    className={`flex-1 brutal-border py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs ${
                      severity === 'high' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    HIGH
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeverity(severity === 'medium' ? '' : 'medium')}
                    className={`flex-1 brutal-border py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs ${
                      severity === 'medium' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    MED
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeverity(severity === 'low' ? '' : 'low')}
                    className={`flex-1 brutal-border py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-xs ${
                      severity === 'low' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    LOW
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t-2 border-black border-dashed">
                <label htmlFor="cognizableCheckbox" className="flex items-center gap-3 cursor-pointer">
                  <input
                    id="cognizableCheckbox"
                    name="cognizableCheckbox"
                    checked={cognizableOnly}
                    onChange={(e) => setCognizableOnly(e.target.checked)}
                    className="brutal-border text-jurist-primary focus:ring-0 rounded-none w-5 h-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white cursor-pointer"
                    type="checkbox"
                  />
                  <span>COGNIZABLE ONLY</span>
                </label>
                <label htmlFor="bailableCheckbox" className="flex items-center gap-3 cursor-pointer">
                  <input
                    id="bailableCheckbox"
                    name="bailableCheckbox"
                    checked={bailableOnly}
                    onChange={(e) => setBailableOnly(e.target.checked)}
                    className="brutal-border text-jurist-primary focus:ring-0 rounded-none w-5 h-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white cursor-pointer"
                    type="checkbox"
                  />
                  <span>BAILABLE ONLY</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full brutal-border bg-jurist-primary text-white py-3 mt-6 shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-black transition-colors flex justify-center items-center gap-2 font-display text-xl uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-base">radar</span>
                EXECUTE SCAN
              </button>
            </form>
          </div>

          {/* System Status Panel */}
          <div className="brutal-border bg-black text-white p-4 font-mono text-xs uppercase shadow-brutal text-left">
            <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
              <span>NODES ACTIVE:</span>
              <span className="text-jurist-primary font-bold">14/14</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2 mb-2">
              <span>DB INTEGRITY:</span>
              <span className="text-green-500 font-bold">100%</span>
            </div>
            <div className="flex justify-between">
              <span>ENCRYPTION:</span>
              <span className="text-yellow-500 font-bold">AES-256-GCM</span>
            </div>
          </div>
        </div>

        {/* Registry Listing */}
        <div className="xl:col-span-3 space-y-6">
          {/* Search Results Header */}
          <div className="flex justify-between items-center brutal-border bg-white p-4 shadow-brutal font-label font-bold uppercase">
            <span>SHOWING: {pagination.total} RECORDS IDENTIFIED</span>
            <div className="flex gap-4">
              <span className="text-gray-500 text-sm flex items-center gap-1 cursor-pointer hover:text-black">
                <span className="material-symbols-outlined text-sm">sort</span> SORT BY: RELEVANCE
              </span>
            </div>
          </div>

          {/* Grid Layout for Sections */}
          {loading && laws.length === 0 ? (
            <SkeletonLoader type="card" count={4} />
          ) : laws.length === 0 ? (
            <div className="brutal-border bg-white p-12 text-center shadow-brutal font-mono font-bold text-sm">
              📂 NO RECORDS IDENTIFIED FOR THE SPECIFIED PARAMETERS
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {laws.map((law) => {
                const isHigh = law.importance === 'high' || law.sectionNumber === '302' || law.sectionNumber === '120B';
                return (
                  <div
                    key={law._id}
                    className="brutal-border bg-white flex flex-col shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all group relative overflow-hidden text-left"
                  >
                    {/* Severity Indicator */}
                    {isHigh && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-jurist-primary brutal-border-l brutal-border-b flex items-center justify-center -mr-2 -mt-2 rotate-12 group-hover:rotate-0 transition-transform z-10 border-l-2 border-b-2 border-black">
                        <span className="material-symbols-outlined text-white text-3xl">warning</span>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col z-20 relative bg-white">
                      <div className="font-mono text-[10px] font-bold uppercase mb-2 text-jurist-primary bg-black inline-block px-2 py-1 self-start shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black text-white">
                        {law.chapter ? `CH ${law.chapter}` : law.actName} // SEC {law.sectionNumber}
                      </div>
                      <h2 className="font-display text-4xl uppercase leading-none mb-4 group-hover:text-jurist-primary transition-colors pr-8">
                        {law.title}
                      </h2>
                      <p className="font-body text-sm leading-relaxed mb-6 border-l-4 border-black pl-3 line-clamp-3">
                        {law.description}
                      </p>
                      <div className="mt-auto grid grid-cols-2 gap-2 border-t-2 border-black pt-4 font-mono text-[10px] font-bold">
                        <div className="brutal-border p-2 bg-[#EAE7DC] text-center uppercase">
                          {law.cognizable ? 'COGNIZABLE' : 'NON-COGNIZABLE'}
                        </div>
                        <div className={`brutal-border p-2 text-center uppercase ${law.bailable ? 'bg-jurist-primary text-white' : 'bg-[#EAE7DC] text-black'}`}>
                          {law.bailable ? 'BAILABLE' : 'NON-BAILABLE'}
                        </div>
                        <div className="brutal-border p-2 col-span-2 bg-black text-white text-center uppercase truncate">
                          {law.triableBy || 'TRIED BY ANY MAGISTRATE'}
                        </div>
                      </div>
                    </div>
                    {/* Admin CRUD actions block */}
                    {isAdmin && (
                      <div className="flex flex-col border-t-2 border-black z-20 relative font-mono text-xs">
                        <div className="flex border-b-2 border-black">
                          <button
                            onClick={() => {
                              setEditingLaw(law);
                              setCrudOpen(true);
                            }}
                            className="flex-1 py-2 bg-yellow-300 hover:bg-black hover:text-white transition-colors border-r-2 border-black text-center font-bold text-black"
                          >
                            EDIT DOSSIER
                          </button>
                          <button
                            onClick={() => handleToggleArchive(law)}
                            className={`flex-1 py-2 hover:bg-black hover:text-white transition-colors border-r-2 border-black text-center font-bold text-black ${law.isArchived ? 'bg-green-400' : 'bg-gray-300'}`}
                          >
                            {law.isArchived ? 'RESTORE RECORD' : 'ARCHIVE RECORD'}
                          </button>
                          <button
                            onClick={() => handleDeleteLaw(law)}
                            className="flex-1 py-2 bg-jurist-primary text-white hover:bg-black transition-colors text-center font-bold"
                          >
                            PURGE
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => navigate(`/laws/${law._id}`)}
                      className="w-full border-t-2 border-black bg-[#EAE7DC] hover:bg-black hover:text-white py-3 font-label font-bold uppercase text-sm transition-colors flex justify-center items-center gap-2 z-20 relative"
                    >
                      ACCESS FULL DOSSIER <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination / Load More */}
          {pagination.page < pagination.totalPages && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="brutal-border bg-black text-white px-8 py-4 font-display text-xl uppercase tracking-wider shadow-brutal hover:bg-jurist-primary active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">download</span>
                {loading ? 'SCANNING NEXT SECTIONS...' : 'LOAD SUBSEQUENT RECORDS'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dossier Detail Modal */}
      {selectedLaw && (
        <Modal
          isOpen={dossierOpen}
          onClose={() => setDossierOpen(false)}
          title={`DOSSIER: SECTION ${selectedLaw.sectionNumber}`}
          footer={
            <button
              onClick={() => setDossierOpen(false)}
              className="px-6 py-2.5 brutal-btn text-sm"
            >
              CLOSE RECORDS
            </button>
          }
        >
          <div className="space-y-6 text-left">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="font-display text-3xl uppercase leading-none text-jurist-primary mb-1">
                  {selectedLaw.title}
                </h4>
                <p className="font-mono text-xs uppercase tracking-wider text-black/60">
                  {selectedLaw.actName} &mdash; CHAPTER {selectedLaw.chapter || 'N/A'}
                </p>
              </div>
              <span className={`px-3 py-1 brutal-border font-mono text-xs font-bold uppercase ${selectedLaw.status === 'repealed' ? 'bg-black text-white' : selectedLaw.status === 'amended' ? 'bg-jurist-primary text-white' : 'bg-green-400 text-black'}`}>
                {selectedLaw.status}
              </span>
            </div>

            <div className="border-l-4 border-black pl-4 py-2 bg-white/40 p-4 brutal-border">
              <h5 className="font-mono text-xs font-bold uppercase text-black/60 mb-2">Statutory Description</h5>
              <p className="font-body text-base leading-relaxed text-black">
                {selectedLaw.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="brutal-border bg-white p-3 font-mono text-xs space-y-1">
                <span className="text-black/60 font-bold block">CLASSIFICATION</span>
                <div className="flex justify-between">
                  <span>COGNIZABLE:</span>
                  <span className="font-bold text-jurist-primary">{selectedLaw.cognizable ? 'YES' : 'NO'}</span>
                </div>
                <div className="flex justify-between">
                  <span>BAILABLE:</span>
                  <span className="font-bold text-jurist-primary">{selectedLaw.bailable ? 'YES' : 'NO'}</span>
                </div>
              </div>
              
              <div className="brutal-border bg-white p-3 font-mono text-xs space-y-1">
                <span className="text-black/60 font-bold block">JURISDICTION</span>
                <div className="truncate">TRIABLE BY: <span className="font-bold">{selectedLaw.triableBy || 'ANY MAGISTRATE'}</span></div>
                <div>STATE APPLICABILITY: <span className="font-bold">{selectedLaw.state || 'ALL STATES'}</span></div>
              </div>
            </div>

            {selectedLaw.punishmentDetails && (
              <div className="brutal-border bg-black text-white p-4 font-mono text-xs space-y-2">
                <span className="text-jurist-primary font-bold block">// PENAL CONSEQUENCE INDEX</span>
                <p className="leading-relaxed">
                  {selectedLaw.punishmentDetails}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Admin CRUD Modal (Create & Edit) */}
      {crudOpen && (
        <Modal
          isOpen={crudOpen}
          onClose={() => {
            setCrudOpen(false);
            setEditingLaw(null);
          }}
          title={editingLaw ? `EDIT STATUTORY RECORD: SEC. ${editingLaw.sectionNumber}` : 'REGISTER NEW STATUTORY OFFENSE'}
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4 text-left font-body">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Section Code"
                name="sectionNumber"
                value={formik.values.sectionNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.sectionNumber}
                touched={formik.touched.sectionNumber}
                placeholder="e.g. 302"
                required
              />
              <Input
                label="Act Name"
                name="actName"
                value={formik.values.actName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. IPC"
              />
            </div>

            <Input
              label="Statutory Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.title}
              touched={formik.touched.title}
              placeholder="e.g. Punishment for murder"
              required
            />

            <div className="flex flex-col gap-2">
              <label className="block font-label font-bold uppercase tracking-wide text-ink text-sm">
                Description / Code Text *
              </label>
              <textarea
                name="description"
                rows="3"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter complete statutory definition"
                className="w-full p-3 brutal-border bg-[#EAE7DC] text-black focus:outline-none focus:ring-0 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-body text-sm"
              />
              {formik.errors.description && formik.touched.description && (
                <span className="font-mono text-xs font-bold text-primary">⚠️ {formik.errors.description}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Chapter"
                name="chapter"
                value={formik.values.chapter}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. XVI"
              />
              <Input
                label="Category / Group"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.category}
                touched={formik.touched.category}
                placeholder="e.g. Of Offences Affecting The Human Body"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase block">COGNIZABILITY</label>
                <select
                  name="cognizable"
                  value={formik.values.cognizable}
                  onChange={(e) => formik.setFieldValue('cognizable', e.target.value === 'true')}
                  className="w-full p-2 brutal-border bg-[#EAE7DC] text-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="true">Cognizable</option>
                  <option value="false">Non-Cognizable</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold uppercase block">BAIL STATUS</label>
                <select
                  name="bailable"
                  value={formik.values.bailable}
                  onChange={(e) => formik.setFieldValue('bailable', e.target.value === 'true')}
                  className="w-full p-2 brutal-border bg-[#EAE7DC] text-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="true">Bailable</option>
                  <option value="false">Non-Bailable</option>
                </select>
              </div>
            </div>

            <Input
              label="Triable By Court"
              name="triableBy"
              value={formik.values.triableBy}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. Court of Session"
            />

            <div className="flex flex-col gap-2">
              <label className="block font-label font-bold uppercase tracking-wide text-ink text-sm">
                Punishment Details
              </label>
              <input
                type="text"
                name="punishmentDetails"
                value={formik.values.punishmentDetails}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Death, or imprisonment for life, and fine"
                className="w-full p-3 brutal-border bg-[#EAE7DC] text-black focus:outline-none focus:ring-0 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-body text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t-2 border-black border-dashed">
              <button
                type="button"
                onClick={() => {
                  setCrudOpen(false);
                  setEditingLaw(null);
                }}
                className="px-6 py-2.5 brutal-border bg-white text-black hover:bg-gray-200 transition-colors uppercase font-bold text-xs"
              >
                CANCEL TRANSACTION
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-6 py-2.5 brutal-btn text-xs disabled:opacity-50"
              >
                {formik.isSubmitting ? 'TRANSACTING...' : 'COMMIT TRANSACTION'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default LawsListing;
