"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type TicketStatus = 'pending' | 'answered';

interface Ticket {
  id: string;
  created_at: string;
  audio_url: string;
  status: TicketStatus;
  response: string | null;
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'Z'); // force UTC → local
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD === 1) return "Hier";
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function TicketCard({
  ticket, onClick, isSelected, onDelete, isDeleting
}: {
  ticket: Ticket;
  onClick: () => void;
  isSelected: boolean;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.12)";
  const isPending = ticket.status === 'pending';
  const shortId = ticket.id.slice(0, 8).toUpperCase();

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: isSelected ? '#1F6680' : 'white',
        border: isSelected ? '2px solid #1F6680' : '2px solid transparent',
        borderRadius: '20px',
        padding: '16px 20px',
        boxShadow: strongShadow,
        transition: 'all 0.2s ease',
        opacity: isDeleting ? 0.5 : 1,
      }}
    >
      {/* Zone cliquable principale */}
      <button
        onClick={onClick}
        className="w-full text-left cursor-pointer"
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}
                className={isSelected ? 'text-white/60' : 'text-[#1F6680]/50'}>
                #{shortId}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600 }}
                className={isSelected ? 'text-white/60' : 'text-[#1F6680]/50'}>
                · {formatDate(ticket.created_at)}
              </span>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.4 }}
              className={`truncate ${isSelected ? 'text-white' : 'text-[#1F6680]'}`}>
              Message vocal
            </p>
          </div>

          <span style={{
            flexShrink: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
            padding: '4px 10px', borderRadius: '999px',
            backgroundColor: isPending
              ? (isSelected ? 'rgba(255,193,193,0.3)' : '#FFF0F0')
              : (isSelected ? 'rgba(193,255,209,0.3)' : '#F0FFF4'),
            color: isPending
              ? (isSelected ? '#FFAAAA' : '#C0392B')
              : (isSelected ? '#A8FFBC' : '#27AE60'),
          }}>
            {isPending ? '❌' : '✅'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke={isSelected ? 'rgba(255,255,255,0.5)' : 'rgba(31,102,128,0.4)'}
            strokeWidth="2" strokeLinecap="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
          </svg>
          <span style={{ fontSize: '11px' }} className={isSelected ? 'text-white/40' : 'text-[#1F6680]/40'}>
            Audio
          </span>
        </div>
      </button>

      {/* Bouton supprimer — uniquement si pending */}
      {ticket.status === 'pending' && (
        <div className="flex justify-end mt-3">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            disabled={isDeleting}
            style={{
              fontSize: '12px', fontWeight: 600,
              color: isSelected ? 'rgba(255,170,170,0.9)' : '#C0392B',
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              opacity: isDeleting ? 0.5 : 1,
            }}
          >
            {isDeleting ? (
              'Suppression…'
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Supprimer
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function MesDemandesPage() {
  const router = useRouter();
  const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.18)";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTickets = () => {
    setLoading(true);
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleDelete = async (ticket: Ticket) => {
    setDeletingId(ticket.id);
    try {
      const res = await fetch('/api/tickets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticket.id, audio_url: ticket.audio_url }),
      });
      if (!res.ok) throw new Error('Erreur suppression');
      setTickets(prev => prev.filter(t => t.id !== ticket.id));
      if (selectedId === ticket.id) setSelectedId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const selectedTicket = tickets.find(t => t.id === selectedId) ?? null;
  const pendingCount = tickets.filter(t => t.status === 'pending').length;

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] overflow-hidden relative text-[#1F6680]">

      {/* HEADER */}
      <div className="pt-10 pb-4 px-8 z-30 relative flex items-center gap-4">
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

        <div className="flex-1">
          <h1 style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1 }}>Mes demandes</h1>
          {pendingCount > 0 && (
            <p style={{ fontSize: '13px', marginTop: '2px' }} className="text-[#1F6680]/60">
              {pendingCount} en attente de réponse
            </p>
          )}
        </div>

        <button
          onClick={() => router.push('/aide')}
          style={{
            width: '56px', height: '56px', backgroundColor: '#1F6680',
            border: 'none', borderRadius: '50%', boxShadow: strongShadow
          }}
          className="flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* LISTE */}
      <div className="flex-1 overflow-y-auto px-6 pb-48 z-20 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full opacity-40">
            <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1F6680" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1F6680" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-center text-sm font-medium">Aucune demande pour l'instant</p>
            <button
              onClick={() => router.push('/aide')}
              style={{ padding: '10px 24px', backgroundColor: '#1F6680', border: 'none', borderRadius: '999px', color: 'white', fontWeight: 600, fontSize: '14px' }}
              className="active:scale-95 transition-transform cursor-pointer"
            >
              Créer une demande
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-2">
            {tickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                isSelected={ticket.id === selectedId}
                onClick={() => setSelectedId(ticket.id === selectedId ? null : ticket.id)}
                onDelete={() => handleDelete(ticket)}
                isDeleting={deletingId === ticket.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* PANNEAU DÉTAIL */}
      {selectedTicket && (
        <div className="absolute bottom-0 left-0 w-full z-30" style={{ maxHeight: '52vh' }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '32px 32px 0 0',
            padding: '24px 24px 40px', boxShadow: '0 -8px 40px rgba(0,0,0,0.08)',
            overflowY: 'auto', maxHeight: '52vh',
          }}>
            <div style={{
              width: '40px', height: '4px', backgroundColor: '#1F6680',
              borderRadius: '2px', margin: '0 auto 20px', opacity: 0.2
            }} />

            <div className="flex items-center justify-between mb-4">
              <p style={{ fontSize: '12px', color: '#1F6680', opacity: 0.4 }}>
                {formatDate(selectedTicket.created_at)}
              </p>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px',
                backgroundColor: selectedTicket.status === 'pending' ? '#FFF0F0' : '#F0FFF4',
                color: selectedTicket.status === 'pending' ? '#C0392B' : '#27AE60',
              }}>
                {selectedTicket.status === 'pending' ? '❌' : '✅'}
              </span>
            </div>

            {/* Lecteur audio */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#1F6680', opacity: 0.45, marginBottom: '6px' }}>
                VOTRE MESSAGE
              </p>
              <div style={{ backgroundColor: '#F0F7FA', borderRadius: '16px', padding: '14px 16px' }}>
                <audio controls src={selectedTicket.audio_url} className="w-full" style={{ height: '36px' }} />
              </div>
            </div>

            {/* Réponse ou attente */}
            {selectedTicket.status === 'answered' && selectedTicket.response ? (
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#27AE60', opacity: 0.8, marginBottom: '6px' }}>
                  RÉPONSE DU SUPPORT
                </p>
                <div style={{
                  backgroundColor: '#F0FFF4', borderRadius: '16px', padding: '14px 16px',
                  borderLeft: '3px solid #27AE60',
                }}>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#1F6680' }}>
                    {selectedTicket.response}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#FFF9EE', borderRadius: '16px', padding: '14px 16px',
                border: '1.5px dashed rgba(31,102,128,0.2)',
              }} className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1F6680" strokeWidth="1.8" className="opacity-40 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <p style={{ fontSize: '13px', color: '#1F6680', opacity: 0.5 }}>
                  Notre équipe vous répondra bientôt
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}