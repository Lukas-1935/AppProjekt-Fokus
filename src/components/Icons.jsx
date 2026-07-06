/* Schlichte Icons im SF-Symbols-Stil (Strichstärke 1.8, currentColor). */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function GearIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V19.6a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.12-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H2.4a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.12 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.08a1.7 1.7 0 0 0 1.03-1.56V2.4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08a1.7 1.7 0 0 0 1.56 1.03h.17a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03Z" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={2.4} aria-hidden="true">
      <path d="M15 4.5 7.5 12l7.5 7.5" />
    </svg>
  );
}

export function MusicIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </svg>
  );
}

export function SearchIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}
