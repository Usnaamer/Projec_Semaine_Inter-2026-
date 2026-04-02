"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AidePage() {
  const router = useRouter();

  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.18)";

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
      setError(null);
    } catch (err) {
      console.error("Erreur micro :", err);
      setError("Impossible d'accéder au microphone");
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

  const sendAudio = async () => {
    if (isSending || isSent) return;
    setIsSending(true);
    setError(null);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'message.wav');

      const res = await fetch('/api/tickets', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Erreur envoi');

      setIsSent(true);
      setTimeout(() => router.push('/mes-demandes'), 1000);
    } catch (err) {
      console.error(err);
      setError("Échec de l'envoi, réessayez");
      setIsSending(false);
    }
  };

  const getLabel = () => {
    if (error) return error;
    if (isSent) return "Envoyé ✓";
    if (isSending) return "Envoi en cours…";
    if (hasRecorded) return "Appuyer pour envoyer";
    if (isRecording) return "Relâcher pour terminer";
    return "Maintenir pour enregistrer";
  };

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">

      {/* DÔME BLANC (tout derrière) */}
      <div className="absolute bottom-0 left-0 w-full h-[180px] pointer-events-none" style={{ zIndex: 0 }}>
        <div
          style={{
            width: '600px', height: '350px', backgroundColor: 'white',
            borderRadius: '50%', position: 'absolute', top: '80px', left: '50%',
            transform: 'translateX(-50%)',
          }}
          className="shadow-[0_-15px_40px_rgba(0,0,0,0.04)]"
        />
      </div>

      {/* HEADER */}
      <div className="pt-10 pb-4 px-8 flex items-center gap-4" style={{ zIndex: 20, position: 'relative' }}>
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

        <button
          onClick={() => router.push('/mes-demandes')}
          style={{
            height: '40px', paddingInline: '16px', backgroundColor: 'transparent',
            border: '2px solid #1F6680', borderRadius: '999px', boxShadow: strongShadow,
            fontSize: '14px', fontWeight: 600
          }}
          className="flex items-center gap-2 active:scale-95 transition-transform cursor-pointer"
        >
          Mes demandes
        </button>
      </div>

      {/* ZONE CENTRALE */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-10 pb-28 gap-6"
        style={{ zIndex: 10, position: 'relative' }}
      >
        <p className="text-center text-[#1F6680]/70 text-sm font-medium tracking-wide max-w-[240px]">
          {isRecording ? "Je vous écoute…" : hasRecorded ? "Votre message est prêt" : "Décrivez votre problème"}
        </p>

        <div className="relative flex items-center justify-center w-full">

          {isRecording && (
            <>
              <div className="absolute w-[260px] h-[260px] bg-[#FFC1C1] rounded-full animate-ping opacity-30" />
              <div className="absolute w-[210px] h-[210px] bg-[#FFC1C1] rounded-full animate-ping opacity-20" style={{ animationDelay: '0.3s' }} />
            </>
          )}

          {isSent && (
            <div className="absolute w-[260px] h-[260px] bg-[#C1FFD1] rounded-full animate-ping opacity-40" />
          )}

          {/* BOUTON PRINCIPAL */}
          <button
            onMouseDown={() => { if (!hasRecorded && !isSending && !isSent) startRecording(); }}
            onMouseUp={stopRecording}
            onTouchStart={(e) => { e.preventDefault(); if (!hasRecorded && !isSending && !isSent) startRecording(); }}
            onTouchEnd={stopRecording}
            onClick={() => { if (hasRecorded && !isSending && !isSent) sendAudio(); }}
            disabled={isSending || isSent}
            style={{
              width: '180px', height: '180px',
              backgroundColor: isSent ? '#4CAF82' : isSending ? '#A8C5D0' : isRecording ? '#FFC1C1' : '#1F6680',
              boxShadow: strongShadow,
              border: 'none',
              transition: 'background-color 0.4s ease',
              position: 'relative',
              zIndex: 10,
            }}
            className="rounded-full flex items-center justify-center active:scale-95 cursor-pointer"
          >
            {isSent ? (
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : isSending ? (
              <svg className="animate-spin" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : !hasRecorded ? (
              <img src="/micro.svg" alt="Parler" className={`w-16 transition-transform duration-200 ${isRecording ? 'scale-110' : ''}`} />
            ) : (
              <img src="/envoyer.svg" alt="Envoyer" className="w-24 ml-2" />
            )}
          </button>

          {/* BOUTON RECOMMENCER */}
          {hasRecorded && !isRecording && !isSending && !isSent && (
            <button
              onClick={() => { setHasRecorded(false); audioChunksRef.current = []; }}
              style={{
                width: '60px', height: '60px',
                backgroundColor: 'white', border: '2px solid #1F6680',
                position: 'absolute', right: '10%', bottom: '-10px',
                boxShadow: strongShadow,
                zIndex: 20,
              }}
              className="rounded-full flex items-center justify-center active:rotate-[-45deg] transition-transform cursor-pointer"
            >
              <img src="/recommencer.svg" alt="Supprimer et refaire" className="w-7" />
            </button>
          )}
        </div>

        {/* Label état */}
        <p
          className="text-sm font-semibold tracking-wide transition-all duration-300"
          style={{ color: error ? '#C0392B' : isSent ? '#4CAF82' : '#1F6680' }}
        >
          {getLabel()}
        </p>
      </div>

    </main>
  );
}