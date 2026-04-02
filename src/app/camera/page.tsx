"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [flash, setFlash] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyse en cours...");

  // Lancement de la caméra
  useEffect(() => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      console.error("getUserMedia non supporté");
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.error(err));
  }, []);

  // Animation du texte de chargement
  useEffect(() => {
    if (!loading) return;
    const messages = [
      "Analyse en cours...",
      "Lecture de l'affiche...",
      "Création des pictogrammes...",
      "Génération de l'image...",
      "Presque prêt... ✨",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const prendrePhoto = async () => {
    // Flash visuel
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    // Capturer le frame de la vidéo dans un canvas
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    // Convertir en blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("image", blob, "photo.jpg");

        const response = await fetch("/api/scan", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          // Stocker l'image générée dans sessionStorage pour la page résultat
          sessionStorage.setItem("generatedImage", data.image);
          sessionStorage.setItem("description", data.description);
          router.push("/resultat");
        } else {
          alert("Erreur : " + data.error);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        alert("Erreur réseau");
        setLoading(false);
      }
    }, "image/jpeg", 0.85);
  };

  return (
    <main className="flex flex-col h-screen bg-black overflow-hidden">

      {/* Canvas caché pour la capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 1. HEADER */}
      <div className="bg-[#FFF9EE] h-24 flex items-center px-6">
        <button
          onClick={() => router.push('/')}
          className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#1F6680] cursor-pointer"
        >
          <img src="/fleche.svg" alt="Retour" style={{ width: '24px' }} />
        </button>
      </div>

      {/* 2. VIDÉO + CADRE */}
      <div className="relative flex-1 flex items-center justify-center bg-black">
        {flash && <div className="absolute inset-0 bg-white z-50" />}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="relative z-10 border-2 border-white rounded-lg pointer-events-none"
          style={{ width: '85%', height: '65%', boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.4)' }}
        />

        {/* Overlay de chargement */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center gap-6">
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white text-lg font-medium text-center px-8">{loadingText}</p>
          </div>
        )}
      </div>

      {/* 3. BOUTON DÉCLENCHEUR */}
      <div className="h-40 bg-black flex items-center justify-center">
        <button
          onClick={prendrePhoto}
          disabled={loading}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-600 cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
        />
      </div>

    </main>
  );
}
