"use client";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Ombre prononcée et contrastée
  const strongCircularShadow = "0px 4px 25px rgba(0, 0, 0, 0.18)"; 

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">
      
      {/* 1. LE LOGO (80x69px) */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8">
        <img 
          src="/logo.svg" 
          alt="Logo" 
          style={{ width: '80px', height: '69px', objectFit: 'contain' }} 
        />
      </div>

      {/* 2. LE BOUTON CENTRAL BLEU (222x222px) */}
      <div className="flex-[2.2] flex items-center justify-center">
        <button 
          onClick={() => router.push('/camera')}
          style={{ 
            width: '222px', 
            height: '222px', 
            backgroundColor: '#1F6680',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            boxShadow: strongCircularShadow,
            cursor: 'pointer'
          }}
          className="active:scale-95 transition-transform"
        >
          <img 
            src="/camera.svg" 
            alt="Action" 
            style={{ width: '100px', height: 'auto' }} 
          />
        </button>
      </div>

      {/* 3. LE DÔME BLANC ET SES BOUTONS XXL */}
      <div className="relative w-full h-[220px] shrink-0 flex flex-col items-center z-20">
        
        {/* L'Ellipse de fond */}
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

        {/* Boutons sur le dôme */}
        <div className="relative z-30 flex flex-col items-center pt-6 pb-12 w-full max-w-[300px]">
          
          <button 
            style={{ 
              width: '90px', 
              height: '90px', 
              backgroundColor: '#FFF9EE',
              boxShadow: strongCircularShadow 
            }} 
            className="rounded-full flex items-center justify-center mb-4 active:scale-95 transition-all border-none cursor-pointer"
          >
            <img src="/livre.svg" alt="Bibliothèque" style={{ width: '48px' }} />
          </button>

          <div className="flex justify-between w-full px-2">
            <button 
               style={{ 
                 backgroundColor: '#FFF9EE', 
                 width: '74px', 
                 height: '74px',
                 boxShadow: strongCircularShadow 
               }}
               className="rounded-full flex items-center justify-center active:scale-90 border-none cursor-pointer"
            >
              <img src="/aide.svg" alt="Aide" style={{ width: '34px' }} />
            </button>
            
            <button 
               style={{ 
                 backgroundColor: '#FFF9EE', 
                 width: '74px', 
                 height: '74px',
                 boxShadow: strongCircularShadow 
               }}
               className="rounded-full flex items-center justify-center active:scale-90 border-none cursor-pointer"
            >
              <img src="/historique.svg" alt="Historique" style={{ width: '34px' }} />
            </button>
          </div>
        </div>
      </div>

    </main>
  );
}