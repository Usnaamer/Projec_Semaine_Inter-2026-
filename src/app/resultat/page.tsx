"use client";

import { useState } from 'react'; // On ajoute useState pour gérer le zoom
import { useRouter } from 'next/navigation';

export default function ResultatPage() {
  const router = useRouter();
  const [isZoomed, setIsZoomed] = useState(false); // Faux au début (image normale)

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative">
      
      {/* 1. HEADER (Disparaît si on zoom pour laisser de la place) */}
      {!isZoomed && (
        <div className="pt-12 px-6 z-10">
          <button 
            onClick={() => router.push('/camera')}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1F6680] cursor-pointer bg-transparent"
          >
            <img src="/fleche.svg" alt="Retour" style={{ width: '24px' }} />
          </button>
        </div>
      )}

      {/* 2. ZONE DE L'IMAGE (S'agrandit au clic) */}
      <div className={`flex-1 flex items-center justify-center transition-all duration-300 ${isZoomed ? 'p-0' : 'px-8'}`}>
        <div 
          className={`bg-[#FFC1C1] relative shadow-lg transition-all duration-300 ease-in-out
            ${isZoomed 
              ? 'w-full h-full rounded-none z-50' // Plein écran
              : 'w-full aspect-[3/4] rounded-3xl border-2 border-white/20' // Taille normale
            }`}
        >
          {/* L'IMAGE (Placeholder pour l'IA) */}
          <div className="w-full h-full flex items-center justify-center text-[#1F6680]/20">
             {/* Ici sera l'image finale */}
          </div>

          {/* LE SCAN CORNER (Le bouton pour agrandir/réduire) */}
          <button 
            onClick={() => setIsZoomed(!isZoomed)} // On inverse l'état au clic
            className={`absolute bottom-6 right-6 w-12 h-12 flex items-center justify-center bg-white/20 rounded-lg backdrop-blur-sm cursor-pointer active:scale-90 transition-transform ${isZoomed ? 'rotate-180' : ''}`}
          >
             <img src="/scan-corner.svg" alt="Agrandir" className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* 3. MENU BAS (Disparaît si on zoom) */}
      {!isZoomed && (
        <div className="bg-white rounded-t-[60px] pt-10 pb-14 px-10 flex flex-col items-center shadow-[0_-10px_25px_rgba(0,0,0,0.05)] z-10">
          <button className="w-24 h-24 bg-white border-2 border-[#F3F4F6] rounded-full flex items-center justify-center mb-8 shadow-md active:scale-90 transition-transform">
            <img src="/oreille.svg" alt="Écouter" style={{ width: '50px' }} />
          </button>

          <div className="flex justify-between w-full max-w-[280px]">
            <button className="w-16 h-16 bg-white border-2 border-[#F3F4F6] rounded-full flex items-center justify-center active:scale-90 transition-transform">
              <img src="/aide.svg" alt="Aide" style={{ width: '32px' }} />
            </button>
            <button className="w-16 h-16 bg-white border-2 border-[#F3F4F6] rounded-full flex items-center justify-center active:scale-90 transition-transform">
              <img src="/historique.svg" alt="Historique" style={{ width: '32px' }} />
            </button>
          </div>
        </div>
      )}

    </main>
  );
}