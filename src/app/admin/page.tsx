"use client";

import { useState, useEffect } from 'react';

type TicketStatus = 'pending' | 'answered';

interface Ticket {
  id: string;
  created_at: string;
  audio_url: string;
  status: TicketStatus;
  response: string | null;
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'Z');
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

const strongShadow = "0px 4px 25px rgba(0, 0, 0, 0.14)";

// --- ÉCRAN DE LOGIN ---
function LoginScreen({ onLogin }: { onLogin: (pwd: string) => void }) {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!pwd.trim()) return;
    onLogin(pwd);
    setError(true); // sera réinitialisé par le parent si OK
  };

  return (
    <main className="flex flex-col h-screen bg-[#FFF9EE] items-center justify-center px-8 gap-6 text-[#1F6680]">
      <div style={{
        width: '72px', height: '72px', backgroundColor: '#1F6680',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: strongShadow,
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      <div className="text-center">
        <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Espace admin</h1>
        <p style={{ fontSize: '14px', opacity: 0.5, marginTop: '4px' }}>Accès réservé au support</p>
      </div>

      <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="password"
          placeholder="Mot de passe"
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setError(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          style={{
            width: '100%', height: '52px', borderRadius: '16px',
            border: error ? '2px solid #C0392B' : '2px solid rgba(31,102,128,0.2)',
            padding: '0 16px', fontSize: '16px', color: '#1F6680',
            backgroundColor: 'white', outline: 'none',
            boxShadow: strongShadow,
          }}
        />
        {error && (
          <p style={{ fontSize: '13px', color: '#C0392B', textAlign: 'center' }}>
            Mot de passe incorrect
          </p>
        )}
        <button
          onClick={handleSubmit}
          style={{
            height: '52px', backgroundColor: '#1F6680', border: 'none',
            borderRadius: '16px', color: 'white', fontWeight: 700,
            fontSize: '16px', cursor: 'pointer', boxShadow: strongShadow,
          }}
          className="active:scale-95 transition-transform"
        >
          Accéder
        </button>
      </div>
    </main>
  );
}

// --- PAGE ADMIN ---
export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleLogin = (pwd: string) => {
    setPassword(pwd);
    setAuthed(true);
    setAuthError(false);
  };

  const fetchTickets = () => {
    setLoading(true);
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        const firstPending = data.find((t: Ticket) => t.status === 'pending');
        if (firstPending) setSelectedId(firstPending.id);
        else if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authed) fetchTickets();
  }, [authed]);

  const handleSendResponse = async () => {
    if (!selectedId || !responseText.trim() || !password) return;
    setSending(true);

    try {
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedId, response: responseText, password }),
      });

      if (res.status === 401) {
        setAuthed(false);
        setAuthError(true);
        return;
      }
      if (!res.ok) throw new Error();

      setSuccessId(selectedId);
      setResponseText('');
      setTickets(prev => prev.map(t =>
        t.id === selectedId ? { ...t, status: 'answered', response: responseText } : t
      ));
      setTimeout(() => setSuccessId(null), 2000);
    } catch {
      alert('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  if (!authed) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const selectedTicket = tickets.find(t => t.id === selectedId) ?? null;
  const pendingCount = tickets.filter(t => t.status === 'pending').length;

  return (
    <main className="flex h-screen bg-[#FFF9EE] overflow-hidden text-[#1F6680]">

      {/* COLONNE GAUCHE — liste tickets */}
      <div className="flex flex-col w-[340px] shrink-0 border-r border-[#1F6680]/10 overflow-hidden">

        {/* Header */}
        <div className="pt-8 px-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div style={{
              width: '36px', height: '36px', backgroundColor: '#1F6680',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 700 }}>Support admin</h1>
          </div>
          <p style={{ fontSize: '13px', opacity: 0.5 }}>
            {pendingCount} ticket{pendingCount > 1 ? 's' : ''} en attente
          </p>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
          {loading ? (
            <div className="flex items-center justify-center h-full opacity-40">
              <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1F6680" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex items-center justify-center h-full opacity-40">
              <p style={{ fontSize: '14px' }}>Aucun ticket</p>
            </div>
          ) : tickets.map(ticket => (
            <button
              key={ticket.id}
              onClick={() => { setSelectedId(ticket.id); setResponseText(''); }}
              style={{
                backgroundColor: selectedId === ticket.id ? '#1F6680' : 'white',
                border: 'none', borderRadius: '16px', padding: '14px 16px',
                textAlign: 'left', cursor: 'pointer', boxShadow: strongShadow,
                transition: 'all 0.15s ease',
              }}
              className="active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.5 }}
                  className={selectedId === ticket.id ? 'text-white' : 'text-[#1F6680]'}>
                  #{ticket.id.slice(0, 8).toUpperCase()}
                </span>
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                  backgroundColor: ticket.status === 'pending'
                    ? (selectedId === ticket.id ? 'rgba(255,193,193,0.3)' : '#FFF0F0')
                    : (selectedId === ticket.id ? 'rgba(193,255,209,0.3)' : '#F0FFF4'),
                  color: ticket.status === 'pending'
                    ? (selectedId === ticket.id ? '#FFAAAA' : '#C0392B')
                    : (selectedId === ticket.id ? '#A8FFBC' : '#27AE60'),
                }}>
                  {ticket.status === 'pending' ? 'EN ATTENTE' : 'RÉPONDU'}
                </span>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.6 }}
                className={selectedId === ticket.id ? 'text-white' : 'text-[#1F6680]'}>
                {formatDate(ticket.created_at)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* COLONNE DROITE — détail + réponse */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedTicket ? (
          <div className="flex items-center justify-center h-full opacity-30">
            <p style={{ fontSize: '15px' }}>Sélectionne un ticket</p>
          </div>
        ) : (
          <>
            {/* Détail ticket */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">

              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, opacity: 0.4 }}>
                    #{selectedTicket.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p style={{ fontSize: '13px', opacity: 0.4 }}>
                    {formatDate(selectedTicket.created_at)}
                  </p>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '999px',
                  backgroundColor: selectedTicket.status === 'pending' ? '#FFF0F0' : '#F0FFF4',
                  color: selectedTicket.status === 'pending' ? '#C0392B' : '#27AE60',
                }}>
                  {selectedTicket.status === 'pending' ? 'EN ATTENTE' : 'RÉPONDU'}
                </span>
              </div>

              {/* Lecteur audio */}
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.4, marginBottom: '8px' }}>
                  MESSAGE DU CLIENT
                </p>
                <div style={{
                  backgroundColor: 'white', borderRadius: '20px',
                  padding: '16px 20px', boxShadow: strongShadow,
                }}>
                  <audio controls src={selectedTicket.audio_url} className="w-full" />
                </div>
              </div>

              {/* Réponse existante */}
              {selectedTicket.status === 'answered' && selectedTicket.response && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#27AE60', opacity: 0.8, marginBottom: '8px' }}>
                    VOTRE RÉPONSE
                  </p>
                  <div style={{
                    backgroundColor: '#F0FFF4', borderRadius: '20px',
                    padding: '16px 20px', borderLeft: '3px solid #27AE60',
                    boxShadow: strongShadow,
                  }}>
                    <p style={{ fontSize: '15px', lineHeight: 1.6 }}>{selectedTicket.response}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Zone de réponse */}
            {selectedTicket.status === 'pending' && (
              <div style={{
                borderTop: '1px solid rgba(31,102,128,0.1)',
                padding: '20px 24px',
                backgroundColor: 'white',
              }}>
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', opacity: 0.4, marginBottom: '10px' }}>
                  ÉCRIRE UNE RÉPONSE
                </p>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Tapez votre réponse ici…"
                  rows={3}
                  style={{
                    width: '100%', borderRadius: '16px',
                    border: '2px solid rgba(31,102,128,0.15)',
                    padding: '12px 16px', fontSize: '15px', color: '#1F6680',
                    backgroundColor: '#FFF9EE', outline: 'none', resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={handleSendResponse}
                  disabled={sending || !responseText.trim()}
                  style={{
                    marginTop: '10px', width: '100%', height: '50px',
                    backgroundColor: successId === selectedTicket.id ? '#4CAF82' : '#1F6680',
                    border: 'none', borderRadius: '16px', color: 'white',
                    fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                    opacity: !responseText.trim() ? 0.4 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: strongShadow,
                  }}
                  className="active:scale-[0.98]"
                >
                  {successId === selectedTicket.id ? '✓ Réponse envoyée' : sending ? 'Envoi…' : 'Envoyer la réponse'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </main>
  );
}