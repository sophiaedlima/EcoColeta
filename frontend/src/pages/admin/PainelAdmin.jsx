import { useEffect, useState } from 'react';
import { solicitacoesService, agendamentosService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BADGE = {
  PENDENTE:          { bg: '#fef3dc', color: '#7a5010', label: 'Pendente' },
  AGENDADO:          { bg: '#ddeeff', color: '#1a4ab0', label: 'Agendado' },
  COLETOR_A_CAMINHO: { bg: '#ffe8cc', color: '#7a3a00', label: 'Coletor a caminho' },
  EM_COLETA:         { bg: '#ffe8cc', color: '#7a3a00', label: 'Em coleta' },
  CONCLUIDO:         { bg: '#d8f0de', color: '#1a4a2a', label: 'Concluído' },
  CANCELADO:         { bg: '#ffe0e0', color: '#7a0000', label: 'Cancelado' },
};

function parseImagens(json) {
  try { return JSON.parse(json || '[]'); } catch { return []; }
}

function formatarData(iso) {
  if (!iso) return null;
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

function CardSolicitacao({ s, onAgendar }) {
  const b = BADGE[s.status] || { bg: '#eee', color: '#666', label: s.status };
  const num = s.id?.slice(-3).toUpperCase() || '—';
  const imagens = parseImagens(s.imagens);
  const nome = s.solicitanteEmail?.split('@')[0] || '—';

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
      {/* Thumbnail da primeira imagem */}
      {imagens.length > 0 && (
        <img src={imagens[0]} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
      )}

      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: '#e8f5ec', color: '#1a4a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
            #{num}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>{nome}</div>
            <div style={{ fontSize: 11, color: '#aaa' }}>{s.endereco}</div>
            {s.dataPreferida && (
              <div style={{ marginTop: 4 }}>
                <span style={{ fontSize: 10, color: '#fff', background: '#5a7a62', borderRadius: 4, padding: '2px 6px', fontWeight: 600 }}>
                  📅 {new Date(s.dataPreferida + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  {s.horarioPreferido ? ` · ${s.horarioPreferido}` : ''}
                </span>
              </div>
            )}
          </div>
          <span style={{ background: b.bg, color: b.color, padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{b.label}</span>
        </div>

        {onAgendar && (
          <button onClick={onAgendar} style={{ width: '100%', height: 38, borderRadius: 8, background: '#3a5a42', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Confirmar agendamento
          </button>
        )}
      </div>
    </div>
  );
}

export default function PainelAdmin() {
  const { logout } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [modal, setModal] = useState(null);
  const [coletor, setColetor] = useState('');
  const [agendando, setAgendando] = useState(false);
  const [erroModal, setErroModal] = useState('');

  function carregar() {
    solicitacoesService.listarTodas().then(({ data }) => setSolicitacoes(data)).catch(() => {});
  }

  useEffect(() => { carregar(); }, []);

  function abrirModal(s) {
    setModal(s);
    setColetor('');
    setErroModal('');
  }

  async function confirmar() {
    if (!coletor.trim()) return;
    setAgendando(true);
    setErroModal('');
    try {
      const horario = modal.horarioPreferido || '08h–10h';
      const hora = horario.split('–')[0].replace('h', ':00');
      const data = modal.dataPreferida || new Date().toISOString().split('T')[0];
      const dataHora = `${data}T${hora}:00`;
      await agendamentosService.agendar({ solicitacaoId: modal.id, dataHora, coletor });
      setModal(null); setColetor(''); setErroModal(''); carregar();
    } catch (e) {
      setErroModal(e?.response?.data?.message || 'Erro ao agendar. Tente novamente.');
    } finally { setAgendando(false); }
  }

  const pendentes = solicitacoes.filter(s => s.status === 'PENDENTE');
  const outras    = solicitacoes.filter(s => s.status !== 'PENDENTE');

  const modalImagens = modal ? parseImagens(modal.imagens) : [];
  const dataFormatada = modal ? formatarData(modal.dataPreferida) : null;

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <div style={{ background: '#1a2e1e', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 600, color: '#fff' }}>Painel Admin</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>EcoColeta Operações</div>
          </div>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.5)', padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>Sair</button>
        </div>
      </div>

      {/* Lista */}
      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', paddingBottom: 24 }}>
        {pendentes.length > 0 && <>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 2 }}>Solicitações pendentes</div>
          {pendentes.map(s => <CardSolicitacao key={s.id} s={s} onAgendar={() => abrirModal(s)} />)}
        </>}
        {outras.length > 0 && <>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#444', marginTop: 8, marginBottom: 2 }}>Outras solicitações</div>
          {outras.map(s => <CardSolicitacao key={s.id} s={s} />)}
        </>}
        {solicitacoes.length === 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '40px 0', fontSize: 13 }}>Nenhuma solicitação.</div>
        )}
      </div>

      {/* Modal bottom sheet */}
      {modal && <>
        <div onClick={() => { setModal(null); setErroModal(''); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }} />
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#f5f5f0', borderRadius: '20px 20px 0 0', zIndex: 51, display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}>

          {/* Handle */}
          <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
            <div style={{ width: 32, height: 4, borderRadius: 2, background: '#ccc', margin: '0 auto 12px' }} />
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 19, fontWeight: 600, color: '#1a1a1a' }}>Confirmar agendamento</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{modal.endereco}</div>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 14 }}>Solicitado por: {modal.solicitanteEmail}</div>
          </div>

          {/* Conteúdo scrollável */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px' }}>

            {/* Imagens */}
            {modalImagens.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
                  Fotos do usuário ({modalImagens.length})
                </div>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                  {modalImagens.map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: 100, height: 100, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1.5px solid #ddd' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Data e horário solicitados */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
                Preferência do usuário
              </div>
              <div style={{ background: '#fff', borderRadius: 10, border: '1.5px solid #d0e8d5', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>📅</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a4a2a' }}>
                    {dataFormatada || 'Data não informada'}
                  </div>
                  <div style={{ fontSize: 12, color: '#5a7a62', marginTop: 1 }}>
                    {modal.horarioPreferido || 'Horário não informado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Materiais, se houver */}
            {modal.materiais && (() => {
              try {
                const lista = JSON.parse(modal.materiais);
                if (lista.length === 0) return null;
                const nomes = { papelao: 'Papelão', plastico: 'Plástico', metal: 'Metal', vidro: 'Vidro', eletronico: 'Eletrônico', madeira: 'Madeira' };
                return (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Materiais</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {lista.map(k => (
                        <span key={k} style={{ background: '#ecf7ef', color: '#3a5a42', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                          {nomes[k] || k}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              } catch { return null; }
            })()}

            {/* Observações, se houver */}
            {modal.observacoes && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Observações</div>
                <div style={{ background: '#fff', borderRadius: 10, border: '1.5px solid #e0e0e0', padding: '10px 14px', fontSize: 13, color: '#444', lineHeight: 1.5 }}>
                  {modal.observacoes}
                </div>
              </div>
            )}

            {/* Coletor */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#888', marginBottom: 6 }}>Nome do coletor</div>
              <input
                value={coletor}
                onChange={e => setColetor(e.target.value)}
                placeholder="Ex: Carlos Silva"
                style={{ width: '100%', height: 42, borderRadius: 8, border: '1.5px solid #ccc', background: '#fff', padding: '0 14px', fontSize: 13, outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' }}
              />
            </div>

            {erroModal && (
              <div style={{ color: '#c0392b', fontSize: 12, background: '#ffe0e0', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                {erroModal}
              </div>
            )}
          </div>

          {/* Botão fixo no fundo */}
          <div style={{ padding: '12px 20px 32px', flexShrink: 0 }}>
            <button
              onClick={confirmar}
              disabled={agendando || !coletor.trim()}
              style={{ width: '100%', height: 46, borderRadius: 10, background: (!coletor.trim() || agendando) ? '#aaa' : '#3a5a42', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: (!coletor.trim() || agendando) ? 'not-allowed' : 'pointer' }}>
              {agendando ? 'Confirmando...' : 'Confirmar agendamento'}
            </button>
          </div>
        </div>
      </>}
    </div>
  );
}
