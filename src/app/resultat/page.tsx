"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultatPage() {
  const router = useRouter();
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">
      
      {/* 1. HEADER (La flèche retour) */}
      {!isZoomed && (
        <div className="absolute top-12 left-6 z-20">
          <button 
            onClick={() => router.push('/camera')}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1F6680] cursor-pointer bg-transparent active:scale-90 transition-transform"
          >
            <img src="/fleche.svg" alt="Retour" style={{ width: '24px' }} />
          </button>
        </div>
      )}

      {/* 2. ZONE D'IMAGE (Plus grande et bien centrée) */}
      <div className={`flex-[1.2] flex items-center justify-center transition-all duration-500 z-10 ${isZoomed ? 'p-0' : 'px-6 pt-20'}`}>
        <div 
          className={`bg-[#FFC1C1] relative shadow-xl transition-all duration-500 ease-in-out
            ${isZoomed 
              ? 'w-full h-full rounded-none z-50' 
              : 'w-full max-w-[340px] aspect-[3/4] rounded-[40px] border-4 border-white' 
            }`}
        >
          {/* BOUTON AGRANDIR / RÉDUIRE */}
          <button 
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-6 right-6 w-14 h-14 flex items-center justify-center bg-white rounded-2xl shadow-lg cursor-pointer active:scale-90 transition-all duration-300 z-[60]"
          >
            <img 
              src={isZoomed ? "/reduire.svg" : "/agrandir.svg"} 
              alt="Zoom" 
              className="w-8 h-8" 
            />
          </button>
        </div>
      </div>

      {/* 3. MENU BAS (Le grand demi-cercle blanc 491px) */}
      {!isZoomed && (
        <div 
          style={{ height: '491px' }}
          className="bg-white rounded-t-[180px] w-[120%] -ml-[10%] flex flex-col items-center pt-16 shadow-[0_-15px_50px_rgba(0,0,0,0.06)] z-20 relative"
        >
          {/* BOUTON OREILLE (80x80) */}
          <button 
            style={{ width: '80px', height: '80px', backgroundColor: '#FFF9EE' }} 
            className="rounded-full flex items-center justify-center mb-12 shadow-md active:scale-95 transition-all cursor-pointer border-none"
          >
            <img src="/oreille.svg" alt="Écouter" style={{ width: '40px' }} />
          </button>

          {/* Boutons Aide et Historique */}
          <div className="flex justify-between w-full max-w-[260px] px-2">
            <button 
               style={{ backgroundColor: '#FFF9EE', width: '64px', height: '64px' }}
               className="rounded-full flex items-center justify-center active:scale-90 shadow-sm border-none cursor-pointer"
            >
              <img src="/aide.svg" alt="Aide" style={{ width: '30px' }} />
            </button>
            
            <button 
               style={{ backgroundColor: '#FFF9EE', width: '64px', height: '64px' }}
               className="rounded-full flex items-center justify-center active:scale-90 shadow-sm border-none cursor-pointer"
            >
              <img src="/historique.svg" alt="Historique" style={{ width: '30px' }} />
            </button>
          </div>
        </div>
      )}

    </main>
  );
}