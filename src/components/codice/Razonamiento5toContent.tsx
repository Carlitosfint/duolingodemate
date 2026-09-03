import React from 'react';
import { SectionTitle, GridCard, FormulaBox } from './CodiceUI';

export const Razonamiento5toContent: React.FC<{ tab: string }> = ({ tab }) => {
  if (tab === 'edades') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="👨‍👦" 
        title="Edades" 
        subtitle="Maneja los tiempos de pasado, presente y futuro. La diferencia de edades entre dos personas jamás cambia con el tiempo." 
        color="blue" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Con un solo sujeto" icon="🧍" color="blue">
          <p>Organiza en una línea de tiempo:</p>
          <ul className="list-disc pl-5 mt-2 font-medium">
            <li><strong>Hace "a" años:</strong> E - a</li>
            <li><strong>Edad actual:</strong> E</li>
            <li><strong>Dentro de "b" años:</strong> E + b</li>
          </ul>
        </GridCard>
        <GridCard title="Con dos o más sujetos" icon="👥" color="blue">
          <p>Usa un cuadro de doble entrada. Recuerda las reglas clave:</p>
          <ul className="list-disc pl-5 mt-2 font-medium">
            <li>La <strong>diferencia</strong> de edades es constante en cualquier tiempo.</li>
            <li>La <strong>suma en aspa</strong> de valores extremos es igual.</li>
          </ul>
          <FormulaBox title="Suma en Aspa" formula="P₁ + F₂ = P₂ + F₁" color="blue" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'cronometria') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="⏳" 
        title="Cronometría Avanzada" 
        subtitle="Problemas de relojes, ángulos entre manecillas, y adelantos/atrasos. ¡Requiere mucha atención a las proporciones!" 
        color="sky" 
      />
      <div className="grid grid-cols-1 gap-4">
        <GridCard title="Ángulos entre Manecillas" icon="⌚" color="sky">
          <p>La fórmula general para hallar el ángulo formado a una hora determinada (H horas y M minutos) es:</p>
          <FormulaBox title="Adelanta el Minutero" formula="θ = 11/2(M) - 30(H)" color="sky" />
          <FormulaBox title="Adelanta el Horario" formula="θ = 30(H) - 11/2(M)" color="sky" />
          <p className="mt-2 text-sm text-center">Elige la fórmula según qué manecilla va "ganando" en el reloj convencional.</p>
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'logica') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="🧠" 
        title="Lógica Inferencial" 
        subtitle="Deduce conclusiones a partir de proposiciones (p, q, r). ¡Conocer los valores de verdad es la clave!" 
        color="violet" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Conjunción (p ∧ q)" icon="∧" color="violet">
          <p>Representa la palabra <strong>"y"</strong>. Ambas condiciones deben cumplirse.</p>
          <FormulaBox title="Regla de Oro" formula="Solo V si AMBAS son V" color="violet" />
        </GridCard>
        <GridCard title="Disyunción (p ∨ q)" icon="∨" color="violet">
          <p>Representa la palabra <strong>"o"</strong>. Basta con que una se cumpla.</p>
          <FormulaBox title="Regla de Oro" formula="Solo F si AMBAS son F" color="violet" />
        </GridCard>
        <GridCard title="Condicional (p ➔ q)" icon="➔" color="violet" fullWidth>
          <p>Representa <strong>"Si p, entonces q"</strong>. Es la más importante en exámenes de admisión.</p>
          <FormulaBox title="Regla de Oro" formula="Solo F si V ➔ F" color="violet" />
          <p className="mt-2 text-sm text-center">En cualquier otro caso, el resultado es Verdadero (V).</p>
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'mezclas') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="🧪" 
        title="Fracciones y Mezclas" 
        subtitle="Domina la reducción a la unidad y las fórmulas de mezclas y aleaciones." 
        color="amber" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Reducción a la Unidad" icon="🚰" color="amber">
          <p>Si un caño llena un tanque en "T" horas, ¿cuánto llena en 1 hora?</p>
          <FormulaBox title="En 1 hora hace:" formula="1 / T" color="amber" />
          <p className="mt-2 text-sm">Suma o resta estas fracciones si hay varios caños o desagües trabajando juntos.</p>
        </GridCard>
        <GridCard title="Precio Medio (Mezcla)" icon="⚖️" color="amber">
          <p>Para hallar el precio de una mezcla, se promedia según las cantidades.</p>
          <FormulaBox title="Precio Medio (Pm)" formula="C₁P₁ + C₂P₂ / (C₁ + C₂)" color="amber" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'financiera') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="💰" 
        title="Matemática Financiera" 
        subtitle="Fórmulas de Interés Simple. Recuerda que la tasa y el tiempo deben estar en las mismas unidades." 
        color="rose" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Interés Simple (I)" icon="📈" color="rose">
          <p>El interés generado depende del Capital (C), la Tasa de interés (r%) y el Tiempo (t).</p>
          <FormulaBox title="Fórmula General" formula="I = C × r% × t" color="rose" />
        </GridCard>
        <GridCard title="Monto (M)" icon="🏦" color="rose">
          <p>El monto total es el dinero inicial más los intereses ganados.</p>
          <FormulaBox title="Monto Final" formula="M = C + I" color="rose" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'planteo') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="📊" 
        title="Planteo de Ecuaciones" 
        subtitle="Traducir del lenguaje verbal al lenguaje matemático. La coma (,) cambia por completo el sentido." 
        color="emerald" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="El poder de la coma" icon="✍️" color="emerald" fullWidth>
          <p>Observa cómo una coma altera la ecuación:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <FormulaBox title="El doble de un número, más 5" formula="2x + 5" color="emerald" />
            <FormulaBox title="El doble, de un número más 5" formula="2(x + 5)" color="emerald" />
          </div>
        </GridCard>
      </div>
    </div>
  );

  return null;
};
