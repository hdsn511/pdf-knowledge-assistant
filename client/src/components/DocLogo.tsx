export default function DocLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bottom doc */}
      <rect x="4" y="10" width="18" height="14" rx="2.5" fill="#222222" />
      {/* Middle doc */}
      <rect x="4" y="7" width="18" height="14" rx="2.5" fill="#644a40" />
      {/* Top doc */}
      <rect x="4" y="4" width="18" height="14" rx="2.5" fill="#393028" />
      {/* Text lines */}
      <rect x="8" y="8.5" width="10" height="1.5" rx="0.75" fill="#ffe0c2" opacity="0.6" />
      <rect x="8" y="11.5" width="8" height="1.5" rx="0.75" fill="#ffe0c2" opacity="0.4" />
      <rect x="8" y="14.5" width="9" height="1.5" rx="0.75" fill="#ffe0c2" opacity="0.3" />
    </svg>
  );
}