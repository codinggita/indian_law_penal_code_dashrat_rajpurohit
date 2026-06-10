import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/uiSlice';
import toast from 'react-hot-toast';

const Onboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      toast.success('Onboarding complete. Operator session fully initialized!');
      navigate('/dashboard');
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-8 bg-sandy dark:bg-black text-black dark:text-white min-h-[calc(100vh-72px)] bg-grid">
      <Helmet>
        <title>Operator Orientation | Momentum OS</title>
        <meta name="description" content="Initial system onboarding flow for judicial registry officers." />
      </Helmet>

      <div className="w-full max-w-xl border-4 border-black bg-white dark:bg-zinc-950 p-8 shadow-brutal text-left text-black dark:text-white relative overflow-hidden">
        {/* Step Indicator Badge */}
        <span className="absolute top-4 right-4 font-mono text-xs bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 font-bold">
          STEP {step} / 4
        </span>

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-brand-crimson text-white border-2 border-black p-3 font-headline font-black uppercase tracking-wider text-base">
              // CLASSIFIED JURIDICAL PORTAL ACCESS
            </div>
            <h3 className="font-display text-4xl uppercase tracking-tighter leading-none">
              Welcome to Momentum OS
            </h3>
            <p className="font-mono text-sm leading-relaxed border-l-4 border-black pl-3 py-1">
              You are accessing the Indian Law Penal Code Statutory Registry interface node.
              This system aggregates criminal offenses, judicial precedents, and case files.
            </p>
            <p className="font-mono text-xs text-black/60 dark:text-white/60">
              Please complete this brief orientation sequence to synchronize your secure terminal interface.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="font-display text-4xl uppercase tracking-tighter leading-none text-brand-crimson">
              Core Capabilities
            </h3>
            <div className="space-y-4 font-mono text-xs uppercase text-left">
              <div className="border-2 border-black p-3 bg-brand-beige dark:bg-zinc-900 shadow-brutalist-sm">
                <strong className="text-black dark:text-white block mb-1">⚖️ Statutory Registry</strong>
                Browse active, suspended, and amended IPC sections. Access full dossiers, triable magistrates, and bail indexes.
              </div>
              <div className="border-2 border-black p-3 bg-brand-beige dark:bg-zinc-900 shadow-brutalist-sm">
                <strong className="text-black dark:text-white block mb-1">📂 Case Files</strong>
                Track active trials, FIR filings, and investigation updates via the responsive Kanban board view.
              </div>
              <div className="border-2 border-black p-3 bg-brand-beige dark:bg-zinc-900 shadow-brutalist-sm">
                <strong className="text-black dark:text-white block mb-1">🛡️ Operator Controls</strong>
                Manage operator accounts, revoke access tokens, review event logs, and change clearance settings.
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-display text-4xl uppercase tracking-tighter leading-none">
              Visual Environment
            </h3>
            <p className="font-mono text-sm leading-relaxed">
              Select your preferred visual theme runtime environment. This setting applies to all active dashboard grids.
            </p>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => theme === 'dark' && dispatch(toggleTheme())}
                className={`flex-1 py-4 border-2 border-black font-headline font-black text-sm uppercase tracking-wider shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-none ${
                  theme === 'light' ? 'bg-[#EAE7DC] text-black border-4' : 'bg-white text-black'
                }`}
              >
                ☀️ LIGHT ENVIRONMENT
              </button>
              <button
                type="button"
                onClick={() => theme === 'light' && dispatch(toggleTheme())}
                className={`flex-1 py-4 border-2 border-black font-headline font-black text-sm uppercase tracking-wider shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-none ${
                  theme === 'dark' ? 'bg-black text-white border-4 border-white' : 'bg-zinc-900 text-white'
                }`}
              >
                🌙 DARK ENVIRONMENT
              </button>
            </div>
            <p className="font-mono text-[10px] text-black/50 dark:text-white/50 uppercase">
              Current preference: <strong className="text-brand-crimson">{theme} mode</strong>. Settings sync to localStorage.
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="h-16 w-16 bg-green-500 text-white rounded-none border-2 border-black flex items-center justify-center shadow-brutal animate-bounce">
              <span className="material-symbols-outlined text-4xl font-bold">verified</span>
            </div>
            <h3 className="font-display text-4xl uppercase tracking-tighter leading-none text-green-600 dark:text-green-400">
              System Active
            </h3>
            <p className="font-mono text-sm leading-relaxed">
              Operator enlistment credentials have been synchronized with the core database node. 
              AES-256 secure channel handshake initialized.
            </p>
            <div className="border-2 border-black bg-black text-white p-3 font-mono text-[10px] uppercase">
              // CLASSIFICATION: ENCRYPTED // SYS.STATUS: NOMINAL
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex border-t-2 border-black mt-8 pt-6 gap-4 font-headline text-lg uppercase tracking-wider">
          {step > 1 && (
            <button
              onClick={handleBackStep}
              className="px-6 py-2.5 brutal-border bg-white text-black hover:bg-gray-200 transition-colors font-bold text-xs"
            >
              PREVIOUS PROTOCOL
            </button>
          )}
          <button
            onClick={handleNextStep}
            className="flex-1 py-2.5 brutal-btn text-xs"
          >
            {step === 4 ? 'ENTER OPERATIONS CENTER' : 'PROCEED TO NEXT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
