"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AidePage() {
  const router = useRouter();
  
  // États pour l'interface
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  
  // Références pour le vrai enregistrement audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.18)";

  // --- LOGIQUE DU MICRO ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setHasRecorded(false);
    } catch (err) {
      console.error("Erreur micro :", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setHasRecorded(true);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudio = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    console.log("Envoi de :", audioBlob);
    router.push('/');
  };

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">
      
      {/* 1. HEADER */}
      <div className="pt-10 pb-4 px-8 z-30 relative">
        <button 
          onClick={() => router.push('/')}
          style={{ 
            width: '56px', height: '56px', backgroundColor: 'transparent', 
            border: '2px solid #1F6680', borderRadius: '50%', boxShadow: strongShadow 
          }}
          className="flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          <img src="/maison.svg" alt="Accueil" className="w-7" />
        </button>
      </div>

      {/* 2. ZONE CENTRALE */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 pb-20 relative">
        
        <div className="relative flex items-center justify-center w-full">
          
          {/* Onde de choc rose */}
          {isRecording && (
            <div className="absolute w-[260px] h-[260px] bg-[#FFC1C1] rounded-full animate-ping opacity-40" />
          )}
          
          {/* BOUTON PRINCIPAL (TRANSFORMISTE) */}
          <button 
            onMouseDown={() => { if(!hasRecorded) startRecording(); }}
            onMouseUp={stopRecording}
            onTouchStart={() => { if(!hasRecorded) startRecording(); }}
            onTouchEnd={stopRecording}
            onClick={() => { if(hasRecorded) sendAudio(); }} 
            
            style={{ 
              width: '180px', height: '180px', 
              backgroundColor: isRecording ? '#FFC1C1' : '#1F6680', 
              boxShadow: strongShadow, border: 'none'
            }}
            className="relative z-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
          >
            {!hasRecorded ? (
              <img src="/micro.svg" alt="Parler" className={`w-16 ${isRecording ? 'scale-110' : ''}`} />
            ) : (
              /* ICONE ENVOYER AGRANDIE ET RECENTRÉE VISUELLEMENT */
              <img 
                src="/envoyer.svg" 
                alt="Envoyer" 
                className="w-24 ml-2" // ml-2 compense la pointe pour un centrage optique parfait
              />
            )}
          </button>

          {/* BOUTON RECOMMENCER */}
          {hasRecorded && !isRecording && (
            <button 
              onClick={() => setHasRecorded(false)}
              style={{ 
                width: '60px', height: '60px', 
                backgroundColor: 'white', border: '2px solid #1F6680',
                position: 'absolute', right: '10%', bottom: '-10px',
                boxShadow: strongShadow 
              }}
              className="z-20 rounded-full flex items-center justify-center active:rotate-[-45deg] transition-transform"
            >
              <img src="/recommencer.svg" alt="Supprimer et refaire" className="w-7" />
            </button>
          )}

        </div>
      </div>

      {/* 3. DÔME BLANC VIDE */}
      <div className="absolute bottom-0 left-0 w-full h-[180px] pointer-events-none">
        <div 
          style={{ 
            width: '600px', height: '350px', backgroundColor: 'white',
            borderRadius: '50%', position: 'absolute', top: '80px', left: '50%',
            transform: 'translateX(-50%)', zIndex: 10
          }}
          className="shadow-[0_-15px_40px_rgba(0,0,0,0.04)]"
        />
      </div>

    </main>
  );
}