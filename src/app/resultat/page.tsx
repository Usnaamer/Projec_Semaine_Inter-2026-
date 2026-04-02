"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultatPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [speaking, setSpeaking] = useState(false);
  const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.18)";

  useEffect(() => {
    const img = sessionStorage.getItem("generatedImage");
    const desc = sessionStorage.getItem("description");
    if (img) setImage(img);
    if (desc) setDescription(desc);
  }, []);

  const lireInstructions = () => {
    if (!description) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(description);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const sauvegarderEtQuitter = () => {
    if (!image) return;
    const history = JSON.parse(localStorage.getItem('lisIA_history') || '[]');
    // Évite les doublons
    const alreadySaved = history[0]?.image === image;
    if (!alreadySaved) {
      history.unshift({ image, description, date: new Date().toISOString() });
      localStorage.setItem('lisIA_history', JSON.stringify(history.slice(0, 20)));
    }
    router.push('/historique');
  };

  const telecharger = () => {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = "lisIA-pictogrammes.jpg";
    a.click();
  };

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">

      {/* HEADER */}
      <div className="pt-10 pb-4 px-8 z-30 relative">
        <button
          onClick={() => router.push('/')}
          style={{
            width: '56px', height: '56px',
            backgroundColor: 'transparent',
            border: '2px solid #1F6680',
            borderRadius: '50%',
          }}
          className="flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          <img src="/maison.svg" alt="Accueil" className="w-7" />
        </button>
      </div>

      {/* ZONE CENTRALE */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 pb-8">

        {image ? (
          <>
            {/* Card image + bouton écouter — même style que historique */}
            <div
              className="bg-white rounded-[40px] p-6 flex items-center w-full shadow-sm border border-black/5"
              style={{ minHeight: '190px', boxShadow: strongShadow }}
            >
              {/* Miniature image */}
              <div className="w-44 h-32 rounded-[25px] shrink-0 overflow-hidden bg-gray-100">
                <img
                  src={image}
                  alt="Pictogrammes générés"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1" />

              {/* Bouton écouter style oreille */}
              <button
                onClick={lireInstructions}
                style={{
                  width: '80px', height: '80px',
                  backgroundColor: speaking ? '#FFC1C1' : '#FFF9EE',
                  boxShadow: strongShadow,
                  transition: 'background-color 0.3s',
                }}
                className="rounded-full flex items-center justify-center active:scale-90 shrink-0 border-none"
              >
                <img src="/oreille.svg" alt="Écouter" className="w-10" />
              </button>
            </div>

            {/* Description */}
            {description && (
              <p className="text-center text-sm opacity-50 px-4 italic line-clamp-3">
                "{description}"
              </p>
            )}

            {/* Boutons secondaires */}
            <div className="flex gap-4">
              {/* Refaire */}
              <button
                onClick={() => router.push('/camera')}
                style={{
                  width: '70px', height: '70px',
                  backgroundColor: 'white',
                  border: '2px solid #1F6680',
                  boxShadow: strongShadow,
                }}
                className="rounded-full flex items-center justify-center active:scale-90 transition-transform"
              >
                <img src="/recommencer.svg" alt="Refaire" className="w-8" />
              </button>

              {/* Télécharger */}
              <button
                onClick={telecharger}
                style={{
                  width: '70px', height: '70px',
                  backgroundColor: '#FFF9EE',
                  border: '2px solid #1F6680',
                  boxShadow: strongShadow,
                }}
                className="rounded-full flex items-center justify-center active:scale-90 transition-transform"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v13M12 16l-4-4M12 16l4-4M3 19h18"
                    stroke="#1F6680" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Sauvegarder → historique */}
              <button
                onClick={sauvegarderEtQuitter}
                style={{
                  width: '70px', height: '70px',
                  backgroundColor: '#FFF9EE',
                  border: '2px solid #1F6680',
                  boxShadow: strongShadow,
                }}
                className="rounded-full flex items-center justify-center active:scale-90 transition-transform"
              >
                <img src="/historique.svg" alt="Historique" className="w-8" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 opacity-50">
            <p className="text-center">Aucune image générée.</p>
            <button onClick={() => router.push('/camera')} className="underline">
              Prendre une photo
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
