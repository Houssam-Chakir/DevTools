import { useEffect } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle rounded-md shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col border border-gh-border-default dark:border-gh-dark-border-default">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gh-border-default dark:border-gh-dark-border-default">
          <h2 className="text-sm font-semibold text-gh-fg-default dark:text-gh-dark-fg-default">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default text-gh-fg-muted dark:text-gh-dark-fg-muted"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}
