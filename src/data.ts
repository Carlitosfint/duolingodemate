import { Album, PetBuff, MarketEvent, ShopBanner, Trophy } from './types';

export const roulettePrizes = [
  { id: 1, text: "50 🪙", val: 50, type: "coins", color: "#f59e0b", prob: 30, icon: "coins" },
  { id: 2, text: "15 🎟️", val: 15, type: "tickets", color: "#3b82f6", prob: 25, icon: "ticket" },
  { id: 3, text: "100 🪙", val: 100, type: "coins", color: "#f59e0b", prob: 20, icon: "money_bag" },
  { id: 4, text: "30 🎟️", val: 30, type: "tickets", color: "#8b5cf6", prob: 15, icon: "coupon" },
  { id: 5, text: "250 🪙", val: 250, type: "coins", color: "#f59e0b", prob: 8, icon: "diamond" },
  { id: 6, text: "100 🎟️", val: 100, type: "tickets", color: "#ec4899", prob: 2, icon: "crown" }
];

export const themes = [
  { id: 'default', name: 'Clásico', desc: 'El diseño limpio original.', price: 0, bgClass: 'bg-slate-50' },
  { id: 'neon', name: 'Cyber Neón', desc: 'Colores oscuros y luces neón.', price: 5, bgClass: 'bg-slate-900 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black' },
  { id: 'galaxy', name: 'Wall Street', desc: 'El corazón de la bolsa de valores.', price: 10, bgClass: 'bg-slate-950 bg-[url("https://www.transparenttextures.com/patterns/stardust.png")]' },
  { id: 'volcano', name: 'Volcán', desc: 'Calor extremo.', price: 8, bgClass: 'bg-red-950 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-900 via-orange-950 to-black' },
  { id: 'forest', name: 'Banco Central', desc: 'Verde dinero.', price: 12, bgClass: 'bg-emerald-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900 via-teal-950 to-black' }
];

export const initialAlbums: Album[] = [
  { id: 'a1', name: "Billete Antiguo", reward: 15, pieces: 4, cols: 2, emoji: 'cash', color: "#10b981", bgClass: "bg-[#064e3b]", bgMask: "bg-[#064e3b]/90", borderColor: "border-[#047857]" },
  { id: 'a2', name: "Caja Fuerte", reward: 20, pieces: 4, cols: 2, emoji: 'safe', color: "#94a3b8", bgClass: "bg-[#1e293b]", bgMask: "bg-[#1e293b]/90", borderColor: "border-[#475569]" },
  { id: 'a3', name: "Lingote de Oro", reward: 40, pieces: 9, cols: 3, emoji: 'gold_bar', color: "#facc15", bgClass: "bg-[#713f12]", bgMask: "bg-[#713f12]/90", borderColor: "border-[#a16207]" },
  { id: 'a4', name: "Diamante Supremo", reward: 80, pieces: 9, cols: 3, emoji: 'diamond', color: "#38bdf8", bgClass: "bg-[#082f49]", bgMask: "bg-[#082f49]/90", borderColor: "border-[#0284c7]" },
  { id: 'a5', name: "Bolsa de Valores", reward: 150, pieces: 12, cols: 4, emoji: 'trending_up', color: "#ef4444", bgClass: "bg-[#4c0519]", bgMask: "bg-[#4c0519]/90", borderColor: "border-[#be123c]" }
];

export const PET_BUFFS: PetBuff[] = [
  { id: 'none', name: 'Sin Poder', emoji: 'sparkles', buffType: 'none', value: 0, desc: 'Ningún efecto.', price: 0, bg: 'bg-slate-100', border: 'border-slate-300' },
  { id: 'dog', name: 'Toro de Wall Street', emoji: 'bull', buffType: 'coins', value: 15, desc: '+15 Monedas por acierto.', price: 500, bg: 'bg-emerald-100', border: 'border-emerald-400' },
  { id: 'cat', name: 'Gato Asesor', emoji: 'cat', buffType: 'tickets', value: 5, desc: '+5 Tickets por acierto.', price: 500, bg: 'bg-purple-100', border: 'border-purple-400' },
  { id: 'rabbit', name: 'Búho Auditor', emoji: 'owl', buffType: 'skip_discount', value: 25, desc: 'Saltos cuestan -25 Monedas.', price: 800, bg: 'bg-amber-100', border: 'border-amber-400' },
  { id: 'fox', name: 'Zorro Bancario', emoji: 'fox', buffType: 'combo_extra', value: 5, desc: '+5 Tickets extra en Racha.', price: 1000, bg: 'bg-orange-100', border: 'border-orange-400' }
];

export const MARKET_EVENTS: MarketEvent[] = [
  { id: 'bull', name: 'Mercado Alcista', desc: 'Acciones al alza. Ganas +25% de monedas por 3 turnos.', icon: 'trending_up', duration: 3, effect: 'boost_coins_25' },
  { id: 'bear', name: 'Ajuste Financiero', desc: 'Monedas valen -25%, pero ganas +25% de Tickets por 2 turnos.', icon: 'trending_down', duration: 2, effect: 'adjust_25' },
  { id: 'scholarship', name: 'Beca de Estudios', desc: 'El estado apoya tu educación. ¡Los Saltos cuestan la mitad por 2 turnos!', icon: 'bank', duration: 2, effect: 'cheap_skips' },
  { id: 'dividend', name: 'Micro Dividendos', desc: 'Tu portafolio generó ganancias. ¡Recibes 25 🪙 extra de inmediato!', icon: 'flying_money', duration: 0, effect: 'instant_25_coins' }
];

export const SHOP_BANNERS: ShopBanner[] = [
  { id: 'b1', title: '¡Seguros Financieros!', desc: 'Compra escudos o multiplicadores para asegurar tu racha y doblar dividendos.', bg: 'bg-gradient-to-r from-fuchsia-600 to-purple-600', icon: 'zap' },
  { id: 'b2', title: '¡Poderes Especiales!', desc: 'Dirígete a la Tienda y equipa un poder para ganar comisiones automáticas.', bg: 'bg-gradient-to-r from-emerald-50 to-teal-600', icon: 'zap' },
  { id: 'b3', title: '¡Cajas Fuertes!', desc: 'Ahorra para cofres Supremos o Titán y consigue piezas financieras raras.', bg: 'bg-gradient-to-r from-yellow-500 to-amber-600', icon: '💎' }
];

export const TROPHIES: Trophy[] = [
  { id: 'first_blood', name: 'Primer Desafío', desc: 'Resuelve tu primer problema matemático.', icon: '🌱', req: (s) => s.solved >= 1 },
  { id: 'streak_5', name: 'Mente Activa', desc: 'Logra 5 aciertos seguidos.', icon: '🔥', req: (s) => s.maxStreak >= 5 },
  { id: 'streak_10', name: 'Genio Lógico', desc: 'Logra 10 aciertos seguidos.', icon: '☄️', req: (s) => s.maxStreak >= 10 },
  { id: 'veteran', name: 'Auditor Experto', desc: 'Resuelve 20 desafíos en total.', icon: '📊', req: (s) => s.solved >= 20 },
  { id: 'rich', name: 'Gran Inversor', desc: 'Gasta 500 monedas en la tienda.', icon: '💰', req: (s, c, sc, sp) => sp >= 500 },
  { id: 'supernova_3', name: 'Crack Matemático', desc: 'Activa la Racha Supernova 3 veces.', icon: '⚡', req: (s) => s.boostsTriggered >= 3 },
  { id: 'legend', name: 'Cazador de Enigmas', desc: 'Resuelve un desafío Legendario.', icon: '💎', req: (s) => s.legendaryWins >= 1 }
];



export const THEME_STYLES: Record<string, {
  bgClass: string;
  cardBg: string;
  headerBg: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  bentoBg: string;
  buttonClass: string;
  accentText: string;
  inputClass: string;
  bezelClass: string;
  emoji: string;
}> = {
  default: {
    bgClass: 'bg-slate-50',
    cardBg: 'bg-white/95 backdrop-blur-xl border-slate-200 text-slate-800 shadow-sm',
    headerBg: 'bg-white/90 backdrop-blur-xl border-slate-200 text-slate-800 shadow-sm',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-500',
    borderColor: 'border-slate-200',
    bentoBg: 'bg-white border-slate-200',
    buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white',
    accentText: 'text-blue-600',
    inputClass: 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500',
    bezelClass: 'bg-slate-50 border-slate-200',
    emoji: 'bank'
  },
  neon: {
    bgClass: 'bg-slate-950 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-black',
    cardBg: 'bg-slate-900/90 backdrop-blur-xl border-indigo-500/40 text-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    headerBg: 'bg-slate-900/90 backdrop-blur-xl border-indigo-500/50 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]',
    textPrimary: 'text-indigo-100',
    textSecondary: 'text-indigo-300',
    borderColor: 'border-indigo-500/40',
    bentoBg: 'bg-slate-900/80 border-indigo-500/30',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)] border-indigo-400',
    accentText: 'text-pink-400 font-extrabold',
    inputClass: 'bg-slate-800/80 border-indigo-500/50 text-indigo-50 focus:border-indigo-400 focus:shadow-[0_0_10px_rgba(99,102,241,0.3)]',
    bezelClass: 'bg-slate-950/80 border-indigo-500/30',
    emoji: 'zap'
  },
  galaxy: {
    bgClass: 'bg-slate-950 bg-[url("https://www.transparenttextures.com/patterns/stardust.png")]',
    cardBg: 'bg-slate-900/95 backdrop-blur-xl border-amber-500/40 text-slate-100 shadow-[0_0_20px_rgba(245,158,11,0.1)]',
    headerBg: 'bg-slate-900/90 backdrop-blur-xl border-amber-500/50 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-300',
    borderColor: 'border-amber-500/40',
    bentoBg: 'bg-slate-900/80 border-amber-500/30',
    buttonClass: 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)] border-amber-500',
    accentText: 'text-amber-400 font-extrabold',
    inputClass: 'bg-slate-900/80 border-amber-500/40 text-white focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    bezelClass: 'bg-slate-950/80 border-amber-500/30',
    emoji: 'trending_up'
  },
  volcano: {
    bgClass: 'bg-red-950 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-950 via-orange-950 to-black',
    cardBg: 'bg-orange-950/90 backdrop-blur-xl border-orange-700/50 text-orange-100 shadow-[0_0_20px_rgba(234,88,12,0.15)]',
    headerBg: 'bg-orange-950/90 backdrop-blur-xl border-orange-700/60 text-orange-200 shadow-[0_0_15px_rgba(234,88,12,0.15)]',
    textPrimary: 'text-orange-100',
    textSecondary: 'text-orange-200',
    borderColor: 'border-orange-700/50',
    bentoBg: 'bg-orange-950/70 border-orange-700/40',
    buttonClass: 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_10px_rgba(234,88,12,0.4)] border-orange-500',
    accentText: 'text-red-400 font-extrabold',
    inputClass: 'bg-red-950/80 border-orange-700/50 text-white focus:border-orange-500 focus:shadow-[0_0_10px_rgba(234,88,12,0.2)]',
    bezelClass: 'bg-red-950/70 border-orange-700/30',
    emoji: '🌋'
  },
  forest: {
    bgClass: 'bg-emerald-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950 via-teal-950 to-black',
    cardBg: 'bg-emerald-950/90 backdrop-blur-xl border-emerald-600/50 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    headerBg: 'bg-emerald-950/90 backdrop-blur-xl border-emerald-600/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    textPrimary: 'text-emerald-100',
    textSecondary: 'text-emerald-300',
    borderColor: 'border-emerald-600/50',
    bentoBg: 'bg-emerald-950/70 border-emerald-600/40',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)] border-emerald-500',
    accentText: 'text-teal-400 font-extrabold',
    inputClass: 'bg-teal-950/80 border-emerald-600/50 text-white focus:border-emerald-500 focus:shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    bezelClass: 'bg-teal-950/70 border-emerald-600/30',
    emoji: 'bank'
  }
};
