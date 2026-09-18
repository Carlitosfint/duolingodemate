// One illustrated "poster" per album, sliced across its grid via CSS
// background-size/background-position (the standard sprite-sheet trick).
// Each viewBox's aspect ratio matches that album's cols:rows so slices
// line up without stretching. Collected pieces reveal the shared image
// instead of every cell repeating the same centered icon.

const toDataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;

const cash = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
  <defs>
    <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#065f46'/>
      <stop offset='100%' stop-color='#022c22'/>
    </linearGradient>
  </defs>
  <rect width='400' height='400' fill='url(#bg)'/>
  <rect x='24' y='110' width='352' height='180' rx='16' fill='#10b981' fill-opacity='0.16' stroke='#34d399' stroke-width='5'/>
  <rect x='44' y='130' width='312' height='140' rx='8' fill='none' stroke='#6ee7b7' stroke-opacity='0.6' stroke-width='2' stroke-dasharray='7 7'/>
  <circle cx='200' cy='200' r='58' fill='none' stroke='#a7f3d0' stroke-width='5'/>
  <text x='200' y='222' font-family='Arial, sans-serif' font-weight='900' font-size='64' fill='#a7f3d0' text-anchor='middle'>$</text>
  <text x='68' y='168' font-family='Arial, sans-serif' font-weight='900' font-size='28' fill='#6ee7b7'>100</text>
  <text x='332' y='168' font-family='Arial, sans-serif' font-weight='900' font-size='28' fill='#6ee7b7' text-anchor='end'>100</text>
  <text x='68' y='260' font-family='Arial, sans-serif' font-weight='900' font-size='28' fill='#6ee7b7'>100</text>
  <text x='332' y='260' font-family='Arial, sans-serif' font-weight='900' font-size='28' fill='#6ee7b7' text-anchor='end'>100</text>
</svg>`;

const safe = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
  <defs>
    <radialGradient id='bg' cx='50%' cy='45%' r='70%'>
      <stop offset='0%' stop-color='#334155'/>
      <stop offset='100%' stop-color='#0f172a'/>
    </radialGradient>
    <radialGradient id='door' cx='40%' cy='35%' r='65%'>
      <stop offset='0%' stop-color='#64748b'/>
      <stop offset='100%' stop-color='#1e293b'/>
    </radialGradient>
  </defs>
  <rect width='400' height='400' fill='url(#bg)'/>
  <circle cx='200' cy='200' r='150' fill='url(#door)' stroke='#94a3b8' stroke-width='6'/>
  <circle cx='200' cy='200' r='150' fill='none' stroke='#334155' stroke-width='2' stroke-dasharray='4 10'/>
  <circle cx='200' cy='200' r='62' fill='none' stroke='#cbd5e1' stroke-width='6'/>
  <circle cx='200' cy='200' r='10' fill='#e2e8f0'/>
  <line x1='200' y1='150' x2='200' y2='138' stroke='#e2e8f0' stroke-width='6'/>
  <line x1='200' y1='250' x2='200' y2='262' stroke='#e2e8f0' stroke-width='6'/>
  <line x1='150' y1='200' x2='138' y2='200' stroke='#e2e8f0' stroke-width='6'/>
  <line x1='250' y1='200' x2='262' y2='200' stroke='#e2e8f0' stroke-width='6'/>
  <circle cx='75' cy='75' r='11' fill='#94a3b8'/>
  <circle cx='325' cy='75' r='11' fill='#94a3b8'/>
  <circle cx='75' cy='325' r='11' fill='#94a3b8'/>
  <circle cx='325' cy='325' r='11' fill='#94a3b8'/>
  <rect x='352' y='176' width='30' height='48' rx='8' fill='#cbd5e1'/>
</svg>`;

const goldBar = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
  <defs>
    <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#78350f'/>
      <stop offset='100%' stop-color='#451a03'/>
    </linearGradient>
    <linearGradient id='bar' x1='0%' y1='0%' x2='0%' y2='100%'>
      <stop offset='0%' stop-color='#fef08a'/>
      <stop offset='45%' stop-color='#facc15'/>
      <stop offset='100%' stop-color='#a16207'/>
    </linearGradient>
  </defs>
  <rect width='400' height='400' fill='url(#bg)'/>
  <polygon points='60,320 100,270 340,270 300,320' fill='url(#bar)' stroke='#78350f' stroke-width='4'/>
  <polygon points='100,270 130,235 310,235 340,270' fill='#fde047' stroke='#78350f' stroke-width='4'/>
  <polygon points='80,215 115,180 325,180 290,215' fill='url(#bar)' stroke='#78350f' stroke-width='4'/>
  <polygon points='115,180 140,150 300,150 325,180' fill='#fef9c3' stroke='#78350f' stroke-width='4'/>
  <line x1='150' y1='300' x2='260' y2='300' stroke='#fef9c3' stroke-width='4' stroke-opacity='0.7'/>
  <line x1='165' y1='198' x2='260' y2='198' stroke='#fffbeb' stroke-width='4' stroke-opacity='0.8'/>
</svg>`;

const diamond = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>
  <defs>
    <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#0c4a6e'/>
      <stop offset='100%' stop-color='#082f49'/>
    </linearGradient>
    <linearGradient id='gem' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#e0f2fe'/>
      <stop offset='45%' stop-color='#7dd3fc'/>
      <stop offset='100%' stop-color='#0284c7'/>
    </linearGradient>
  </defs>
  <rect width='400' height='400' fill='url(#bg)'/>
  <polygon points='120,120 280,120 340,190 200,340 60,190' fill='url(#gem)' stroke='#e0f2fe' stroke-width='4'/>
  <polygon points='120,120 200,190 280,120' fill='#f0f9ff' fill-opacity='0.55'/>
  <polygon points='60,190 200,190 120,120' fill='#38bdf8' fill-opacity='0.5'/>
  <polygon points='340,190 200,190 280,120' fill='#0369a1' fill-opacity='0.5'/>
  <polygon points='60,190 200,190 200,340' fill='#0ea5e9' fill-opacity='0.45'/>
  <polygon points='340,190 200,190 200,340' fill='#0284c7' fill-opacity='0.55'/>
  <path d='M70,90 l8,20 l20,8 l-20,8 l-8,20 l-8,-20 l-20,-8 l20,-8 z' fill='#e0f2fe' fill-opacity='0.9'/>
  <path d='M330,80 l6,14 l14,6 l-14,6 l-6,14 l-6,-14 l-14,-6 l14,-6 z' fill='#e0f2fe' fill-opacity='0.8'/>
</svg>`;

const trendingUp = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>
  <defs>
    <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#7f1d1d'/>
      <stop offset='100%' stop-color='#450a0a'/>
    </linearGradient>
  </defs>
  <rect width='400' height='300' fill='url(#bg)'/>
  <g stroke='#fca5a5' stroke-opacity='0.25' stroke-width='2'>
    <line x1='0' y1='75' x2='400' y2='75'/>
    <line x1='0' y1='150' x2='400' y2='150'/>
    <line x1='0' y1='225' x2='400' y2='225'/>
  </g>
  <rect x='40' y='210' width='36' height='60' fill='#fca5a5'/>
  <rect x='110' y='170' width='36' height='100' fill='#fca5a5'/>
  <rect x='180' y='130' width='36' height='140' fill='#fca5a5'/>
  <rect x='250' y='90' width='36' height='180' fill='#fca5a5'/>
  <rect x='320' y='50' width='36' height='220' fill='#fca5a5'/>
  <polyline points='30,240 130,180 200,150 270,100 345,45' fill='none' stroke='#fef2f2' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/>
  <polygon points='345,45 320,52 340,70' fill='#fef2f2'/>
</svg>`;

export const albumArt: Record<string, string> = {
  cash: toDataUri(cash),
  safe: toDataUri(safe),
  gold_bar: toDataUri(goldBar),
  diamond: toDataUri(diamond),
  trending_up: toDataUri(trendingUp),
};
