import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';

const initialMembers = [
  {
    id: '1',
    name: 'Dashrat Rajpurohit',
    role: 'Chief Justice Operator',
    clearance: 'Level 5',
    email: 'dashrat@momentum.gov.in',
    badge: 'CJO-001',
    status: 'active',
  },
  {
    id: '2',
    name: 'Inspector R. Singh',
    role: 'Lead Homicide Officer',
    clearance: 'Level 3',
    email: 'r.singh@police.gov.in',
    badge: 'LHO-204',
    status: 'active',
  },
  {
    id: '3',
    name: 'Advocate M. Sen',
    role: 'Prosecution Counsel',
    clearance: 'Level 2',
    email: 'm.sen@advocates.org',
    badge: 'PC-118',
    status: 'on-leave',
  },
  {
    id: '4',
    name: 'Inspector P. Patil',
    role: 'Special Crimes Bureau',
    clearance: 'Level 3',
    email: 'p.patil@police.gov.in',
    badge: 'SCB-871',
    status: 'active',
  },
  {
    id: '5',
    name: 'Guest Operator',
    role: 'Legal Observer',
    clearance: 'Level 1',
    email: 'observer@example.com',
    badge: 'OBS-992',
    status: 'active',
  },
];

const TeamDirectory = () => {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    clearance: 'Level 1',
    email: '',
    badge: '',
  });

  const handleEnlist = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role || !newMember.email || !newMember.badge) {
      toast.error('All fields marked with an asterisk are required.');
      return;
    }

    const created = {
      id: Date.now().toString(),
      name: newMember.name,
      role: newMember.role,
      clearance: newMember.clearance,
      email: newMember.email,
      badge: newMember.badge.toUpperCase(),
      status: 'active',
    };

    setMembers((prev) => [...prev, created]);
    setIsModalOpen(false);
    setNewMember({ name: '', role: '', clearance: 'Level 1', email: '', badge: '' });
    toast.success(`Officer ${created.name} successfully enlisted!`);
  };

  const handleDecommission = (id, name) => {
    if (window.confirm(`Decommission Operator ${name}? Their access credentials will be immediately revoked.`)) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success(`Operator ${name} decommissioned.`);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.role.toLowerCase().includes(search.toLowerCase()) ||
                          m.badge.toLowerCase().includes(search.toLowerCase());
    
    if (filterRole === 'ALL') return matchesSearch;
    return matchesSearch && m.clearance === filterRole;
  });

  return (
    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto bg-sandy dark:bg-black text-black dark:text-white min-h-screen">
      <Helmet>
        <title>Personnel Directory | Momentum OS</title>
        <meta name="description" content="View active judicial officers, advocates, and investigators on the Momentum Penal Code Registry." />
      </Helmet>

      {/* Header panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-black pb-4 gap-4 text-left">
        <div>
          <h2 className="font-display text-4xl uppercase tracking-wider text-black dark:text-white">
            👥 Personnel & Officers Directory
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-black/60 dark:text-white/60">
            Query active operators, clearance levels, and identity badges
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="brutal-border bg-black text-white px-4 py-2 font-display text-lg uppercase tracking-wider shadow-brutal hover:bg-brand-crimson active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            ENLIST MEMBER
          </button>
        )}
        {!isAdmin && (
          <span className="font-mono text-xs font-bold uppercase px-3 py-1.5 border-2 border-black bg-amber-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            🔒 READ-ONLY MODE // CLEARANCE LEVEL 1
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="xl:col-span-1 space-y-6 text-left">
          <div className="brutal-border bg-white p-6 shadow-brutal text-black">
            <h3 className="font-display text-xl uppercase border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">search</span>
              FILTER SEARCH
            </h3>
            <div className="space-y-4 font-label font-bold text-xs uppercase">
              <div className="space-y-2">
                <label htmlFor="memberSearch" className="block">Keyword Scan</label>
                <div className="flex items-center brutal-border bg-white px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <input
                    id="memberSearch"
                    name="memberSearch"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="BADGE, NAME OR ROLE..."
                    className="bg-transparent border-none outline-none font-mono text-xs placeholder:text-gray-500 uppercase w-full focus:ring-0 p-0 text-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="roleSelect" className="block">Clearance Level</label>
                <select
                  id="roleSelect"
                  name="roleSelect"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full brutal-border p-2 bg-[#EAE7DC] text-black focus:outline-none focus:ring-0 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono text-xs font-bold"
                >
                  <option value="ALL">ALL LEVELS</option>
                  <option value="Level 5">Level 5 (Admin)</option>
                  <option value="Level 3">Level 3 (Inspector)</option>
                  <option value="Level 2">Level 2 (Counsel)</option>
                  <option value="Level 1">Level 1 (Observer)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Directory cards layout */}
        <div className="xl:col-span-3">
          {filteredMembers.length === 0 ? (
            <div className="brutal-border bg-white p-12 text-center shadow-brutal font-mono font-bold text-sm text-black">
              📂 NO ACTIVE OFFICERS MATCHING SELECT FILTER
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  className="brutal-border bg-white p-6 shadow-brutal flex flex-col hover:shadow-brutalist-xl hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all relative text-left text-black"
                >
                  {/* Badge Ribbon */}
                  <span className="absolute top-4 right-4 font-mono text-[9px] bg-black text-white px-2 py-0.5 font-bold uppercase shadow-brutalist-sm">
                    {m.badge}
                  </span>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 border-2 border-black bg-brand-crimson/10 flex items-center justify-center font-display text-2xl font-black text-brand-crimson">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-headline text-xl font-black uppercase leading-tight pr-12 truncate max-w-[200px]" title={m.name}>
                        {m.name}
                      </h3>
                      <p className="font-mono text-[10px] font-bold text-black/60 uppercase">{m.role}</p>
                    </div>
                  </div>

                  <div className="border-t border-black/10 pt-3 flex-grow font-mono text-xs space-y-1 bg-gray-50/50 p-2 brutal-border mb-4">
                    <div className="flex justify-between">
                      <span className="text-black/50">Clearance:</span>
                      <span className="font-black text-brand-crimson uppercase">{m.clearance}</span>
                    </div>
                    <div className="flex justify-between truncate">
                      <span className="text-black/50">Secure ID:</span>
                      <span className="font-bold">{m.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/50">Registry Status:</span>
                      <span className={`font-bold uppercase ${m.status === 'active' ? 'text-green-600' : 'text-amber-500'}`}>
                        {m.status}
                      </span>
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleDecommission(m.id, m.name)}
                      className="w-full py-2 brutal-btn-outline text-xs text-center font-bold"
                    >
                      DECOMMISSION OPERATOR
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enlist Member Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="ENLIST SYSTEM OPERATOR"
        >
          <form onSubmit={handleEnlist} className="space-y-4 text-left font-body">
            <Input
              label="Operator Full Name *"
              name="name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              placeholder="e.g. Adv. Mukund Sen"
              required
            />
            
            <Input
              label="Designated Access Role *"
              name="role"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
              placeholder="e.g. Lead Prosecutor Counsel"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ident Badge Code *"
                name="badge"
                value={newMember.badge}
                onChange={(e) => setNewMember({ ...newMember, badge: e.target.value })}
                placeholder="e.g. ADV-308"
                required
              />
              
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                <label className="font-bold uppercase block text-ink text-sm">Clearance level</label>
                <select
                  value={newMember.clearance}
                  onChange={(e) => setNewMember({ ...newMember, clearance: e.target.value })}
                  className="w-full p-2 brutal-border bg-[#EAE7DC] text-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] h-[58px]"
                >
                  <option value="Level 1">Level 1 (Observer)</option>
                  <option value="Level 2">Level 2 (Counsel)</option>
                  <option value="Level 3">Level 3 (Inspector)</option>
                  <option value="Level 5">Level 5 (Admin)</option>
                </select>
              </div>
            </div>

            <Input
              label="Encrypted Mail Address *"
              name="email"
              type="email"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              placeholder="e.g. m.sen@advocates.org"
              required
            />

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
                ENLIST OPERATOR
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TeamDirectory;
