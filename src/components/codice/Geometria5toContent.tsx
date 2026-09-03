import React from 'react';
import { SectionTitle, GridCard, FormulaBox } from './CodiceUI';

export const Geometria5toContent: React.FC<{ tab: string }> = ({ tab }) => {
  if (tab === 'metrica') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="📏" 
        title="Relaciones Métricas" 
        subtitle="Propiedades en el triángulo rectángulo cuando se traza la altura relativa a la hipotenusa." 
        color="rose" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Teorema de la Altura" icon="📐" color="rose">
          <p>La altura al cuadrado es igual al producto de las proyecciones de los catetos.</p>
          <FormulaBox title="Fórmula" formula="h² = m × n" color="rose" />
        </GridCard>
        <GridCard title="Teorema del Cateto" icon="📐" color="rose">
          <p>El cateto al cuadrado es igual al producto de la hipotenusa por su proyección.</p>
          <FormulaBox title="Fórmula" formula="c² = a × n" color="rose" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'areas') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="📐" 
        title="Áreas de Regiones Planas" 
        subtitle="Fórmulas fundamentales para calcular áreas de triángulos y cuadriláteros." 
        color="fuchsia" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Triángulo Equilátero" icon="🔺" color="fuchsia">
          <p>Si conoces el lado "L" de un triángulo equilátero, usa esta fórmula rápida:</p>
          <FormulaBox title="Área" formula="A = (L²√3) / 4" color="fuchsia" />
        </GridCard>
        <GridCard title="Fórmula de Herón" icon="🔺" color="fuchsia">
          <p>Para cualquier triángulo si conoces sus tres lados (a, b, c). "p" es el semiperímetro.</p>
          <FormulaBox title="Semiperímetro" formula="p = (a+b+c) / 2" color="fuchsia" />
          <FormulaBox title="Área" formula="A = √[p(p-a)(p-b)(p-c)]" color="fuchsia" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'circulos') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="⭕" 
        title="Superficies Circulares" 
        subtitle="Círculos, sectores y coronas circulares." 
        color="pink" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Sector Circular" icon="🍕" color="pink">
          <p>Área de una "rebanada" de círculo, donde "θ" está en grados sexagesimales.</p>
          <FormulaBox title="Área (Grados)" formula="A = (π·r²·θ) / 360°" color="pink" />
        </GridCard>
        <GridCard title="Corona Circular" icon="🍩" color="pink">
          <p>Área comprendida entre dos círculos concéntricos de radios R (mayor) y r (menor).</p>
          <FormulaBox title="Área Corona" formula="A = π(R² - r²)" color="pink" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'espacio') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="🧊" 
        title="Geometría del Espacio" 
        subtitle="Líneas, planos y el famoso teorema de las 3 perpendiculares." 
        color="purple" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Teorema 3 Perpendiculares" icon="📐" color="purple" fullWidth>
          <p>Si trazamos una recta perpendicular a un plano, y desde su pie trazamos otra perpendicular a una recta del plano, al unir el punto de la primera con la intersección de la segunda, se forma una <strong>tercera recta perpendicular</strong> a la recta contenida en el plano.</p>
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'solidos') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="🕋" 
        title="Sólidos y Poliedros" 
        subtitle="Volúmenes y áreas superficiales de prismas, cilindros, pirámides y conos." 
        color="indigo" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Cilindro Circular Recto" icon="🛢️" color="indigo">
          <FormulaBox title="Área Lateral" formula="AL = 2πrg" color="indigo" />
          <FormulaBox title="Volumen" formula="V = πr²h" color="indigo" />
        </GridCard>
        <GridCard title="Cono Circular Recto" icon="🍦" color="indigo">
          <p className="mb-2">Donde "g" es la generatriz.</p>
          <FormulaBox title="Área Lateral" formula="AL = πrg" color="indigo" />
          <FormulaBox title="Volumen" formula="V = (πr²h) / 3" color="indigo" />
        </GridCard>
      </div>
    </div>
  );

  return null;
};
