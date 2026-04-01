"use client";

import { useRouter } from 'next/navigation';

export default function ResultatPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative">
      
      {/* 1. BOUTON RETOUR (Flèche bleue) */}
      <div className="pt-12 px-6">
        <button 
          onClick={() => router.push('/camera')}
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1F6680] cursor-pointer bg-transparent"
        >
          <img src="/fleche.svg" alt="Retour" style={{ width: '24px' }} />
        </button>
      </div>

      {/* 2. ZONE DE L'IMAGE (Le résultat de l'IA) */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div 
          className="w-full aspect-[3/4] bg-[#FFC1C1] rounded-3xl relative shadow-sm border-2 border-white/20"
          /* C'est ici que l'image avec les pictogrammes s'affichera */
        >
          {/* Icône décorative de scan (en bas à droite du cadre rose) */}
          <div className="absolute bottom-6 right-6 w-10 h-10 opacity-40">
             <img src="/agrandir.svg" alt="" className="w-full" />
          </div>
        </div>
      </div>

      {/* 3. MENU BAS (La forme arrondie blanche) */}
      <div className="bg-white rounded-t-[60px] pt-10 pb-14 px-10 flex flex-col items-center shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
        
        {/* BOUTON AUDIO (L'oreille - Elément principal) */}
        <button 
          className="w-24 h-24 bg-white border-2 border-[#F3F4F6] rounded-full flex items-center justify-center mb-8 shadow-md active:scale-90 transition-transform"
        >
          <img src="/oreille.svg" alt="Écouter" style={{ width: '50px' }} />
        </button>

        {/* BOUTONS SECONDAIRES (Aide et Historique) */}
        <div className="flex justify-between w-full max-w-[280px]">
          <button className="w-16 h-16 bg-white border-2 border-[#F3F4F6] rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-sm">
            <img src="/aide.svg" alt="Aide" style={{ width: '32px' }} />
          </button>
          
          <button className="w-16 h-16 bg-white border-2 border-[#F3F4F6] rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-sm">
            <img src="/historique.svg" alt="Historique" style={{ width: '32px' }} />
          </button>
        </div>
      </div>

    </main>
  );
}