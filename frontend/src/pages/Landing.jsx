import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Helmet } from 'react-helmet-async';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Structured schema.org markup
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": "Indian Penal Code Statutory Registry",
    "description": "Comprehensive legal database and analysis portal for modern Indian jurists.",
    "provider": {
      "@type": "GovernmentOrganization",
      "name": "Ministry of Law and Justice"
    },
    "serviceOperator": {
      "@type": "GovernmentOrganization",
      "name": "Momentum Penal Registry Operations"
    }
  };

  return (
    <div className="font-body antialiased bg-brand-beige text-brand-black min-h-screen flex flex-col pt-[72px]">
      <Helmet>
        <title>The Constructivist Jurist | Decode the Penal Code</title>
        <meta name="description" content="Master statutory interpretation and navigate judicial precedents with absolute precision. Explore active, suspended, and amended IPC sections." />
        <meta property="og:title" content="The Constructivist Jurist - IPC Portal" />
        <meta property="og:description" content="Statutory registry database for the modern Indian Penal Code." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      </Helmet>

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#EAE7DC] dark:bg-black border-b-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4">
          <span className="text-xl font-headline font-black text-black dark:text-white uppercase tracking-tighter">
            IPC OPERATIONAL SYSTEM v4.0.12 // STATUTORY REGISTRY
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="text-black dark:text-white hover:bg-[#D90429] hover:text-white transition-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none p-1.5 brutal-border flex items-center justify-center bg-white dark:bg-zinc-900"
            >
              <span className="material-symbols-outlined text-base font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isAuthenticated ? "dashboard" : "lock"}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <div className="inline-block bg-brand-black text-brand-beige font-mono text-sm px-3 py-1 uppercase tracking-widest w-fit brutal-shadow">
              System Protocol v1.0
            </div>
            <h1 className="font-headline text-6xl md:text-8xl leading-[0.85] uppercase tracking-tighter text-brand-black">
              DECODE <br />
              <span className="text-brand-crimson">THE PENAL CODE</span>
            </h1>
            <p className="font-mono text-lg md:text-xl border-l-4 border-brand-black pl-4 py-2 max-w-lg">
              Comprehensive legal analysis for the modern Indian jurist. Master statutory interpretation. Navigate judicial precedent with absolute precision.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={() => navigate(isAuthenticated ? "/laws" : "/login")}
                className="bg-brand-crimson text-white font-headline text-2xl uppercase tracking-wider px-8 py-4 brutal-border brutal-shadow brutal-button-active transition-transform"
              >
                Access Sections
              </button>
              <button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
                className="bg-brand-beige text-brand-black font-headline text-2xl uppercase tracking-wider px-8 py-4 brutal-border brutal-shadow brutal-button-active transition-transform hover:bg-brand-black hover:text-brand-beige"
              >
                IPC JURISPRUDENCE OVERVIEW
              </button>
            </div>
          </div>
          <div className="order-1 lg:order-2 w-full h-[600px] brutal-border-thick brutal-shadow relative overflow-hidden bg-brand-black group">
            <div className="absolute inset-0 bg-brand-crimson/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-300"></div>
            <img
              alt="Industrial gears and machinery"
              className="w-full h-full object-cover filter grayscale contrast-125"
              src="/constructivist_machinery.png"
            />
          </div>
        </section>

        {/* Marquee / Divider */}
        <div className="w-full bg-brand-black text-brand-beige py-3 brutal-border-thick border-x-0 overflow-hidden flex whitespace-nowrap shadow-[0px_4px_0px_0px_rgba(217,4,41,1)]">
          <div className="animate-marquee flex gap-8 font-mono uppercase text-sm tracking-widest items-center">
            <span>// STRICT STATUTORY COMPLIANCE //</span>
            <span>PRECEDENT INTEGRITY SECURED</span>
            <span>// RIGOROUS LEGAL ANALYSIS //</span>
            <span>JURISPRUDENTIAL INSIGHT ENGAGED</span>
            <span>// STRICT STATUTORY COMPLIANCE //</span>
            <span>PRECEDENT INTEGRITY SECURED</span>
            <span>// RIGOROUS LEGAL ANALYSIS //</span>
            <span>JURISPRUDENTIAL INSIGHT ENGAGED</span>
            <span>// STRICT STATUTORY COMPLIANCE //</span>
            <span>PRECEDENT INTEGRITY SECURED</span>
            <span>// RIGOROUS LEGAL ANALYSIS //</span>
            <span>JURISPRUDENTIAL INSIGHT ENGAGED</span>
          </div>
        </div>

        {/* Core Features Grid */}
        <section className="w-full max-w-7xl mx-auto px-6 py-24">
          <div className="mb-12 flex justify-between items-end border-b-4 border-brand-black pb-4">
            <h2 className="font-headline text-5xl md:text-7xl uppercase tracking-tighter">Core Doctrines</h2>
            <span className="font-mono text-xl text-brand-crimson font-bold hidden md:block">[ LEGAL DIAGNOSTICS ]</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-brand-beige brutal-border-thick brutal-shadow p-6 flex flex-col gap-4 brutal-card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-black text-brand-beige px-2 py-1 font-mono text-xs">01</div>
              <div className="w-16 h-16 bg-brand-crimson flex items-center justify-center brutal-border brutal-shadow mb-4">
                <span className="material-symbols-outlined text-white text-3xl">bolt</span>
              </div>
              <h3 className="font-headline text-3xl uppercase tracking-tight">Statutory Analysis</h3>
              <p className="font-mono text-sm leading-relaxed border-t-2 border-brand-black pt-4 mt-auto">
                In-depth breakdown of IPC sections. Uncover the legislative intent and essential ingredients of criminal offenses.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-brand-black text-brand-beige brutal-border-thick border-brand-black brutal-shadow p-6 flex flex-col gap-4 brutal-card-hover relative">
              <div className="absolute top-0 right-0 bg-brand-crimson text-white px-2 py-1 font-mono text-xs brutal-border border-brand-black">02</div>
              <div className="w-16 h-16 bg-brand-beige flex items-center justify-center brutal-border border-brand-black brutal-shadow mb-4">
                <span className="material-symbols-outlined text-brand-black text-3xl">gavel</span>
              </div>
              <h3 className="font-headline text-3xl uppercase tracking-tight text-brand-crimson">Judicial Precedent</h3>
              <p className="font-mono text-sm leading-relaxed border-t-2 border-brand-beige pt-4 mt-auto opacity-80">
                Rigorous examination of landmark Supreme Court and High Court judgments interpreting the penal code.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-brand-beige brutal-border-thick brutal-shadow p-6 flex flex-col gap-4 brutal-card-hover relative">
              <div className="absolute top-0 right-0 bg-brand-black text-brand-beige px-2 py-1 font-mono text-xs">03</div>
              <div className="w-16 h-16 bg-brand-crimson flex items-center justify-center brutal-border brutal-shadow mb-4">
                <span className="material-symbols-outlined text-white text-3xl">memory</span>
              </div>
              <h3 className="font-headline text-3xl uppercase tracking-tight">Evidentiary Standards</h3>
              <p className="font-mono text-sm leading-relaxed border-t-2 border-brand-black pt-4 mt-auto">
                Correlate substantive penal laws with the Indian Evidence Act. Establish the required burden of proof.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-brand-black text-brand-beige py-8 px-6 mt-auto border-t-4 border-brand-crimson">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-headline text-2xl tracking-widest uppercase text-brand-crimson">THE CONSTRUCTIVIST JURIST</span>
          <div className="font-mono text-sm opacity-70 flex gap-6">
            <span>// STATUS: ACTIVE</span>
            <span>// CLEARANCE: REQUIRED</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
