import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, title, children, footer = null }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40">
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-none bg-[#EAE7DC] dark:bg-zinc-950 border-4 border-black dark:border-white shadow-brutalist-xxl dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.85)] flex flex-col max-h-[90vh] animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black dark:border-white">
          <h3 className="font-display text-2xl tracking-wider text-black dark:text-white uppercase">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-black dark:text-white hover:text-crimson transition-colors p-1 border-2 border-black dark:border-white rounded-none hover:bg-[#D8D4C7] dark:hover:bg-zinc-900 font-bold font-mono text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 text-black dark:text-white">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t-2 border-black dark:border-white bg-[#D8D4C7] dark:bg-zinc-900">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
