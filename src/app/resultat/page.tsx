"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultatPage() {
  const router = useRouter();
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">
      
      {/* 1. HEADER */}
      {!isZoomed && (
        <div className="absolute top-12 left-6 z-20">
          <button 
            onClick={() => router.push('/camera')}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1F6680] cursor-pointer bg-white active:scale-90 transition-transform shadow-sm"
          >
            <img src="/fleche.svg" alt="Retour" style={{ width: '24px' }} />
          </button>
        </div>
      )}

      {/* 2. ZONE D'IMAGE (S'adapte pour laisser de la place aux gros boutons) */}
      <div className={`flex-1 flex items-center justify-center transition-all duration-500 z-10 ${isZoomed ? 'p-0' : 'px-8 pt-20 pb-2'}`}>
        <div 
          className={`bg-[#FFC1C1] relative shadow-md transition-all duration-500 ease-in-out
            ${isZoomed 
              ? 'w-full h-full rounded-none z-50' 
              : 'w-full max-w-[340px] aspect-[3/4.4] rounded-[40px] border-2 border-white' 
            }`}
        >
          <button 
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-5 right-5 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur rounded-xl shadow-sm cursor-pointer z-[60] active:scale-90 transition-transform"
          >
            <img 
              src={isZoomed ? "/reduire.svg" : "/agrandir.svg"} 
              alt="Zoom" 
              className="w-7 h-7" 
            />
          </button>
        </div>
      </div>

      {/* 3. LE DÔME BLANC AVEC BOUTONS AGRANDIS */}
      {!isZoomed && (
        <div className="relative w-full h-[220px] shrink-0 flex flex-col items-center z-20">
          
          {/* L'Ellipse de fond (494x363) */}
          <div 
            style={{ 
              width: '494px', 
              height: '363px', 
              backgroundColor: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10
            }}
            className="shadow-[0_-15px_40px_rgba(0,0,0,0.04)]"
          />

          {/* LES BOUTONS (Version XXL) */}
          <div className="relative z-30 flex flex-col items-center pt-6 pb-12 w-full max-w-[300px]">
            
            {/* BOUTON OREILLE (Agrandi à 90x90) */}
            <button 
              style={{ width: '90px', height: '90px', backgroundColor: '#FFF9EE' }} 
              className="rounded-full flex items-center justify-center mb-4 shadow-md active:scale-95 transition-all border-none cursor-pointer"
            >
              <img src="/oreille.svg" alt="Écouter" style={{ width: '48px' }} />
            </button>

            {/* BOUTONS AIDE ET HISTORIQUE (Agrandis à 74x74) */}
            <div className="flex justify-between w-full px-2">
              <button 
                 style={{ backgroundColor: '#FFF9EE', width: '74px', height: '74px' }}
                 className="rounded-full flex items-center justify-center active:scale-90 border-none cursor-pointer shadow-sm"
              >
                <img src="/aide.svg" alt="Aide" style={{ width: '34px' }} />
              </button>
              
              <button 
                 style={{ backgroundColor: '#FFF9EE', width: '74px', height: '74px' }}
                 className="rounded-full flex items-center justify-center active:scale-90 border-none cursor-pointer shadow-sm"
              >
                <img src="/historique.svg" alt="Historique" style={{ width: '34px' }} />
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}