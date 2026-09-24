import { describe, expect, it } from 'vitest';
import * as RZ from './math_razonamiento_5to.ts';
import * as GE from './math_geometria_5to.ts';
import * as TR from './math_trigonometria.ts';
import { isCorrectAnswer, keyValue } from '../lib/answers.ts';

// A wrong answer key is the worst bug this product can ship: the student is
// right and the app tells them they're wrong. These tests re-derive the
// answer from the wording, independently of how the generator computed it.

const generators: Record<string, (golden: boolean) => any> = {
  PlanteoEcuaciones: RZ.generatePlanteoEcuaciones,
  Edades: RZ.generateEdades,
  Cronometria: RZ.generateCronometria,
  LogicaInferencial: (g) => RZ.generateLogicaInferencial(g, 55),
  MezclasAleaciones: RZ.generateMezclasAleaciones,
  MateFinanciera: RZ.generateMateFinanciera,
  RelacionesMetricas: GE.generateRelacionesMetricas,
  AreasRegiones: GE.generateAreasRegiones,
  SuperficiesCirculares: GE.generateSuperficiesCirculares,
  GeometriaEspacio: GE.generateGeometriaEspacio,
  Solidos: GE.generateSolidos,
  PropiedadesRT: TR.generatePropiedadesRT,
  ResolucionTriangulos: TR.generateResolucionTriangulos,
  AngulosVerticales: TR.generateAngulosVerticales,
  GeometriaAnalitica: TR.generateGeometriaAnalitica,
  AngulosPosicionNormal: TR.generateAngulosPosicionNormal,
};

const SAMPLE = 120;
const sample = (name: string) =>
  Array.from({ length: SAMPLE }, () => generators[name](false));

// The exercise screen accepts an answer within this of the key.
const TOLERANCE = 0.05;

describe.each(Object.keys(generators))('%s', (name) => {
  const problems = sample(name);

  it('always produces a usable problem', () => {
    for (const p of problems) {
      expect(p.intro, 'el enunciado no puede ir vacío').toBeTruthy();
      expect(p.explanation, 'la explicación no puede ir vacía').toBeTruthy();
      expect(p.type).toBeTruthy();
    }
  });

  // Read with the same parser the exercise screen grades with: parseFloat
  // would read a fraction key like "16/3" as 16 and still call it a number.
  it('answers with a real number', () => {
    for (const p of problems) {
      if (p.visualData?.type === 'truth_table') continue;
      const value = keyValue(p.expectedAnswer);
      expect(value !== null && Number.isFinite(value), `respuesta no numérica: ${p.expectedAnswer}`).toBe(true);
    }
  });

  it('accepts its own key as a correct answer', () => {
    for (const p of problems) {
      if (p.visualData?.type === 'truth_table') continue;
      expect(isCorrectAnswer(String(p.expectedAnswer), p.expectedAnswer), `${p.expectedAnswer} :: ${p.intro}`).toBe(true);
    }
  });

  it('never leaks a placeholder or unresolved template into the wording', () => {
    for (const p of problems) {
      for (const text of [p.intro, p.explanation]) {
        expect(text).not.toMatch(/undefined|NaN|\[object|\$\{/);
      }
    }
  });

  // Variety matters pedagogically: a handful of fixed problems means the
  // student memorises answers instead of learning the method.
  it('does not repeat the same handful of problems', () => {
    const distinct = new Set(problems.map((p) => p.intro)).size;
    expect(distinct, `solo ${distinct} enunciados distintos en ${SAMPLE}`).toBeGreaterThan(10);
  });
});

describe('claves verificadas de forma independiente', () => {
  // Regression guard: mixtures used to round the mean to an integer while
  // the checker demanded ±0.05, so a student who correctly computed 48.33
  // was marked wrong. 16 of every 21 problems were ungradeable.
  it('mezclas: el grado exacto de la mezcla pasa la tolerancia', () => {
    let checked = 0;
    for (const p of sample('MezclasAleaciones')) {
      const m = p.intro.match(/Se mezclan (\d+)L de alcohol al (\d+)% con (\d+)L de alcohol al (\d+)%/);
      if (!m) continue;
      checked++;
      const [v1, g1, v2, g2] = m.slice(1).map(Number);
      const exact = (v1 * g1 + v2 * g2) / (v1 + v2);
      expect(Math.abs(exact - parseFloat(p.expectedAnswer)), p.intro).toBeLessThanOrEqual(TOLERANCE);
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('grifos: el tiempo combinado es exacto', () => {
    let checked = 0;
    for (const p of sample('MezclasAleaciones')) {
      const m = p.intro.match(/llena un tanque en (\d+) horas y otro grifo lo llena en (\d+) horas/);
      if (!m) continue;
      checked++;
      const [t1, t2] = m.slice(1).map(Number);
      expect((t1 * t2) / (t1 + t2), p.intro).toBeCloseTo(parseFloat(p.expectedAnswer), 10);
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('posición normal: el radio vector y la razón cuadran', () => {
    let checked = 0;
    for (const p of sample('AngulosPosicionNormal')) {
      const m = p.intro.match(/P\((-?\d+); (-?\d+)\).*Calcula (\d+)·(sen|cos)/);
      if (!m) continue;
      checked++;
      const [x, y, r] = [Number(m[1]), Number(m[2]), Number(m[3])];
      expect(Math.hypot(x, y), `radio vector mal en: ${p.intro}`).toBeCloseTo(r, 10);
      const expected = m[4] === 'sen' ? r * (y / Math.hypot(x, y)) : r * (x / Math.hypot(x, y));
      expect(expected, p.intro).toBeCloseTo(parseFloat(p.expectedAnswer), 10);
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('posición normal: el negativo va entre paréntesis al elevarlo al cuadrado', () => {
    // "√(-4² + 3²)" es falso: -4² es -16. Faltaban los paréntesis.
    for (const p of sample('AngulosPosicionNormal')) {
      expect(p.explanation).not.toMatch(/√\(-\d+²/);
    }
  });

  it('edades: la razón futura se cumple con las edades que da por respuesta', () => {
    let checked = 0;
    for (const p of sample('Edades')) {
      const m = p.intro.match(/relación de (\d+) a (\d+)\. Dentro de (\d+) años estarán en relación de (\d+) a (\d+)/);
      if (!m) continue;
      checked++;
      const [a, b, years, af, bf] = m.slice(1).map(Number);
      const beto = parseFloat(p.expectedAnswer);
      const k = beto / b;
      expect((a * k + years) / (beto + years), p.intro).toBeCloseTo(af / bf, 10);
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('edades: el plazo es creíble para un escolar', () => {
    // Salían enunciados del tipo "dentro de 69 años mi edad será...".
    for (const p of sample('Edades')) {
      const m = p.intro.match(/Dentro de (\d+) años mi edad será/);
      if (m) expect(Number(m[1]), p.intro).toBeLessThanOrEqual(30);
    }
  });

  it('geometría del espacio: PB sale de Pitágoras', () => {
    let checked = 0;
    for (const p of sample('GeometriaEspacio')) {
      const m = p.intro.match(/PA = (\d+) y AB = (\d+)/);
      if (!m) continue;
      checked++;
      const [pa, ab] = m.slice(1).map(Number);
      expect(Math.hypot(pa, ab), p.intro).toBeCloseTo(parseFloat(p.expectedAnswer), 10);
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('relaciones métricas: h² = m·n y a² = c·m, con triángulo real detrás', () => {
    let checked = 0;
    for (const p of sample('RelacionesMetricas')) {
      const alt = p.intro.match(/sobre el piso \(hipotenusa\) miden (\d+) y (\d+)/);
      if (alt) {
        checked++;
        const [m1, n1] = alt.slice(1).map(Number);
        expect(Math.sqrt(m1 * n1), p.intro).toBeCloseTo(parseFloat(p.expectedAnswer), 10);
        continue;
      }
      const leg = p.intro.match(/hipotenusa \(c\) mide (\d+) y la proyección \(sombra\) que deja ese mismo cateto en el suelo mide (\d+)/);
      if (leg) {
        checked++;
        const [c, m2] = leg.slice(1).map(Number);
        expect(m2, `la proyección no cabe en la hipotenusa: ${p.intro}`).toBeLessThan(c);
        expect(Math.sqrt(c * m2), p.intro).toBeCloseTo(parseFloat(p.expectedAnswer), 10);
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('geometría analítica: distancia y punto medio', () => {
    let checked = 0;
    for (const p of sample('GeometriaAnalitica')) {
      const dist = p.intro.match(/distancia entre los puntos P\((-?\d+); (-?\d+)\) y Q\((-?\d+); (-?\d+)\)/);
      if (dist) {
        checked++;
        const [x1, y1, x2, y2] = dist.slice(1).map(Number);
        expect(Math.hypot(x2 - x1, y2 - y1), p.intro).toBeCloseTo(parseFloat(p.expectedAnswer), 10);
        continue;
      }
      const mid = p.intro.match(/punto medio del segmento cuyos extremos son A\((-?\d+); (-?\d+)\) y B\((-?\d+); (-?\d+)\)/);
      if (mid) {
        checked++;
        const [x1, y1, x2, y2] = mid.slice(1).map(Number);
        expect((x1 + x2) / 2 + (y1 + y2) / 2, p.intro).toBeCloseTo(parseFloat(p.expectedAnswer), 10);
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('cronometría: el ángulo del reloj sigue la fórmula', () => {
    let checked = 0;
    for (const p of sample('Cronometria')) {
      const m = p.intro.match(/manecillas de un reloj exactamente a las (\d+):(\d+)/);
      if (!m) continue;
      checked++;
      const [h, min] = m.slice(1).map(Number);
      let angle = Math.abs(30 * h - 5.5 * min);
      if (angle > 180) angle = 360 - angle;
      expect(angle, p.intro).toBeCloseTo(parseFloat(p.expectedAnswer), 10);
    }
    expect(checked).toBeGreaterThan(0);
  });

  // 64·30/360 is 16/3. The key used to be 5.33, and the exact answer
  // "16/3" was read as 16 and marked wrong.
  it('sector circular: la clave es exacta y acepta la fracción', () => {
    let checked = 0;
    for (let i = 0; i < SAMPLE * 3; i++) {
      const golden = i % 4 === 0;
      const p = GE.generateSuperficiesCirculares(golden);
      const m = p.intro.match(/sector circular cuyo radio mide (\d+) cm y su ángulo central es (\d+)°/);
      if (!m) continue;
      checked++;
      const [r, angle] = m.slice(1).map(Number);
      const exact = (r * r * angle) / 360 + (golden ? 1 : 0);
      expect(keyValue(p.expectedAnswer)!, p.intro).toBeCloseTo(exact, 12);
      expect(isCorrectAnswer(exact.toFixed(2), p.expectedAnswer), `${exact.toFixed(2)} para ${p.expectedAnswer}`).toBe(true);
      expect(p.explanation).not.toMatch(/NaN|undefined/);
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('mate financiera: el interés simple cuadra', () => {
    let checked = 0;
    for (const p of sample('MateFinanciera')) {
      const m = p.intro.match(/capital de S\/ (\d+) impuesto al (\d+)% anual durante (\d+) años/);
      if (!m) continue;
      checked++;
      const [c, r, t] = m.slice(1).map(Number);
      expect((c * r * t) / 100, p.intro).toBeCloseTo(parseFloat(p.expectedAnswer), 10);
    }
    expect(checked).toBeGreaterThan(0);
  });
});
