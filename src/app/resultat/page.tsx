"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultatPage() {
  const router = useRouter();
  const [isZoomed, setIsZoomed] = useState(false);

  // Ombre forte pour le contraste (identique à l'accueil et historique)
  const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.18)"; 

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">
      
      {/* 1. HEADER (Bouton Retour : Transparent + Contour Bleu) */}
      {!isZoomed && (
        <div className="absolute top-12 left-6 z-20">
          <button 
            onClick={() => router.push('/camera')}
            style={{ 
              width: '52px', 
              height: '52px', 
              backgroundColor: 'transparent', 
              border: '2px solid #1F6680', 
              borderRadius: '50%',
            }}
            className="flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
          >
            <img src="/fleche.svg" alt="Retour" style={{ width: '24px' }} />
          </button>
        </div>
      )}

      {/* 2. ZONE D'IMAGE */}
      <div className={`flex-1 flex items-center justify-center transition-all duration-500 z-10 ${isZoomed ? 'p-0' : 'px-8 pt-20 pb-4'}`}>
        <div 
          className={`bg-[#FFC1C1] relative transition-all duration-500 ease-in-out
            ${isZoomed 
              ? 'w-full h-full rounded-none z-50' 
              : 'w-full max-w-[340px] aspect-[3/4.5] rounded-[40px] border-2 border-white shadow-md' 
            }`}
        >
          <button 
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-5 right-5 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur rounded-xl shadow-sm z-[60] active:scale-90"
          >
            <img src={isZoomed ? "/reduire.svg" : "/agrandir.svg"} alt="Zoom" className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* 3. LE DÔME BLANC ET LES BOUTONS XXL (Avec ombres fortes) */}
      {!isZoomed && (
        <div className="relative w-full h-[220px] shrink-0 flex flex-col items-center z-20">
          
          <div 
            style={{ 
              width: '494px', height: '363px', backgroundColor: 'white',
              borderRadius: '50%', position: 'absolute', top: 0, left: '50%',
              transform: 'translateX(-50%)', zIndex: 10
            }}
            className="shadow-[0_-15px_40px_rgba(0,0,0,0.04)]"
          />

          <div className="relative z-30 flex flex-col items-center pt-8 pb-10 w-full max-w-[300px]">
            
            {/* BOUTON OREILLE (90x90 + Ombre forte) */}
            <button 
              style={{ 
                width: '90px', 
                height: '90px', 
                backgroundColor: '#FFF9EE', 
                boxShadow: strongShadow 
              }} 
              className="rounded-full flex items-center justify-center mb-8 active:scale-95 border-none cursor-pointer"
            >
              <img src="/oreille.svg" alt="Écouter" style={{ width: '48px' }} />
            </button>

            <div className="flex justify-between w-full px-2">
              
              {/* BOUTON AIDE (74x74 + Ombre forte) */}
              <button 
                 style={{ 
                   backgroundColor: '#FFF9EE', 
                   width: '74px', 
                   height: '74px', 
                   boxShadow: strongShadow 
                 }}
                 className="rounded-full flex items-center justify-center active:scale-90 border-none cursor-pointer"
              >
                <img src="/aide.svg" alt="Aide" style={{ width: '34px' }} />
              </button>

              {/* BOUTON HISTORIQUE (74x74 + Ombre forte) */}
              <button 
                 onClick={() => router.push('/historique')}
                 style={{ 
                   backgroundColor: '#FFF9EE', 
                   width: '74px', 
                   height: '74px', 
                   boxShadow: strongShadow 
                 }}
                 className="rounded-full flex items-center justify-center active:scale-90 border-none cursor-pointer"
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