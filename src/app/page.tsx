"use client"; // 1. On ajoute ça tout en haut pour permettre le clic
import { useRouter } from 'next/navigation'; // 2. On importe le "GPS"
export default function Home() {
  const router = useRouter(); // 3. On initialise le GPS
  return (
    /* Conteneur principal : Fond crème, toute la hauteur, sans texte */
    <main className="flex flex-col items-center justify-between min-h-screen py-12 px-6 overflow-hidden">
      
      {/* 1. LE LOGO (80x69px) - En haut */}
      <div className="mt-4">
        <img 
          src="/logo.svg" 
          alt="Logo" 
          style={{ width: '80px', height: '69px', objectFit: 'contain' }} 
        />
      </div>

      {/* 2. LE BOUTON CENTRAL (222x222px) - Au milieu */}
      <div className="flex flex-col items-center justify-center">
        <button 
          onClick={() => router.push('/camera')} // 4. Action : va vers le dossier /camera
          style={{ 
            width: '222px', 
            height: '222px', 
            backgroundColor: '#1F6680',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            boxShadow: '0 12px 35px rgba(31, 102, 128, 0.3)',
            cursor: 'pointer'
          }}
        >
          <img 
            src="/camera.svg" 
            alt="Action" 
            style={{ width: '100px', height: 'auto' }} 
          />
        </button>
      </div>

      {/* 3. LA NAVIGATION (Boutons de 75px) - En bas */}
      <nav className="w-full flex justify-around items-end max-w-sm pb-4">
        
        {/* Bouton Aide */}
        <button className="btn-rond-blanc">
          <img src="/aide.svg" alt="" style={{ width: '38px' }} />
        </button>

        {/* Bouton Livre (un peu surélevé) */}
        <button className="btn-rond-blanc mb-10">
          <img src="/livre.svg" alt="" style={{ width: '38px' }} />
        </button>

        {/* Bouton Histoire */}
        <button className="btn-rond-blanc">
          <img src="/historique.svg" alt="" style={{ width: '38px' }} />
        </button>

      </nav>

    </main>
  );
}