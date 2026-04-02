"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface HistoryItem {
  image: string;
  description: string;
  date: string;
}

export default function HistoriquePage() {
  const router = useRouter();
  const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.18)";
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lisIA_history') || '[]');
    setItems(saved);
  }, []);

  const lire = (description: string, index: number) => {
    window.speechSynthesis.cancel();
    if (speakingIndex === index) {
      setSpeakingIndex(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(description);
    utterance.lang = 'fr-FR';
    utterance.onstart = () => setSpeakingIndex(index);
    utterance.onend = () => setSpeakingIndex(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">

      {/* MODALE ZOOM */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in zoom-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain" />
          <button className="absolute top-10 right-10 text-white text-4xl">&times;</button>
        </div>
      )}

      {/* HEADER */}
      <div className="pt-10 pb-4 px-8 z-30 relative">
        <button onClick={() => router.push('/')} style={{ width: '56px', height: '56px', border: '2px solid #1F6680', borderRadius: '50%' }} className="flex items-center justify-center active:scale-90 bg-transparent">
          <img src="/maison.svg" alt="Accueil" className="w-7" />
        </button>
      </div>

      {/* LISTE D'HISTORIQUE */}
      <div className="flex-1 overflow-y-auto px-6 pb-48 space-y-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40 pt-20">
            <p>Aucun scan sauvegardé.</p>
          </div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="bg-white rounded-[40px] p-6 flex items-center shadow-sm border border-black/5" style={{ minHeight: '190px' }}>
              {/* Miniature Cliquable */}
              <div 
                onClick={() => setSelectedImage(item.image)}
                className="w-44 h-32 rounded-[25px] shrink-0 overflow-hidden bg-gray-100 cursor-pointer active:scale-95 transition-transform"
              >
                <img src={item.image} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1" />

              <button
                onClick={() => lire(item.description, i)}
                style={{ width: '80px', height: '80px', backgroundColor: speakingIndex === i ? '#FFC1C1' : '#FFF9EE', boxShadow: strongShadow }}
                className="rounded-full flex items-center justify-center active:scale-90 border-none transition-colors"
              >
                <img src="/oreille.svg" className="w-10" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* BOUTON AIDE */}
      <div className="absolute bottom-0 left-0 w-full h-[200px] flex justify-center z-20 pointer-events-none">
        <div style={{ width: '580px', height: '400px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, pointerEvents: 'auto' }} className="shadow-[0_-15px_40px_rgba(0,0,0,0.06)]" />
        <div className="relative z-30 pt-24 pointer-events-auto">
          <button onClick={() => router.push('/aide')} style={{ backgroundColor: '#FFF9EE', width: '90px', height: '90px', boxShadow: strongShadow }} className="rounded-full flex items-center justify-center active:scale-90 border-none">
            <img src="/aide.svg" style={{ width: '42px' }} />
          </button>
        </div>
      </div>
    </main>
  );
}
