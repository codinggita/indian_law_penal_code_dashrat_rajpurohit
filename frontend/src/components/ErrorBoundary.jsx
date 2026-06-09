import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log error internally if needed (e.g. console.error)
    console.error('Critical Render Exception Caught by Boundary:', error, errorInfo);
  }

  handleRestart = () => {
    localStorage.clear(); // Clear potentially corrupted storage states
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-jurist-bg bg-grid flex items-center justify-center p-6 text-black selection:bg-jurist-primary selection:text-white">
          <div className="w-full max-w-2xl border-4 border-black bg-white p-8 shadow-brutal text-left">
            {/* Header banner */}
            <div className="bg-jurist-red text-white border-2 border-black p-4 mb-6 shadow-brutal-sm font-headline font-black uppercase text-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl">warning</span>
              SYSTEM HALT: UNHANDLED EXCEPTION RECORDED
            </div>

            <h2 className="font-display text-4xl uppercase tracking-tighter mb-2 text-black">
              MOMENTUM OS DEVIATION DETECTED
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest text-black/60 mb-6">
              A runtime component failed to compile or render within the active canvas wrapper.
            </p>

            {/* Error Diagnostics Info */}
            <div className="border-2 border-black bg-black text-white p-4 font-mono text-xs mb-6 overflow-x-auto max-h-60 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-jurist-red font-bold block mb-2">// ERROR DETAILS</span>
              <p className="font-bold mb-4">{this.state.error && this.state.error.toString()}</p>
              
              {this.state.errorInfo && (
                <>
                  <span className="text-gray-400 font-bold block mb-1">// STACK TRACE</span>
                  <pre className="whitespace-pre-wrap leading-relaxed text-gray-300">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 bg-[#000000] text-white border-2 border-black font-headline font-bold text-lg uppercase tracking-wider shadow-brutal hover:bg-jurist-primary active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-none"
              >
                REFRESH INTERFACE
              </button>
              <button
                onClick={this.handleRestart}
                className="flex-1 py-3 bg-white text-black border-2 border-black font-headline font-bold text-lg uppercase tracking-wider shadow-brutal hover:bg-black hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-none"
              >
                PURGE CACHE & HOME
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
