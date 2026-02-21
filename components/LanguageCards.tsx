'use client';

const options = [
  { code: 'en', label: 'Hello' },
  { code: 'hi', label: 'नमस्ते' },
  { code: 'te', label: 'నమస్కారం' },
] as const;

export function LanguageCards({ onSelect }: { onSelect: (lang: 'en' | 'hi' | 'te') => void }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.code}
          className="card text-lg font-semibold transition hover:-translate-y-1 hover:shadow-md"
          onClick={() => onSelect(option.code)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
