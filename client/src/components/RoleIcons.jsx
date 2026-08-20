import React from 'react';

// Mid Lane Image
export const MidLaneIcon = ({ className = "w-7 h-7" }) => (
  <img 
    src="/roles/mid.png" 
    alt="Mid Lane" 
    className={`${className} object-contain rounded-md`} 
  />
);

// EXP Lane Image
export const ExpLaneIcon = ({ className = "w-7 h-7" }) => (
  <img 
    src="/roles/exp.png" 
    alt="EXP Lane" 
    className={`${className} object-contain rounded-md`} 
  />
);

// Gold Lane Image
export const GoldLaneIcon = ({ className = "w-7 h-7" }) => (
  <img 
    src="/roles/gold.png" 
    alt="Gold Lane" 
    className={`${className} object-contain rounded-md`} 
  />
);

// Core (Jungler) Image
export const CoreIcon = ({ className = "w-7 h-7" }) => (
  <img 
    src="/roles/core.png" 
    alt="Core" 
    className={`${className} object-contain rounded-md`} 
  />
);

// Roam Image
export const RoamIcon = ({ className = "w-7 h-7" }) => (
  <img 
    src="/roles/roam.png" 
    alt="Roam" 
    className={`${className} object-contain rounded-md`} 
  />
);

// 6th Man / Substitute Badge
export const SixthManIcon = ({ className = "w-7 h-7" }) => (
  <div className={`${className} bg-slate-900 border border-orange-500/50 rounded-md flex items-center justify-center font-black text-orange-400 text-xs shadow-inner select-none`}>
    6TH
  </div>
);