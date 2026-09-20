import React, { useEffect, useState } from 'react';
import { Card } from './UI';
import { Icon } from './CustomIcons';
import { auth } from '../lib/firebase.ts';

type TopicRow = { topic: string; misses: number; students: number };

// Until the mistakes were synced this view couldn't exist: every miss lived
// in the student's own browser. This is the point of syncing them — the
// teacher sees which topic the classroom keeps failing, not a raw log.
export const ClassroomMistakes: React.FC<{ classroom: string }> = ({ classroom }) => {
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [considered, setConsidered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          if (!cancelled) setError('Tu sesión expiró. Vuelve a iniciar sesión.');
          return;
        }
        const token = await user.getIdToken();
        const query = classroom ? `?classroom=${encodeURIComponent(classroom)}` : '';
        const res = await fetch(`/api/teacher/mistakes${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        if (res.ok) {
          const body = await res.json();
          setTopics(body.topics || []);
          setConsidered(body.studentsConsidered || 0);
          setError(null);
        } else {
          const body = await res.json().catch(() => ({}));
          setError(body.error || 'No se pudieron cargar los errores del salón.');
        }
      } catch {
        if (!cancelled) setError('Error de conexión al cargar los errores.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [classroom]);

  const worst = topics[0]?.misses || 1;

  return (
    <Card className="p-6 md:p-8 !items-start !text-left w-full space-y-4">
      <div>
        <h3 className="text-xl font-black text-slate-800">En qué falla tu salón</h3>
        <p className="text-xs text-slate-500 font-bold mt-1">
          {classroom ? `Salón ${classroom}` : 'Todos los salones'} · {considered} alumno{considered === 1 ? '' : 's'}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 font-bold text-sm w-full">
          <Icon name="alert" size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="font-bold text-slate-500 text-sm">Cargando...</p>
      ) : topics.length === 0 && !error ? (
        <p className="text-slate-500 font-medium text-sm">
          Todavía no hay errores registrados. Aparecerán aquí a medida que tus alumnos resuelvan ejercicios.
        </p>
      ) : (
        <div className="w-full space-y-2.5">
          {topics.map((t) => (
            <div key={t.topic} className="w-full">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className="font-black text-slate-800 text-sm">{t.topic}</span>
                <span className="text-xs font-bold text-slate-500 shrink-0">
                  {t.misses} {t.misses === 1 ? 'error' : 'errores'} · {t.students} {t.students === 1 ? 'alumno' : 'alumnos'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all"
                  style={{ width: `${Math.max(4, (t.misses / worst) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
