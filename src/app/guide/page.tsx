"use client";

import { useRouter } from 'next/navigation';

export default function GuidePage() {
  const router = useRouter();

  // Variable d'ombre pour les boutons
  const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.18)"; 

  // On garde 3 étapes pour générer les 3 boutons et les flèches
  const etapes = [ { id: 1 }, { id: 2 }, { id: 3 } ];

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">
      
      {/* 1. HEADER (Maison : Contour bleu) */}
      <div className="pt-10 pb-4 px-8 z-30 relative bg-[#FFF9EE]">
        <button 
          onClick={() => router.push('/')}
          style={{ 
            width: '56px', 
            height: '56px', 
            backgroundColor: 'transparent', 
            border: '2px solid #1F6680', 
            borderRadius: '50%',
            boxShadow: strongShadow 
          }}
          className="flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          <img src="/maison.svg" alt="Accueil" className="w-7" />
        </button>
      </div>

      {/* 2. ZONE DE LISTE (Boutons d'écoute seuls) */}
      <div className="flex-1 overflow-y-auto px-6 pb-48">
        <div className="flex flex-col items-center mt-4">
          {etapes.map((etape, index) => (
            <div key={etape.id} className="w-full flex flex-col items-center">
              
              {/* LA CASE D'ÉTAPE (Centrée et simplifiée) */}
              <div 
                className="bg-white rounded-[40px] p-6 flex items-center justify-center shadow-sm border border-black/5 w-full"
                style={{ minHeight: '160px' }} 
              >
                {/* BOUTON OREILLE XXL (Seul au centre) */}
                <button 
                    style={{ 
                        width: '110px', 
                        height: '110px', 
                        backgroundColor: '#FFF9EE', 
                        boxShadow: strongShadow,
                        borderRadius: '50%'
                    }}
                    className="flex items-center justify-center border-none active:scale-90 transition-transform cursor-pointer"
                >
                    <img src="/oreille.svg" alt="Écouter" className="w-14" />
                </button>
              </div>

              {/* LA FLÈCHE (Entre les cases) */}
              {index < etapes.length - 1 && (
                <div className="py-4">
                  <svg width="45" height="45" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M12 5V19M12 19L5 12M12 19L19 12" 
                      stroke="#1F6680" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. LE DÔME BLANC ET LE BOUTON AIDE (Inchangé) */}
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
             onClick={() => router.push('/aide')}
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