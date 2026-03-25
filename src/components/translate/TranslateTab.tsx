import { useState } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ar', label: 'Arabic' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
];

export function TranslateTab() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError('');
    setOutputText('');
    try {
      const langPair = `${sourceLang}|${targetLang}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${langPair}`;
      const res = await fetch(url);
      const data = await res.json() as { responseData?: { translatedText?: string }; responseStatus?: number };
      if (data.responseData?.translatedText) {
        setOutputText(data.responseData.translatedText);
      } else {
        setError('Translation failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const selectClass = "w-full px-3 py-1.5 rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default text-sm focus:outline-none focus:border-gh-accent-fg dark:focus:border-gh-dark-accent-fg";

  return (
    <div className="h-full overflow-y-auto p-6 bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-sm font-semibold text-gh-fg-default dark:text-gh-dark-fg-default mb-4 uppercase tracking-wide">Translate</h2>
        <div className="bg-gh-canvas-default dark:bg-gh-dark-canvas-subtle rounded-md border border-gh-border-default dark:border-gh-dark-border-default p-4">
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1 text-gh-fg-default dark:text-gh-dark-fg-default">From</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className={selectClass}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={swapLanguages}
              className="p-1.5 rounded-md border border-gh-border-default dark:border-gh-dark-border-default hover:bg-gh-canvas-subtle dark:hover:bg-gh-dark-canvas-default text-gh-fg-muted dark:text-gh-dark-fg-muted transition-colors mb-0.5"
              title="Swap languages"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1 text-gh-fg-default dark:text-gh-dark-fg-default">To</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className={selectClass}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gh-fg-default dark:text-gh-dark-fg-default">Source text</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                placeholder="Enter text to translate..."
                className="w-full px-3 py-2 rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-default text-gh-fg-default dark:text-gh-dark-fg-default text-sm resize-none focus:outline-none focus:border-gh-accent-fg dark:focus:border-gh-dark-accent-fg focus:ring-1 focus:ring-gh-accent-fg/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleTranslate();
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gh-fg-default dark:text-gh-dark-fg-default">Translation</label>
              <div className="w-full h-[240px] px-3 py-2 rounded-md border border-gh-border-default dark:border-gh-dark-border-default bg-gh-canvas-subtle dark:bg-gh-dark-canvas-inset text-sm overflow-y-auto">
                {loading && (
                  <p className="text-gh-fg-muted dark:text-gh-dark-fg-muted animate-pulse">Translating...</p>
                )}
                {error && <p className="text-gh-danger-fg dark:text-gh-dark-danger-fg text-sm">{error}</p>}
                {outputText && !loading && <p className="whitespace-pre-wrap text-gh-fg-default dark:text-gh-dark-fg-default">{outputText}</p>}
                {!loading && !error && !outputText && (
                  <p className="text-gh-fg-muted dark:text-gh-dark-fg-muted italic text-xs">Translation will appear here...</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleTranslate}
              disabled={loading || !inputText.trim()}
              className="px-6 py-1.5 bg-gh-accent-emphasis dark:bg-gh-dark-accent-emphasis text-white rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>
          <p className="text-center text-xs text-gh-fg-muted dark:text-gh-dark-fg-muted mt-3">
            Powered by MyMemory Translation API · Ctrl+Enter to translate
          </p>
        </div>
      </div>
    </div>
  );
}
