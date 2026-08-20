import React from 'react';

// 1. Mid Lane Icon (Diagonal Cyan Stripe across Square)
export const MidLaneIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#121b2d" />
    <path d="M22 22H78V78H22V22Z" stroke="#32415e" strokeWidth="12" strokeLinejoin="miter" />
    <path d="M8 92L92 8" stroke="#38efd8" strokeWidth="18" strokeLinecap="square" />
  </svg>
);

// 2. EXP Lane Icon (Geometric Lavender 'E' Emblem)
export const ExpLaneIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#121b2d" />
    <path d="M80 20H24V80H80" stroke="#d8b4fe" strokeWidth="14" strokeLinecap="square" strokeLinejoin="miter" />
    <path d="M24 50H65" stroke="#d8b4fe" strokeWidth="14" strokeLinecap="square" />
    <path d="M78 20L90 32V68L78 80" stroke="#32415e" strokeWidth="8" fill="none" />
  </svg>
);

// 3. Gold Lane Icon (Geometric Golden '$' Emblem)
export const GoldLaneIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#121b2d" />
    <path d="M50 8V20M50 80V92" stroke="#fde047" strokeWidth="10" strokeLinecap="square" />
    <path d="M78 34H30V48H70V66H22" stroke="#fde047" strokeWidth="13" strokeLinecap="square" strokeLinejoin="miter" />
    <path d="M22 34V20H78V34M78 66V80H22V66" stroke="#32415e" strokeWidth="8" strokeLinecap="square" fill="none" />
  </svg>
);

// 4. Core / Jungler Icon (Split Diagonal with Cyan Core Box)
export const CoreIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#121b2d" />
    <path d="M20 20H80V80H20V20Z" stroke="#32415e" strokeWidth="12" />
    <path d="M8 92L92 8" stroke="#32415e" strokeWidth="8" />
    <rect x="34" y="34" width="32" height="32" fill="#38efd8" />
  </svg>
);

// 5. Roam Icon (Dual Diagonal Teal / Cyan Emblem)
export const RoamIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#121b2d" />
    <path d="M22 25H78L22 75H78" stroke="#38efd8" strokeWidth="14" strokeLinecap="square" strokeLinejoin="miter" />
    <path d="M78 25L90 37V63L78 75" stroke="#32415e" strokeWidth="8" fill="none" />
    <path d="M22 75L10 63V37L22 25" stroke="#32415e" strokeWidth="8" fill="none" />
  </svg>
);

// 6. Sixth Man (Substitute Official Badge)
export const SixthManIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="8" fill="#121b2d" />
    <path d="M20 20H80V80H20V20Z" stroke="#f97316" strokeWidth="10" strokeDasharray="10 6" />
    <text x="50" y="62" fill="#f97316" fontSize="32" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">6th</text>
  </svg>
);