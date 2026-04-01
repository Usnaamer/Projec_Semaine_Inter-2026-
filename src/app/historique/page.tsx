"use client";

import { useRouter } from 'next/navigation';

export default function HistoriquePage() {
  const router = useRouter();
  const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.18)"; 
  const items = [1, 2, 3, 4, 5];

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">
      
      {/* 1. HEADER (Bouton Maison : Transparent/Crème + Contour Bleu) */}
      <div className="pt-10 pb-4 px-8 z-30 relative">
        <button 
          onClick={() => router.push('/')}
          style={{ 
            width: '56px', 
            height: '56px', 
            backgroundColor: 'transparent', // On le met transparent pour voir le crème derrière
            border: '2px solid #1F6680',   // Contour bleu
            borderRadius: '50%',
            // Pas d'ombre ici pour un look plus "dessiné" et léger, ou garde strongShadow si tu veux du relief
          }}
          className="flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          <img src="/maison.svg" alt="Accueil" className="w-7" />
        </button>
      </div>

      {/* 2. ZONE DE LISTE */}
      <div className="flex-1 overflow-y-auto px-6 pb-48 space-y-8">
        {items.map((i) => (
          <div 
            key={i} 
            className="bg-white rounded-[40px] p-6 flex items-center shadow-sm border border-black/5"
            style={{ minHeight: '190px' }} 
          >
            <div className="w-44 h-32 bg-[#FFC1C1] rounded-[25px] shrink-0" />
            <div className="flex-1" />
            <button 
              style={{ width: '80px', height: '80px', backgroundColor: '#FFF9EE', boxShadow: strongShadow }}
              className="rounded-full flex items-center justify-center active:scale-90 shrink-0 border-none"
            >
              <img src="/oreille.svg" alt="Écouter" className="w-10" />
            </button>
          </div>
        ))}
      </div>

      {/* 3. LE DÔME BLANC ET LE BOUTON AIDE */}
      <div className="absolute bottom-0 left-0 w-full h-[200px] flex justify-center z-20 pointer-events-none">
        <div 
          style={{ 
            width: '580px', height: '400px', backgroundColor: 'white',
            borderRadius: '50%', position: 'absolute', top: '80px', left: '50%',
            transform: 'translateX(-50%)', zIndex: 10, pointerEvents: 'auto'
          }}
          className="shadow-[0_-15px_40px_rgba(0,0,0,0.06)]"
        />
        <div className="relative z-30 pt-24 pointer-events-auto"> 
          <button 
             style={{ backgroundColor: '#FFF9EE', width: '90px', height: '90px', boxShadow: strongShadow }}
             className="rounded-full flex items-center justify-center active:scale-90 border-none"
          >
            <img src="/aide.svg" alt="Aide" style={{ width: '42px' }} />
          </button>
        </div>
      </div>
    </main>
  );
}