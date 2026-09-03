import React from 'react';
import { SectionTitle, GridCard, FormulaBox } from './CodiceUI';

export const TrigonometriaContent: React.FC<{ tab: string }> = ({ tab }) => {
  if (tab === 'rt') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="📐" 
        title="Propiedades RT" 
        subtitle="Razones Trigonométricas Recíprocas y Complementarias (Cofunciones)." 
        color="indigo" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="RT Recíprocas" icon="🔄" color="indigo">
          <p>Al multiplicar una razón por su inversa (del mismo ángulo), el resultado es 1.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 font-medium">
            <li>sen(α) × csc(α) = 1</li>
            <li>cos(α) × sec(α) = 1</li>
            <li>tan(α) × cot(α) = 1</li>
          </ul>
        </GridCard>
        <GridCard title="RT Complementarias" icon="🤝" color="indigo">
          <p>Si dos ángulos suman 90° (α + β = 90°), sus cofunciones son iguales.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 font-medium">
            <li>sen(α) = cos(β)</li>
            <li>tan(α) = cot(β)</li>
            <li>sec(α) = csc(β)</li>
          </ul>
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'triangulos') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="📐" 
        title="Resolución de Triángulos" 
        subtitle="Halla los lados desconocidos de un triángulo rectángulo conociendo solo un lado y un ángulo agudo." 
        color="teal" 
      />
      <div className="grid grid-cols-1 gap-4">
        <GridCard title="Regla de Oro (Lo que quiero / Lo que tengo)" icon="🎯" color="teal">
          <p className="mb-4">Para encontrar el lado desconocido "X" usando el lado conocido "L" y el ángulo "α":</p>
          <FormulaBox title="Fórmula Universal" formula="X = L × (Lado que QUIERO / Lado que TENGO)" color="teal" />
          <p className="mt-4">La fracción (Lado que QUIERO / Lado que TENGO) forma una de las 6 razones trigonométricas del ángulo α.</p>
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'verticales') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="👀" 
        title="Ángulos Verticales" 
        subtitle="Ángulos formados por la línea visual del observador y la línea horizontal." 
        color="orange" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Ángulo de Elevación" icon="📈" color="orange">
          <p>Se forma cuando el objeto observado está <strong>por encima</strong> de la línea horizontal del observador.</p>
          <FormulaBox title="Elevación" formula="Línea Visual ⇧" color="orange" />
        </GridCard>
        <GridCard title="Ángulo de Depresión" icon="📉" color="orange">
          <p>Se forma cuando el objeto observado está <strong>por debajo</strong> de la línea horizontal.</p>
          <FormulaBox title="Depresión" formula="Línea Visual ⇩" color="orange" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'geo_ana') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="📍" 
        title="Geometría Analítica" 
        subtitle="Distancia entre puntos, punto medio y coordenadas en el plano cartesiano." 
        color="cyan" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Distancia entre dos puntos" icon="📏" color="cyan" fullWidth>
          <p>Para hallar la distancia "d" entre P₁(x₁, y₁) y P₂(x₂, y₂), usamos el Teorema de Pitágoras aplicado al plano:</p>
          <FormulaBox title="Distancia (d)" formula="d = √[ (x₂ - x₁)² + (y₂ - y₁)² ]" color="cyan" />
        </GridCard>
        <GridCard title="Punto Medio" icon="🎯" color="cyan">
          <p>Las coordenadas del punto medio "M" de un segmento se calculan promediando los extremos.</p>
          <FormulaBox title="Punto Medio (x, y)" formula="x = (x₁+x₂)/2 , y = (y₁+y₂)/2" color="cyan" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'pos_norm') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="🔄" 
        title="Ángulos en Posición Normal" 
        subtitle="Radio vector, signos en los cuadrantes y ángulos cuadrantales." 
        color="pink" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Radio Vector (r)" icon="↗️" color="pink">
          <p>Distancia desde el origen (0,0) hasta el punto P(x, y). Siempre es positivo.</p>
          <FormulaBox title="Radio Vector" formula="r = √(x² + y²)" color="pink" />
        </GridCard>
        <GridCard title="Regla de Signos" icon="➕" color="pink">
          <p>Regla mnemotécnica: <strong>T</strong>odas <strong>S</strong>in <strong>T</strong>a <strong>C</strong>os (I, II, III, IV cuadrante).</p>
          <ul className="list-disc pl-5 mt-2 text-sm font-medium">
            <li><strong>IC:</strong> Todas (+)</li>
            <li><strong>IIC:</strong> Sen y Csc (+)</li>
            <li><strong>IIIC:</strong> Tan y Cot (+)</li>
            <li><strong>IVC:</strong> Cos y Sec (+)</li>
          </ul>
        </GridCard>
      </div>
    </div>
  );

  return null;
};
