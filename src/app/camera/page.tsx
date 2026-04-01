"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [flash, setFlash] = useState(false);

  // Fonction flash toute simple
  const prendrePhoto = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 100);
    console.log("Photo prise !");
  };

  // Lancement de la caméra
  useEffect(() => {
    // Vérifie que l'API est disponible (HTTPS + navigateur)
    if (!navigator?.mediaDevices?.getUserMedia) {
      console.error("getUserMedia non supporté (HTTP ou navigateur incompatible)");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <main className="flex flex-col h-screen bg-black overflow-hidden">
      
      {/* 1. LE HAUT (Header Crème) */}
      <div className="bg-[#FFF9EE] h-24 flex items-center px-6">
        <button 
          onClick={() => router.push('/')} 
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1F6680] cursor-pointer"
        >
          <img src="/fleche.svg" alt="Retour" style={{ width: '24px' }} />
        </button>
      </div>

      {/* 2. LE MILIEU (Vidéo + Cadre) */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
        {/* Le rectangle blanc qui clignote */}
        {flash && <div className="absolute inset-0 bg-white z-50" />}
        
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
        
        <div 
          className="relative z-10 border-2 border-white rounded-lg pointer-events-none"
          style={{ width: '85%', height: '65%', boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.4)' }}
        ></div>
      </div>

      {/* 3. LE BAS (Bouton Déclencheur) */}
      <div className="h-40 bg-black flex items-center justify-center">
        <button 
          onClick={prendrePhoto}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-600 cursor-pointer active:scale-95 transition-transform"
        />
      </div>

    </main>
  );
}