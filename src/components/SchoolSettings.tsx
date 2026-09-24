import React, { useEffect, useState } from 'react';
import { Card, Button } from './UI';
import { authedFetch } from '../lib/api';


// Only rendered for admins — this changes the whole school's settings
// (the domain every student's login email is built from, and which
// sections exist), not something a secretary or teacher should touch.
export const SchoolSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [sectionsText, setSectionsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await authedFetch('/api/school');
        if (res.ok) {
          const school = await res.json();
          setSlug(school.slug || '');
          setEmailDomain(school.emailDomain || '');
          setSectionsText((school.sections || []).join(', '));
        }
      } catch {
        // Leave fields empty; the form still works for a first save.
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const sections = sectionsText.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await authedFetch('/api/school/settings', {
        method: 'POST',
        body: JSON.stringify({ emailDomain: emailDomain.trim(), sections }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo guardar.');
      } else {
        setEmailDomain(data.emailDomain || '');
        setSectionsText((data.sections || []).join(', '));
        setMessage('Configuración guardada.');
      }
    } catch {
      setError('Error de conexión. Revisa tu internet.');
    }
    setSaving(false);
  };

  if (loading) return null;

  const effectiveDomain = emailDomain || (slug ? `${slug}.alumno.com` : 'tu-dominio.com');

  return (
    <Card className="p-6 md:p-8 !items-start !text-left w-full space-y-4">
      <h3 className="text-xl font-black text-slate-800">Configuración del colegio</h3>
      <form onSubmit={handleSave} className="w-full space-y-4">
        <div>
          <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">
            Dominio de correo para alumnos
          </label>
          <input
            value={emailDomain}
            onChange={(e) => setEmailDomain(e.target.value)}
            placeholder="aloe.com"
            className="w-full sm:w-72 px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Los correos automáticos se verán así: <span className="font-mono">20265473@{effectiveDomain}</span>
            {!emailDomain && ' (todavía no eliges uno propio, se usa este por defecto)'}
          </p>
        </div>
        <div>
          <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">
            Secciones (separadas por coma)
          </label>
          <input
            value={sectionsText}
            onChange={(e) => setSectionsText(e.target.value)}
            placeholder="A, B, C"
            className="w-full sm:w-72 px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Déjalo vacío si tu colegio no divide a los alumnos en secciones.
          </p>
        </div>
        {error && <p className="text-sm font-bold text-red-600">{error}</p>}
        {message && <p className="text-sm font-bold text-emerald-600">{message}</p>}
        <Button type="submit" color="blue" disabled={saving} className="px-6 py-2.5">
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </form>
    </Card>
  );
};
