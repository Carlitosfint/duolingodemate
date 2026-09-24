// Daily challenges and coupon codes: rewards a student claims, which the
// server grants at most once — each challenge once a day, each code once.
//
// Both used to be settled in the browser alone. Claimed challenges lived in
// memory, so reloading the page made them claimable again; coupon codes
// were never recorded, so one code could be cashed forever.

export type ChallengeMetric = 'coins' | 'tickets' | 'level' | 'solved' | 'streak';

export interface DailyChallenge {
  id: number;
  icon: string;
  title: string;
  target: number;
  metric: ChallengeMetric;
  reward: { type: 'coins' | 'tickets'; amount: number };
  color: string;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 1, icon: '⚡', title: 'Gana 50 Monedas', target: 50, metric: 'coins', reward: { type: 'tickets', amount: 5 }, color: 'bg-yellow-400' },
  { id: 2, icon: '🎯', title: 'Alcanza Nivel 10', target: 10, metric: 'level', reward: { type: 'coins', amount: 200 }, color: 'bg-green-400' },
  { id: 3, icon: '💎', title: 'Acumula 10 Tickets', target: 10, metric: 'tickets', reward: { type: 'coins', amount: 500 }, color: 'bg-purple-400' },
  { id: 4, icon: '🏆', title: 'Completa 20 Retos', target: 20, metric: 'solved', reward: { type: 'tickets', amount: 10 }, color: 'bg-rose-400' },
  { id: 5, icon: '🔥', title: 'Racha de 5', target: 5, metric: 'streak', reward: { type: 'coins', amount: 300 }, color: 'bg-amber-400' },
];

export interface ChallengeInputs {
  coins?: number | null;
  tickets?: number | null;
  progress?: number | null;
  courseProgress?: Record<string, number> | null;
  stats?: { solved?: number; maxStreak?: number } | null;
}

// Where the student stands on a challenge. "Level" is the highest of their
// courses: it used to read only the 3rd-year course, which a student in 4th
// or 5th never plays — so for them the challenge could never be completed.
export function challengeValue(metric: ChallengeMetric, s: ChallengeInputs): number {
  switch (metric) {
    case 'coins': return s.coins ?? 0;
    case 'tickets': return s.tickets ?? 0;
    case 'level': return Math.max(s.progress ?? 0, ...Object.values(s.courseProgress ?? {}).map((v) => Number(v) || 0));
    case 'solved': return s.stats?.solved ?? 0;
    case 'streak': return s.stats?.maxStreak ?? 0;
  }
}

// "Today" at the school, not wherever the server happens to run.
export function schoolToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export interface Claims {
  codes?: string[];
  daily?: { date: string; ids: number[] };
}

export type ClaimResult =
  | { ok: true; claims: Claims; reward: { coins: number; tickets: number } }
  | { ok: false; status: number; error: string };

// Decides a claim from what's stored. Pure: the caller writes the result,
// only if the stored claims haven't changed in between.
export function applyClaim(
  stored: unknown,
  request: any,
  ctx: { today: string; inputs: ChallengeInputs; codes: Record<string, number> },
): ClaimResult {
  const current = (stored && typeof stored === 'object' ? stored : {}) as Claims;
  const codes = Array.isArray(current.codes) ? current.codes.filter((c) => typeof c === 'string') : [];
  const daily = current.daily && current.daily.date === ctx.today && Array.isArray(current.daily.ids)
    ? current.daily
    : { date: ctx.today, ids: [] as number[] };

  if (request?.kind === 'daily') {
    const challenge = DAILY_CHALLENGES.find((c) => c.id === request.id);
    if (!challenge) return { ok: false, status: 400, error: 'Ese desafío no existe.' };
    if (daily.ids.includes(challenge.id)) return { ok: false, status: 409, error: 'Ya reclamaste este desafío hoy. Vuelve mañana.' };
    if (challengeValue(challenge.metric, ctx.inputs) < challenge.target) {
      return { ok: false, status: 400, error: 'Todavía no completas este desafío.' };
    }
    return {
      ok: true,
      claims: { ...current, codes, daily: { date: ctx.today, ids: [...daily.ids, challenge.id] } },
      reward: challenge.reward.type === 'coins'
        ? { coins: challenge.reward.amount, tickets: 0 }
        : { coins: 0, tickets: challenge.reward.amount },
    };
  }

  if (request?.kind === 'code') {
    const code = typeof request.code === 'string' ? request.code.trim() : '';
    const value = ctx.codes[code];
    if (!code || value === undefined) return { ok: false, status: 400, error: 'Ese código no es válido.' };
    if (codes.includes(code)) return { ok: false, status: 409, error: 'Ya canjeaste este código.' };
    return {
      ok: true,
      claims: { ...current, codes: [...codes, code], daily },
      reward: { coins: value * 10, tickets: 0 },
    };
  }

  return { ok: false, status: 400, error: 'Solicitud no válida.' };
}
