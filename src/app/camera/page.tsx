"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Erreur caméra :", err);
      }
    }
    setupCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <main className="flex flex-col h-screen bg-black overflow-hidden">
      
      {/* HEADER CRÈME + TA FLÈCHE IMAGE */}
      <div className="bg-[#FFF9EE] h-24 flex items-center px-6">
        <button 
          onClick={() => router.push('/')} 
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1F6680] cursor-pointer"
        >
          <img src="/fleche.svg" alt="Retour" style={{ width: '24px' }} />
        </button>
      </div>

      {/* ZONE DE SCAN (Cadre blanc) */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
        
        <div 
          className="relative z-10 border-2 border-white rounded-lg"
          style={{ width: '85%', height: '65%', boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.4)' }}
        ></div>
      </div>

      {/* BOUTON BLANC (Déclencheur) */}
      <div className="h-40 bg-black flex items-center justify-center">
        <button 
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-400 cursor-pointer active:scale-90 transition-transform"
        />
      </div>

    </main>
  );
}