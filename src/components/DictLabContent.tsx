import React from 'react';
import { RazonamientoContent } from './codice/RazonamientoContent';
import { Razonamiento5toContent } from './codice/Razonamiento5toContent';
import { TrigonometriaContent } from './codice/TrigonometriaContent';
import { Geometria5toContent } from './codice/Geometria5toContent';

interface Props {
  activeCourse: string;
  activeTab: string;
}

const IV_BIMESTRE_DATA: Record<string, { title: string; subtitle: string; badge: string; formulas: { name: string; expr: string; note: string }[]; example: { q: string; sol: string } }> = {
  // RM BÁSICO - IV BIMESTRE
  sucesiones: {
    title: 'Sucesiones y Analogías',
    subtitle: 'Ley de formación de primer y segundo orden',
    badge: 'IV Bimestre • RM Básico',
    formulas: [
      { name: 'Sucesión Aritmética Lineal', expr: 'tₙ = t₁ + (n - 1) · r', note: 'Donde r es la razón constante entre términos consecutivos.' },
      { name: 'Sucesión Cuadrática (2do Orden)', expr: 'tₙ = A·n² + B·n + C', note: 'Se aplica cuando la razón constante aparece en el segundo nivel de diferencias.' }
    ],
    example: {
      q: 'Halla el término que sigue en: 5; 8; 13; 20; 29; x',
      sol: 'Diferencias de 1er nivel: +3, +5, +7, +9 (impares consecutivos). El siguiente incremento es +11, por lo tanto x = 29 + 11 = 40.'
    }
  },
  series: {
    title: 'Series y Sumatorias Notables',
    subtitle: 'Fórmulas cerradas para sumas finitas',
    badge: 'IV Bimestre • RM Básico',
    formulas: [
      { name: 'Suma de los primeros n naturales (Gauss)', expr: 'S = n(n + 1) / 2', note: '1 + 2 + 3 + ... + n' },
      { name: 'Suma de los primeros n pares', expr: 'S = n(n + 1)', note: '2 + 4 + 6 + ... + 2n' },
      { name: 'Suma de los primeros n impares', expr: 'S = n²', note: '1 + 3 + 5 + ... + (2n - 1)' }
    ],
    example: {
      q: 'Calcula S = 1 + 2 + 3 + ... + 20',
      sol: 'Aplicando Gauss con n = 20: S = 20 × 21 / 2 = 210.'
    }
  },
  operadores: {
    title: 'Operadores Matemáticos',
    subtitle: 'Reglas de definición arbitraria y tablas de doble entrada',
    badge: 'IV Bimestre • RM Básico',
    formulas: [
      { name: 'Estructura de un Operador', expr: 'a ⋆ b = Regla(a, b)', note: 'Identifica el primer componente (a) y el segundo componente (b) antes de reemplazar.' },
      { name: 'Operador Condicional', expr: 'a # b = { f(a,b) si a > b ; g(a,b) si a ≤ b }', note: 'Evalúa primero la condición de orden entre los números.' }
    ],
    example: {
      q: 'Si a # b = 3a + 2b, calcula 4 # 5',
      sol: 'Reemplazamos a = 4 y b = 5: 4 # 5 = 3(4) + 2(5) = 12 + 10 = 22.'
    }
  },
  fracciones_rm: {
    title: 'Fracciones y Porcentajes',
    subtitle: 'Relación parte-todo y descuentos/aumentos',
    badge: 'IV Bimestre • RM Básico',
    formulas: [
      { name: 'Relación Parte - Todo', expr: 'Fracción = (Es / Son) ÷ (De / Del)', note: 'Multiplica por 100% para convertir cualquier fracción a porcentaje.' },
      { name: 'Tanto por Ciento', expr: 'N% de M = (N / 100) × M', note: 'El símbolo % equivale a dividir entre 100.' }
    ],
    example: {
      q: 'Calcula el 25% de S/ 400',
      sol: '(25 / 100) × 400 = 25 × 4 = S/ 100.'
    }
  },
  certezas: {
    title: 'Certezas y Principios de Conteo',
    subtitle: 'Estrategia del peor de los casos',
    badge: 'IV Bimestre • RM Básico',
    formulas: [
      { name: 'Regla de Certezas', expr: 'Mín. extracciones = (Casos NO deseados) + (Lo que pide)', note: 'Siempre asumimos que el azar juega en contra nuestra primero.' },
      { name: 'Principio de Multiplicación', expr: 'Total = m × n', note: 'Para eventos que ocurren uno a continuación del otro.' }
    ],
    example: {
      q: 'En una caja hay 6 bolas rojas y 4 azules. ¿Cuántas sacar como mínimo para asegurar 1 azul?',
      sol: 'Peor caso: salen primero las 6 rojas. Con 1 extracción más, sale azul con certeza: 6 + 1 = 7.'
    }
  },

  // RM 5TO - IV BIMESTRE
  analisis_combinatorio: {
    title: 'Análisis Combinatorio',
    subtitle: 'Permutaciones lineales, circulares y combinaciones',
    badge: 'IV Bimestre • RM 5to',
    formulas: [
      { name: 'Permutación Lineal y Circular', expr: 'P(n) = n!   |   PC(n) = (n - 1)!', note: 'En permutación SÍ importa el orden en que se ubican los elementos.' },
      { name: 'Combinación (Sin orden)', expr: 'C(n, k) = n! / [ k! · (n - k)! ]', note: 'Se usa para formar grupos, comités o delegaciones donde no hay jerarquía.' }
    ],
    example: {
      q: '¿De cuántas formas se elige una comisión de 2 alumnos entre 6 candidatos?',
      sol: 'C(6, 2) = (6 × 5) / (2 × 1) = 15 maneras.'
    }
  },
  probabilidades: {
    title: 'Cálculo de Probabilidades',
    subtitle: 'Definición clásica de Laplace y sucesos independientes',
    badge: 'IV Bimestre • RM 5to',
    formulas: [
      { name: 'Regla de Laplace', expr: 'P(A) = Casos Favorables (A) / Casos Totales (Ω)', note: 'Toda probabilidad cumple 0 ≤ P(A) ≤ 1.' },
      { name: 'Propiedad del Complemento', expr: 'P(A\') = 1 - P(A)', note: 'Ideal cuando piden la probabilidad de obtener "al menos uno".' }
    ],
    example: {
      q: 'Al lanzar 2 dados, ¿cuántos casos favorables suman 7?',
      sol: 'Los pares son (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6 casos favorables de 36.'
    }
  },
  sucesiones_series_5to: {
    title: 'Sucesiones y Series Notables',
    subtitle: 'Suma de cuadrados, cubos y serie geométrica infinita',
    badge: 'IV Bimestre • RM 5to',
    formulas: [
      { name: 'Suma de los primeros n cuadrados', expr: 'S = n(n + 1)(2n + 1) / 6', note: '1² + 2² + 3² + ... + n²' },
      { name: 'Suma Límite Geométrica (|q| < 1)', expr: 'S_∞ = t₁ / (1 - q)', note: 'Para series infinitas decrecientes con razón geométrica q.' }
    ],
    example: {
      q: 'Calcula 1² + 2² + 3² + ... + 6²',
      sol: 'S = 6(7)(13) / 6 = 91.'
    }
  },
  logaritmos_rm: {
    title: 'Operadores y Logaritmos',
    subtitle: 'Propiedades fundamentales de logaritmos en RM',
    badge: 'IV Bimestre • RM 5to',
    formulas: [
      { name: 'Definición e Identidad del Producto', expr: 'log_b(A · B) = log_b(A) + log_b(B)', note: 'log_b(bⁿ) = n, con base b > 0 y b ≠ 1.' },
      { name: 'Regla del Sombrero y Cambio de Base', expr: 'log_b(Aⁿ) = n · log_b(A)', note: 'El exponente baja multiplicando al logaritmo.' }
    ],
    example: {
      q: 'Calcula E = log₂(8) + log₂(4)',
      sol: 'Como 8 = 2³ y 4 = 2², tenemos E = 3 + 2 = 5.'
    }
  },
  maximos_minimos: {
    title: 'Máximos y Mínimos',
    subtitle: 'Optimización mediante completación de cuadrados y MA ≥ MG',
    badge: 'IV Bimestre • RM 5to',
    formulas: [
      { name: 'Forma Canónica Cuadrática', expr: 'f(x) = a(x - h)² + k', note: 'Si a > 0, el valor mínimo es k (cuando x = h). Si a < 0, el valor máximo es k.' },
      { name: 'Desigualdad de Medias (a, b > 0)', expr: '(a + b) / 2 ≥ √(a · b)', note: 'La igualdad ocurre exactamente cuando a = b.' }
    ],
    example: {
      q: 'Halla el mínimo valor de P(x) = (x - 5)² + 12',
      sol: 'Como (x - 5)² ≥ 0 para todo x real, el mínimo valor es 0 + 12 = 12.'
    }
  },
  suficiencia_datos: {
    title: 'Suficiencia de Datos',
    subtitle: 'Evaluación lógica de información necesaria y suficiente',
    badge: 'IV Bimestre • RM 5to',
    formulas: [
      { name: 'Clave 1 / Clave 2', expr: '1: Solo I es suficiente   |   2: Solo II es suficiente', note: 'Evalúa siempre cada dato por separado olvidando temporalmente el otro.' },
      { name: 'Clave 3 / Clave 4 / Clave 5', expr: '3: Ambas juntas | 4: Cada una sola | 5: Faltan datos', note: 'Solo combinas I y II si ninguna pudo resolver el problema por sí sola.' }
    ],
    example: {
      q: 'Hallar x. Dato I: x + y = 20. Dato II: x - y = 6.',
      sol: 'Por separado tienen 2 variables; juntas forman un sistema 2×2 único → Clave 3 (Ambas juntas).'
    }
  },

  // TRIGONOMETRÍA - IV BIMESTRE
  reduccion_primer_cuadrante: {
    title: 'Reducción al Primer Cuadrante',
    subtitle: 'Ángulos de la forma (180° ± α), (360° - α) y (90° ± α)',
    badge: 'IV Bimestre • Trigonometría',
    formulas: [
      { name: 'Usando 180° o 360° (Misma R.T.)', expr: 'R.T.(180° ± α) = (±) R.T.(α)', note: 'El signo depende del cuadrante al que pertenece el ángulo original.' },
      { name: 'Usando 90° o 270° (Co-Razón)', expr: 'R.T.(90° + α) = (±) Co-R.T.(α)', note: 'Cambia sen ↔ cos, tg ↔ ctg, sec ↔ csc.' }
    ],
    example: {
      q: 'Calcula 180 · sen(150°)',
      sol: '150° ∈ II C (seno positivo): sen(150°) = sen(180° - 30°) = sen(30°) = 1/2 → 180 × 1/2 = 90.'
    }
  },
  circunferencia_trigonometrica: {
    title: 'Circunferencia Trigonométrica (C.T.)',
    subtitle: 'Variación analítica del seno y coseno (Radio = 1)',
    badge: 'IV Bimestre • Trigonometría',
    formulas: [
      { name: 'Extremos del Seno y Coseno en ℝ', expr: '-1 ≤ sen(θ) ≤ 1   |   -1 ≤ cos(θ) ≤ 1', note: 'La ordenada del extremo del arco es sen(θ) y la abscisa es cos(θ).' },
      { name: 'Variación al Cuadrado', expr: '0 ≤ sen²(θ) ≤ 1   |   0 ≤ cos²(θ) ≤ 1', note: 'Todo cuadrado en los reales tiene como mínimo valor 0.' }
    ],
    example: {
      q: 'Halla el máximo valor de M = 5·sen(θ) + 11',
      sol: 'El máximo de sen(θ) es 1 → M_máx = 5(1) + 11 = 16.'
    }
  },
  identidades_trigonometricas: {
    title: 'Identidades Trigonométricas',
    subtitle: 'Pitagóricas, recíprocas, por cociente y auxiliares',
    badge: 'IV Bimestre • Trigonometría',
    formulas: [
      { name: 'Identidades Pitagóricas', expr: 'sen²x + cos²x = 1   |   1 + tg²x = sec²x', note: 'También se cumple: 1 + ctg²x = csc²x.' },
      { name: 'Identidades Auxiliares Clásicas', expr: 'sen⁴x + cos⁴x = 1 - 2·sen²x·cos²x', note: 'Y para grado 6: sen⁶x + cos⁶x = 1 - 3·sen²x·cos²x.' }
    ],
    example: {
      q: 'Simplifica E = 9·sen²x + 9·cos²x + 4',
      sol: 'Factorizando 9: E = 9(sen²x + cos²x) + 4 = 9(1) + 4 = 13.'
    }
  },
  angulos_compuestos: {
    title: 'Ángulos Compuestos',
    subtitle: 'Seno, coseno y tangente de la suma y diferencia de dos arcos',
    badge: 'IV Bimestre • Trigonometría',
    formulas: [
      { name: 'Seno y Coseno Compuesto', expr: 'sen(α ± β) = senα·cosβ ± cosα·senβ', note: 'cos(α ± β) = cosα·cosβ ∓ senα·senβ (invierte el signo central).' },
      { name: 'Tangente de la Suma', expr: 'tg(α + β) = (tgα + tgβ) / (1 - tgα·tgβ)', note: 'Muy útil cuando α + β suma un ángulo notable como 45°.' }
    ],
    example: {
      q: 'Si α = 20° y β = 25°, halla (tgα + tgβ) / (1 - tgα·tgβ)',
      sol: 'Equivale a tg(20° + 25°) = tg(45°) = 1.'
    }
  },
  angulo_doble: {
    title: 'Ángulo Doble y Mitad',
    subtitle: 'Fórmulas del arco doble y degradación de exponentes',
    badge: 'IV Bimestre • Trigonometría',
    formulas: [
      { name: 'Seno y Coseno del Ángulo Doble', expr: 'sen(2x) = 2·senx·cosx   |   cos(2x) = cos²x - sen²x', note: 'También: cos(2x) = 2·cos²x - 1 = 1 - 2·sen²x.' },
      { name: 'Fórmulas de Degradación', expr: '2·sen²x = 1 - cos(2x)   |   2·cos²x = 1 + cos(2x)', note: 'Permiten reducir potencias cuadráticas a lineales.' }
    ],
    example: {
      q: 'Calcula R = 40 · (2 · sen 15° · cos 15°)',
      sol: '2·sen15°·cos15° = sen(30°) = 1/2 → R = 40 × 1/2 = 20.'
    }
  },

  // GEOMETRÍA 5TO - IV BIMESTRE
  prisma_cilindro: {
    title: 'Prisma y Cilindro',
    subtitle: 'Áreas y volúmenes de sólidos prismáticos y cilindros de revolución',
    badge: 'IV Bimestre • Geometría 5to',
    formulas: [
      { name: 'Prisma Recto', expr: 'A_L = (2p_base) · h   |   V = A_base · h', note: 'Donde 2p_base es el perímetro de la base y h es la arista lateral.' },
      { name: 'Cilindro Circular Recto', expr: 'A_L = 2π·r·g   |   V = π · r² · h', note: 'En un cilindro recto la generatriz g es igual a la altura h.' }
    ],
    example: {
      q: 'Halla el volumen de un cilindro recto con r = 3 m y h = 5 m.',
      sol: 'V = π · (3)² · 5 = 45π m³.'
    }
  },
  piramide_cono: {
    title: 'Pirámide y Cono',
    subtitle: 'Sólidos piramidales y conos circulares rectos',
    badge: 'IV Bimestre • Geometría 5to',
    formulas: [
      { name: 'Pirámide Regular', expr: 'V = (A_base · h) / 3', note: 'El área lateral es el semiperímetro de la base por el apotema piramidal.' },
      { name: 'Cono de Revolución', expr: 'A_L = π·r·g   |   V = (π · r² · h) / 3', note: 'Se cumple por Pitágoras: g² = r² + h².' }
    ],
    example: {
      q: 'Calcula el volumen de una pirámide de base 18 cm² y altura 7 cm.',
      sol: 'V = (18 × 7) / 3 = 6 × 7 = 42 cm³.'
    }
  },
  esfera_teoremas: {
    title: 'Esfera y Teoremas de Pappus-Guldin',
    subtitle: 'Superficie esférica, volumen esférico y sólidos de revolución',
    badge: 'IV Bimestre • Geometría 5to',
    formulas: [
      { name: 'Superficie Esférica y Volumen', expr: 'A_SE = 4 · π · R²   |   V_E = (4/3) · π · R³', note: 'R es el radio de la esfera.' },
      { name: 'Teorema de Pappus (Volumen)', expr: 'V = 2 · π · x̄ · A', note: 'x̄ es la distancia del centroide de la región de área A al eje de giro.' }
    ],
    example: {
      q: 'Halla el área de la superficie de una esfera de radio R = 4 u.',
      sol: 'A = 4 · π · (4)² = 64π u².'
    }
  },
  recta_circunferencia: {
    title: 'Geometría Analítica: Recta y Circunferencia',
    subtitle: 'Pendiente de una recta y ecuación ordinaria de la circunferencia',
    badge: 'IV Bimestre • Geometría 5to',
    formulas: [
      { name: 'Pendiente y Ecuación de la Recta', expr: 'm = (y₂ - y₁)/(x₂ - x₁)   |   y - y₁ = m(x - x₁)', note: 'Rectas paralelas tienen m₁ = m₂; perpendiculares cumplen m₁·m₂ = -1.' },
      { name: 'Ecuación Ordinaria de la Circunferencia', expr: '(x - h)² + (y - k)² = R²', note: 'Centro C(h, k) y radio R.' }
    ],
    example: {
      q: 'En (x - 3)² + (y + 4)² = 25, halla R + h.',
      sol: 'h = 3 y R = √25 = 5 → R + h = 8.'
    }
  },
  parabola_elipse: {
    title: 'Secciones Cónicas: Parábola y Elipse',
    subtitle: 'Ecuación canónica, parámetro focal y lado recto',
    badge: 'IV Bimestre • Geometría 5to',
    formulas: [
      { name: 'Parábola Canónica y Lado Recto', expr: 'x² = 4py   o   y² = 4px   |   LR = |4p|', note: '|p| es la distancia del vértice al foco y del vértice a la directriz.' },
      { name: 'Elipse Canónica y Relación Pitagórica', expr: 'x²/a² + y²/b² = 1   |   a² = b² + c²', note: 'Eje mayor = 2a, eje menor = 2b, distancia focal = 2c.' }
    ],
    example: {
      q: 'Si el parámetro focal de una parábola es p = 6, ¿cuánto mide su Lado Recto?',
      sol: 'LR = |4p| = 4 × 6 = 24.'
    }
  }
};

export const DictLabContent: React.FC<Props> = ({ activeCourse, activeTab }) => {
  const bim4Card = IV_BIMESTRE_DATA[activeTab];

  if (bim4Card) {
    return (
      <div className="w-full h-full flex flex-col justify-start gap-4 pb-10">
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="inline-block bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-1.5">
              {bim4Card.badge}
            </span>
            <h4 className="text-lg md:text-2xl font-black text-slate-800">{bim4Card.title}</h4>
            <p className="text-xs md:text-sm font-bold text-slate-500">{bim4Card.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {bim4Card.formulas.map((f, idx) => (
            <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
              <div className="text-xs font-black text-indigo-600 uppercase tracking-wider">{f.name}</div>
              <div className="bg-slate-900 text-amber-300 font-mono font-black text-sm md:text-base px-3.5 py-2.5 rounded-xl border-2 border-slate-800">
                {f.expr}
              </div>
              <p className="text-xs font-bold text-slate-600 leading-relaxed">{f.note}</p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 md:p-5">
          <div className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Ejemplo Resuelto Paso a Paso</div>
          <p className="text-sm font-black text-slate-800 mb-2">{bim4Card.example.q}</p>
          <div className="bg-white border-2 border-emerald-200 rounded-xl p-3 text-xs md:text-sm font-bold text-slate-700">
            {bim4Card.example.sol}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-start gap-4 pb-10">
      {activeCourse === 'razonamiento' && <RazonamientoContent tab={activeTab} />}
      {activeCourse === 'razonamiento_5to' && <Razonamiento5toContent tab={activeTab} />}
      {activeCourse === 'trigonometria' && <TrigonometriaContent tab={activeTab} />}
      {activeCourse === 'geometria_5to' && <Geometria5toContent tab={activeTab} />}
    </div>
  );
};
