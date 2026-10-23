// Ilustraciones completas en estilo vector plano (flat design, CERO degradados).
// Cada SVG ocupa todo el lienzo de esquina a esquina para que al dividirlo en
// 4 (2x2), 9 (3x3) o 12 (4x3) partes, todas las casillas muestren una parte clara
// de la figura total por completar.

const toDataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;

// 1. Billete Antiguo (2x2 = 4 partes) — Colores planos sólidos
const cash = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
  <rect width='400' height='400' fill='#065f46'/>
  <!-- Franjas geométricas planas de fondo -->
  <rect x='0' y='0' width='200' height='200' fill='#047857'/>
  <rect x='200' y='200' width='200' height='200' fill='#047857'/>
  <!-- Marco del billete -->
  <rect x='18' y='18' width='364' height='364' rx='24' fill='#064e3b' stroke='#facc15' stroke-width='8'/>
  <rect x='34' y='34' width='332' height='332' rx='16' fill='none' stroke='#34d399' stroke-width='4' stroke-dasharray='12 8'/>
  <!-- Esquinas (una en cada cuadrante del 2x2) -->
  <circle cx='82' cy='82' r='36' fill='#10b981' stroke='#facc15' stroke-width='5'/>
  <text x='82' y='92' font-family='Arial, sans-serif' font-weight='900' font-size='28' fill='#fef08a' text-anchor='middle'>100</text>
  <circle cx='318' cy='82' r='36' fill='#10b981' stroke='#facc15' stroke-width='5'/>
  <text x='318' y='92' font-family='Arial, sans-serif' font-weight='900' font-size='28' fill='#fef08a' text-anchor='middle'>100</text>
  <circle cx='82' cy='318' r='36' fill='#10b981' stroke='#facc15' stroke-width='5'/>
  <text x='82' y='328' font-family='Arial, sans-serif' font-weight='900' font-size='28' fill='#fef08a' text-anchor='middle'>100</text>
  <circle cx='318' cy='318' r='36' fill='#10b981' stroke='#facc15' stroke-width='5'/>
  <text x='318' y='328' font-family='Arial, sans-serif' font-weight='900' font-size='28' fill='#fef08a' text-anchor='middle'>100</text>
  <!-- Medallón central que une las 4 partes -->
  <circle cx='200' cy='200' r='106' fill='#022c22' stroke='#facc15' stroke-width='8'/>
  <circle cx='200' cy='200' r='88' fill='#059669' stroke='#a7f3d0' stroke-width='4'/>
  <text x='200' y='238' font-family='Arial, sans-serif' font-weight='900' font-size='112' fill='#facc15' text-anchor='middle'>$</text>
  <!-- Cintillos superior e inferior -->
  <rect x='125' y='44' width='150' height='28' rx='14' fill='#facc15'/>
  <text x='200' y='63' font-family='Arial, sans-serif' font-weight='900' font-size='14' fill='#064e3b' text-anchor='middle' letter-spacing='2'>RESERVA REAL</text>
  <rect x='115' y='328' width='170' height='28' rx='14' fill='#facc15'/>
  <text x='200' y='347' font-family='Arial, sans-serif' font-weight='900' font-size='14' fill='#064e3b' text-anchor='middle' letter-spacing='2'>CIEN MONEDAS</text>
</svg>`;

// 2. Caja Fuerte (2x2 = 4 partes) — Colores planos sólidos
const safe = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
  <rect width='400' height='400' fill='#1e293b'/>
  <rect x='18' y='18' width='364' height='364' rx='36' fill='#334155' stroke='#94a3b8' stroke-width='8'/>
  <!-- Remaches dorados en las 4 esquinas -->
  <circle cx='58' cy='58' r='18' fill='#facc15' stroke='#0f172a' stroke-width='4'/>
  <circle cx='342' cy='58' r='18' fill='#facc15' stroke='#0f172a' stroke-width='4'/>
  <circle cx='58' cy='342' r='18' fill='#facc15' stroke='#0f172a' stroke-width='4'/>
  <circle cx='342' cy='342' r='18' fill='#facc15' stroke='#0f172a' stroke-width='4'/>
  <!-- Bisagras y cerrojos -->
  <rect x='26' y='126' width='42' height='28' rx='6' fill='#cbd5e1' stroke='#0f172a' stroke-width='4'/>
  <rect x='26' y='246' width='42' height='28' rx='6' fill='#cbd5e1' stroke='#0f172a' stroke-width='4'/>
  <rect x='334' y='155' width='36' height='90' rx='10' fill='#f59e0b' stroke='#0f172a' stroke-width='4'/>
  <!-- Puerta circular central -->
  <circle cx='200' cy='200' r='146' fill='#475569' stroke='#e2e8f0' stroke-width='8'/>
  <circle cx='200' cy='200' r='122' fill='#1e293b' stroke='#38bdf8' stroke-width='4' stroke-dasharray='14 8'/>
  <!-- Timón de 4 brazos hacia las 4 piezas -->
  <line x1='105' y1='105' x2='295' y2='295' stroke='#facc15' stroke-width='16' stroke-linecap='round'/>
  <line x1='295' y1='105' x2='105' y2='295' stroke='#facc15' stroke-width='16' stroke-linecap='round'/>
  <circle cx='105' cy='105' r='18' fill='#f59e0b' stroke='#0f172a' stroke-width='4'/>
  <circle cx='295' cy='105' r='18' fill='#f59e0b' stroke='#0f172a' stroke-width='4'/>
  <circle cx='105' cy='295' r='18' fill='#f59e0b' stroke='#0f172a' stroke-width='4'/>
  <circle cx='295' cy='295' r='18' fill='#f59e0b' stroke='#0f172a' stroke-width='4'/>
  <circle cx='200' cy='200' r='54' fill='#0f172a' stroke='#facc15' stroke-width='8'/>
  <circle cx='200' cy='200' r='22' fill='#38bdf8'/>
</svg>`;

// 3. Lingote de Oro (3x3 = 9 partes) — Colores planos sólidos
const goldBar = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 450 450'>
  <rect width='450' height='450' fill='#78350f'/>
  <!-- Rayos geométricos planos -->
  <polygon points='225,225 0,0 90,0' fill='#92400e'/>
  <polygon points='225,225 180,0 270,0' fill='#92400e'/>
  <polygon points='225,225 360,0 450,0' fill='#92400e'/>
  <polygon points='225,225 450,180 450,270' fill='#92400e'/>
  <polygon points='225,225 0,180 0,270' fill='#92400e'/>
  <polygon points='225,225 0,360 90,450' fill='#92400e'/>
  <polygon points='225,225 360,450 450,360' fill='#92400e'/>
  <rect x='16' y='16' width='418' height='418' rx='28' fill='none' stroke='#facc15' stroke-width='6'/>
  <!-- Fila superior (casillas 1, 2, 3) -->
  <circle cx='78' cy='78' r='38' fill='#facc15' stroke='#451a03' stroke-width='5'/>
  <text x='78' y='90' font-family='Arial, sans-serif' font-weight='900' font-size='34' fill='#451a03' text-anchor='middle'>$</text>
  <polygon points='145,115 165,45 200,80 225,32 250,80 285,45 305,115' fill='#facc15' stroke='#451a03' stroke-width='5' stroke-linejoin='round'/>
  <circle cx='372' cy='78' r='38' fill='#facc15' stroke='#451a03' stroke-width='5'/>
  <text x='372' y='90' font-family='Arial, sans-serif' font-weight='900' font-size='34' fill='#451a03' text-anchor='middle'>$</text>
  <!-- Filas 2 y 3: Pirámide de lingotes planos -->
  <polygon points='25,380 55,305 220,305 190,380' fill='#d97706' stroke='#451a03' stroke-width='5'/>
  <polygon points='55,305 80,265 205,265 220,305' fill='#facc15' stroke='#451a03' stroke-width='5'/>
  <polygon points='230,380 260,305 425,305 395,380' fill='#d97706' stroke='#451a03' stroke-width='5'/>
  <polygon points='260,305 285,265 410,265 425,305' fill='#facc15' stroke='#451a03' stroke-width='5'/>
  <polygon points='75,275 115,190 365,190 325,275' fill='#f59e0b' stroke='#451a03' stroke-width='6'/>
  <polygon points='115,190 150,140 335,140 365,190' fill='#fde047' stroke='#451a03' stroke-width='6'/>
  <text x='235' y='244' font-family='Arial, sans-serif' font-weight='900' font-size='34' fill='#451a03' text-anchor='middle' letter-spacing='2'>999.9 GOLD</text>
  <rect x='95' y='392' width='260' height='34' rx='17' fill='#facc15' stroke='#451a03' stroke-width='4'/>
  <text x='225' y='415' font-family='Arial, sans-serif' font-weight='900' font-size='16' fill='#451a03' text-anchor='middle' letter-spacing='3'>TESORO SUPREMO</text>
</svg>`;

// 4. Diamante Supremo (3x3 = 9 partes) — Colores planos sólidos
const diamond = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 450 450'>
  <rect width='450' height='450' fill='#0c4a6e'/>
  <!-- Bloques planos de fondo -->
  <circle cx='225' cy='225' r='195' fill='#075985'/>
  <rect x='16' y='16' width='418' height='418' rx='28' fill='none' stroke='#38bdf8' stroke-width='6'/>
  <!-- Estrellas planas en las 4 esquinas -->
  <polygon points='75,42 84,66 108,75 84,84 75,108 66,84 42,75 66,66' fill='#facc15'/>
  <polygon points='375,42 384,66 408,75 384,84 375,108 366,84 342,75 366,66' fill='#facc15'/>
  <polygon points='75,342 84,366 108,375 84,384 75,408 66,384 42,375 66,366' fill='#7dd3fc'/>
  <polygon points='375,342 384,366 408,375 384,384 375,408 366,384 342,375 366,366' fill='#7dd3fc'/>
  <!-- Diamante facetado con colores planos puros -->
  <polygon points='115,75 335,75 415,175 225,410 35,175' fill='#0284c7' stroke='#e0f2fe' stroke-width='6' stroke-linejoin='round'/>
  <polygon points='115,75 335,75 295,175 155,175' fill='#bae6fd' stroke='#e0f2fe' stroke-width='5'/>
  <polygon points='35,175 115,75 155,175' fill='#7dd3fc' stroke='#e0f2fe' stroke-width='5'/>
  <polygon points='415,175 335,75 295,175' fill='#38bdf8' stroke='#e0f2fe' stroke-width='5'/>
  <polygon points='155,175 295,175 225,410' fill='#38bdf8' stroke='#e0f2fe' stroke-width='5'/>
  <polygon points='35,175 155,175 225,410' fill='#0ea5e9' stroke='#e0f2fe' stroke-width='5'/>
  <polygon points='415,175 295,175 225,410' fill='#0369a1' stroke='#e0f2fe' stroke-width='5'/>
</svg>`;

// 5. Bolsa de Valores (4x3 = 12 partes) — Colores planos sólidos
const trendingUp = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 360'>
  <rect width='480' height='360' fill='#1e1b4b'/>
  <!-- Cuadrícula bursátil plana -->
  <g stroke='#312e81' stroke-width='3'>
    <line x1='0' y1='60' x2='480' y2='60'/>
    <line x1='0' y1='120' x2='480' y2='120'/>
    <line x1='0' y1='180' x2='480' y2='180'/>
    <line x1='0' y1='240' x2='480' y2='240'/>
    <line x1='0' y1='300' x2='480' y2='300'/>
    <line x1='120' y1='0' x2='120' y2='360'/>
    <line x1='240' y1='0' x2='240' y2='360'/>
    <line x1='360' y1='0' x2='360' y2='360'/>
  </g>
  <!-- Cintillo superior (fila 1: 4 columnas) -->
  <rect x='16' y='14' width='448' height='42' rx='12' fill='#0f172a' stroke='#6366f1' stroke-width='3'/>
  <text x='70' y='41' font-family='Arial, sans-serif' font-weight='900' font-size='20' fill='#34d399' text-anchor='middle'>▲ +42%</text>
  <text x='190' y='41' font-family='Arial, sans-serif' font-weight='900' font-size='20' fill='#facc15' text-anchor='middle'>WALL ST</text>
  <text x='310' y='41' font-family='Arial, sans-serif' font-weight='900' font-size='20' fill='#34d399' text-anchor='middle'>▲ +88%</text>
  <text x='415' y='41' font-family='Arial, sans-serif' font-weight='900' font-size='20' fill='#facc15' text-anchor='middle'>BULL ★</text>
  <!-- Barras alcistas planas en las 4 columnas (filas 2 y 3) -->
  <rect x='36' y='235' width='52' height='100' rx='8' fill='#10b981' stroke='#a7f3d0' stroke-width='4'/>
  <rect x='116' y='195' width='52' height='140' rx='8' fill='#10b981' stroke='#a7f3d0' stroke-width='4'/>
  <rect x='196' y='150' width='52' height='185' rx='8' fill='#10b981' stroke='#a7f3d0' stroke-width='4'/>
  <rect x='276' y='110' width='52' height='225' rx='8' fill='#10b981' stroke='#a7f3d0' stroke-width='4'/>
  <rect x='356' y='72' width='52' height='263' rx='8' fill='#facc15' stroke='#fef08a' stroke-width='4'/>
  <!-- Flecha alcista gigante que cruza las 4 columnas -->
  <polyline points='35,285 140,210 225,165 310,105 425,45' fill='none' stroke='#facc15' stroke-width='12' stroke-linecap='round' stroke-linejoin='round'/>
  <polygon points='445,35 395,38 422,80' fill='#facc15'/>
  <!-- Medallones planos -->
  <circle cx='62' cy='155' r='30' fill='#facc15' stroke='#0f172a' stroke-width='4'/>
  <text x='62' y='166' font-family='Arial, sans-serif' font-weight='900' font-size='28' fill='#0f172a' text-anchor='middle'>$</text>
  <circle cx='180' cy='115' r='26' fill='#facc15' stroke='#0f172a' stroke-width='4'/>
  <text x='180' y='124' font-family='Arial, sans-serif' font-weight='900' font-size='24' fill='#0f172a' text-anchor='middle'>$</text>
</svg>`;

export const albumArt: Record<string, string> = {
  cash: toDataUri(cash),
  safe: toDataUri(safe),
  gold_bar: toDataUri(goldBar),
  diamond: toDataUri(diamond),
  trending_up: toDataUri(trendingUp),
};
