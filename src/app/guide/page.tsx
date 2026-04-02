"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GuidePage() {
  const router = useRouter();
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  // Variable d'ombre pour les boutons
  const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.18)"; 

  // Définition des étapes avec les textes explicatifs
  const etapes = [
    { 
      id: 1, 
      texte: "Bienvenue sur LisIA. Pour commencer, appuie sur le bouton appareil photo en bas de l'écran d'accueil pour prendre en photo un texte ou des instructions." 
    },
    { 
      id: 2, 
      texte: "Une fois la photo prise, l'intelligence artificielle va transformer le texte en images simples. Tu pourras cliquer sur l'image pour l'agrandir ou appuyer sur l'oreille pour écouter l'explication." 
    },
    { 
      id: 3, 
      texte: "Tu peux enregistrer tes scans pour les retrouver plus tard. Pour cela, utilise le bouton historique. Tes anciennes lectures y sont rangées par date." 
    }
  ];

  const lireEtape = (texte: string, index: number) => {
    // Si une voix parle déjà, on l'arrête
    window.speechSynthesis.cancel();

    // Si on clique sur le même bouton qui est en train de parler, on s'arrête là
    if (speakingIndex === index) {
      setSpeakingIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(texte);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9; // Vitesse légèrement plus lente pour bien comprendre

    utterance.onstart = () => setSpeakingIndex(index);
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">
      
      {/* 1. HEADER (Maison) */}
      <div className="pt-10 pb-4 px-8 z-30 relative bg-[#FFF9EE]">
        <button 
          onClick={() => {
            window.speechSynthesis.cancel();
            router.push('/');
          }}
          style={{ 
            width: '56px', height: '56px', 
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

      {/* 2. ZONE DE LISTE */}
      <div className="flex-1 overflow-y-auto px-6 pb-48">
        <div className="flex flex-col items-center mt-4">
          {etapes.map((etape, index) => (
            <div key={etape.id} className="w-full flex flex-col items-center">
              
              {/* LA CASE D'ÉTAPE */}
              <div 
                className="bg-white rounded-[40px] p-6 flex items-center justify-center shadow-sm border border-black/5 w-full transition-all"
                style={{ 
                  minHeight: '160px',
                  backgroundColor: speakingIndex === index ? '#E0F2F7' : 'white' 
                }} 
              >
                <button 
                    onClick={() => lireEtape(etape.texte, index)}
                    style={{ 
                        width: '110px', 
                        height: '110px', 
                        backgroundColor: speakingIndex === index ? '#FFC1C1' : '#FFF9EE', 
                        boxShadow: strongShadow,
                        borderRadius: '50%',
                        transition: 'all 0.3s'
                    }}
                    className="flex items-center justify-center border-none active:scale-95 transition-transform cursor-pointer"
                >
                  <img 
                    src="/oreille.svg" 
                    alt="Écouter" 
                    className={`w-14 ${speakingIndex === index ? 'animate-pulse' : ''}`} 
                  />
                </button>
              </div>

              {/* LA FLÈCHE */}
              {index < etapes.length - 1 && (
                <div className="py-4">
                  <svg width="35" height="35" viewBox="0 0 24 24" fill="none">
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
             onClick={() => {
                window.speechSynthesis.cancel();
                router.push('/aide');
             }}
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
