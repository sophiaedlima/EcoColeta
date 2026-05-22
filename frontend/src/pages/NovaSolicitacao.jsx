import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { solicitacoesService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MATERIAIS = [
  { key: 'papelao',    label: 'Papelão',    icon: '📦' },
  { key: 'plastico',   label: 'Plástico',   icon: '🧴' },
  { key: 'metal',      label: 'Metal',      icon: '🔩' },
  { key: 'vidro',      label: 'Vidro',      icon: '🫙' },
  { key: 'eletronico', label: 'Eletrônico', icon: '📱' },
  { key: 'madeira',    label: 'Madeira',    icon: '🪵' },
];

const HORARIOS = ['08h–10h', '10h–12h', '14h–16h', '16h–18h'];

function getProximosDias(n = 7) {
  const sem = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const mes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { dia: d.getDate(), semana: sem[d.getDay()], mes: mes[d.getMonth()], iso: d.toISOString().split('T')[0] };
  });
}

const S = {
  label: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#888', display: 'block', marginBottom: 6 },
  input: { width: '100%', height: 42, borderRadius: 8, border: '1.5px solid #ccc', background: '#fff', padding: '0 14px', fontSize: 13, color: '#333', outline: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box' },
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const dias = getProximosDias(7);

export default function NovaSolicitacao() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [endereco, setEndereco]         = useState('');
  const [observacoes, setObservacoes]   = useState('');
  const [materiaisSel, setMateriaisSel] = useState([]);
  const [imagens, setImagens]           = useState([]);
  const [diaIdx, setDiaIdx]             = useState(0);
  const [horarioIdx, setHorarioIdx]     = useState(0);
  const [erro, setErro]                 = useState('');
  const [loading, setLoading]           = useState(false);

  function toggleMaterial(key) {
    setMateriaisSel(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files);
    const vagas = 5 - imagens.length;
    if (vagas <= 0) return;
    const selecionados = files.slice(0, vagas);
    const grandes = selecionados.filter(f => f.size > 5 * 1024 * 1024);
    if (grandes.length > 0) { setErro(`"${grandes[0].name}" excede 5 MB.`); return; }
    setErro('');
    const bases = await Promise.all(selecionados.map(fileToBase64));
    setImagens(prev => [...prev, ...bases]);
    e.target.value = '';
  }

  function removerImagem(idx) {
    setImagens(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!endereco.trim()) return;
    setErro('');
    setLoading(true);
    try {
      const { data } = await solicitacoesService.criar({
        email: usuario.email,
        endereco,
        materiais: JSON.stringify(materiaisSel),
        observacoes,
        imagens: JSON.stringify(imagens),
        dataPreferida: dias[diaIdx].iso,
        horarioPreferido: HORARIOS[horarioIdx],
      });
      navigate(`/acompanhamento/${data.id}`);
    } catch {
      setErro('Não foi possível criar a solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: '#f5f5f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/')} style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #ddd', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: '#444' }}>←</button>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 600, color: '#222' }}>Nova solicitação</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto', paddingBottom: 90 }}>

          {/* Fotos */}
          <div>
            <label style={S.label}>Fotos dos materiais</label>
            <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFiles} />
            {imagens.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                {imagens.map((src, i) => (
                  <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                    <img src={src} alt="" style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover', border: '1.5px solid #ddd' }} />
                    <button type="button" onClick={() => removerImagem(i)} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#e53e3e', color: '#fff', border: 'none', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>×</button>
                  </div>
                ))}
              </div>
            )}
            {imagens.length < 5 && (
              <div onClick={() => fileInputRef.current.click()} style={{ border: '2px dashed #b0d4bb', borderRadius: 12, padding: 20, textAlign: 'center', background: '#ecf7ef', cursor: 'pointer' }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>📷</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#3a5a42' }}>{imagens.length === 0 ? 'Adicionar fotos' : `Adicionar mais (${imagens.length}/5)`}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>Toque para selecionar · JPG/PNG · Máx 5 MB cada</div>
              </div>
            )}
          </div>

          {/* Materiais */}
          <div>
            <label style={S.label}>Tipos de material</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
              {MATERIAIS.map(m => {
                const sel = materiaisSel.includes(m.key);
                return (
                  <div key={m.key} onClick={() => toggleMaterial(m.key)} style={{ padding: '10px 6px', borderRadius: 8, border: `1.5px solid ${sel ? '#5cc97a' : '#ddd'}`, background: sel ? '#ecf7ef' : '#fff', textAlign: 'center', cursor: 'pointer', fontSize: 11, color: sel ? '#3a5a42' : '#666', fontWeight: sel ? 600 : 400, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: 20 }}>{m.icon}</span>
                    {m.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label style={S.label}>Endereço de coleta</label>
            <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} required placeholder="Rua das Flores, 142, Setor Sul" style={S.input} />
          </div>

          {/* Data preferida */}
          <div>
            <label style={S.label}>Data preferida para coleta</label>
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4 }}>
              {dias.map((d, i) => (
                <div key={d.iso} onClick={() => setDiaIdx(i)} style={{ minWidth: 58, padding: '10px 6px', borderRadius: 9, border: `1.5px solid ${diaIdx === i ? '#5cc97a' : '#ddd'}`, background: diaIdx === i ? '#ecf7ef' : '#fff', textAlign: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: '#aaa' }}>{d.semana}</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 600, color: diaIdx === i ? '#1a4a2a' : '#222' }}>{d.dia}</div>
                  <div style={{ fontSize: 10, color: diaIdx === i ? '#3a5a42' : '#888' }}>{d.mes}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Horário preferido */}
          <div>
            <label style={S.label}>Horário preferido</label>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {HORARIOS.map((h, i) => (
                <div key={h} onClick={() => setHorarioIdx(i)} style={{ padding: '8px 14px', borderRadius: 20, border: `1.5px solid ${horarioIdx === i ? '#5cc97a' : '#ddd'}`, background: horarioIdx === i ? '#ecf7ef' : '#fff', fontSize: 12, color: horarioIdx === i ? '#3a5a42' : '#666', fontWeight: horarioIdx === i ? 600 : 400, cursor: 'pointer' }}>
                  {h}
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label style={S.label}>Observações</label>
            <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Ex: 3 caixas de papelão e algumas garrafas." rows={3} style={{ ...S.input, height: 'auto', padding: '10px 14px', resize: 'none' }} />
          </div>

          {erro && <p style={{ color: '#e53e3e', fontSize: 13, margin: 0 }}>{erro}</p>}
        </div>

        {/* Submit */}
        <div style={{ padding: '12px 14px 28px', background: '#fff', borderTop: '1px solid #e8e8e8' }}>
          <button type="submit" disabled={loading || !endereco.trim()} style={{ width: '100%', height: 46, borderRadius: 10, background: (loading || !endereco.trim()) ? '#aaa' : '#3a5a42', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: (loading || !endereco.trim()) ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Enviando...' : 'Enviar solicitação'}
          </button>
        </div>
      </form>
    </div>
  );
}
