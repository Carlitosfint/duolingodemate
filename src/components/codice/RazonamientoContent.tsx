import React from 'react';
import { SectionTitle, GridCard, FormulaBox } from './CodiceUI';

export const RazonamientoContent: React.FC<{ tab: string }> = ({ tab }) => {
  if (tab === 'metodos') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="🧠" 
        title="Métodos Operativos" 
        subtitle="Trucos para resolver problemas rápidamente sin usar ecuaciones complejas. ¡Ideal para ahorrar tiempo en los exámenes!" 
        color="blue" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Método del Cangrejo" icon="🦀" color="blue">
          <p>Se aplica cuando tenemos una <strong>cantidad inicial desconocida</strong> y se realizan operaciones sucesivas hasta obtener un resultado final.</p>
          <ul className="list-disc pl-5 mt-2 font-medium">
            <li>Anota las operaciones en orden.</li>
            <li>Invierte cada operación (si era +, cambia a -).</li>
            <li>Calcula desde el resultado final hacia arriba.</li>
          </ul>
          <FormulaBox title="Ejemplo: Invertir Operaciones" formula="× 2 ➔ ÷ 2, + 5 ➔ - 5" color="blue" />
        </GridCard>
        <GridCard title="Método del Rombo" icon="💠" color="blue">
          <p>Sirve para resolver problemas con dos tipos de elementos (ej: gallinas y conejos) y conocemos el total de elementos y el total de "patas".</p>
          <ul className="list-disc pl-5 mt-2 font-medium">
            <li><strong>Izquierda:</strong> Total de elementos (N)</li>
            <li><strong>Derecha:</strong> Recaudación o total (R)</li>
            <li><strong>Arriba y Abajo:</strong> Valores unitarios (V₁ &gt; V₂)</li>
          </ul>
          <FormulaBox title="Elementos de V₂" formula="(N × V₁ - R) / (V₁ - V₂)" color="blue" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'cripto') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="🔢" 
        title="Criptoaritmética" 
        subtitle="Descubre los números ocultos detrás de las letras o símbolos. ¡La lógica y las reglas matemáticas básicas son tu mejor arma!" 
        color="emerald" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Reglas de Oro" icon="✨" color="emerald" fullWidth>
          <ul className="list-disc pl-5 space-y-2 font-medium">
            <li><strong>Letras iguales</strong> ocultan dígitos iguales.</li>
            <li><strong>Letras diferentes</strong> ocultan dígitos diferentes (salvo que se indique lo contrario).</li>
            <li>La primera cifra de un número <strong>nunca puede ser cero</strong>.</li>
            <li>La suma de dos dígitos diferentes <strong>como máximo es 17</strong> (9+8).</li>
            <li>Si al sumar dos números de "n" cifras el resultado tiene "n+1" cifras, la primera cifra del resultado <strong>siempre es 1</strong>.</li>
          </ul>
          <FormulaBox title="Ejemplo Clásico de Suma con Acarreo" formula="A + B = 10 + C" color="emerald" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'logica') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="🎲" 
        title="Lógica Recreativa" 
        subtitle="Problemas de parentesco, días de la semana y verdades/mentiras. El razonamiento puro entra en acción." 
        color="amber" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Días de la Semana" icon="📅" color="amber">
          <p>Transforma el texto en números para no confundirte con tantas palabras.</p>
          <div className="flex gap-2 flex-wrap mt-2">
            <span className="bg-amber-50 px-2 py-1 rounded font-bold text-amber-700">Hoy = 0</span>
            <span className="bg-amber-50 px-2 py-1 rounded font-bold text-amber-700">Mañana = +1</span>
            <span className="bg-amber-50 px-2 py-1 rounded font-bold text-amber-700">Ayer = -1</span>
          </div>
          <p className="mt-3">Suma todos los valores para encontrar la diferencia exacta respecto a hoy.</p>
        </GridCard>
        <GridCard title="Parentescos" icon="👨‍👩‍👦" color="amber">
          <p>Empieza a leer el problema <strong>desde el final hacia el principio</strong>.</p>
          <ul className="list-disc pl-5 mt-2 font-medium">
            <li>"El padre de mi padre" ➔ "Mi abuelo"</li>
            <li>"El único hermano de mi abuelo" ➔ "Mi tío abuelo"</li>
          </ul>
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'cronometria') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="⏱️" 
        title="Cronometría Básica" 
        subtitle="Problemas sobre tiempo transcurrido, campanadas y adelantos/atrasos simples." 
        color="purple" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Campanadas e Intervalos" icon="🔔" color="purple">
          <p>El truco es recordar que el tiempo <strong>no depende del número de campanadas, sino de los intervalos</strong> entre ellas.</p>
          <FormulaBox title="Fórmula Fundamental" formula="Intervalos = Campanadas - 1" color="purple" />
          <p className="mt-2 text-sm">Aplica Regla de 3 simple usando siempre los INTERVALOS, no las campanadas.</p>
        </GridCard>
        <GridCard title="Tiempo Transcurrido" icon="🕰️" color="purple">
          <p>Imagina el día como una línea de 24 horas.</p>
          <ul className="list-disc pl-5 mt-2 font-medium">
            <li>Tiempo transcurrido = <strong>X</strong></li>
            <li>Tiempo que falta transcurrir = <strong>24 - X</strong></li>
          </ul>
          <FormulaBox title="Ecuación del Día" formula="X + (24 - X) = 24h" color="purple" />
        </GridCard>
      </div>
    </div>
  );

  if (tab === 'conteo') return (
    <div className="space-y-6">
      <SectionTitle 
        icon="📐" 
        title="Conteo de Figuras" 
        subtitle="Aprende a contar triángulos, cuadriláteros y segmentos sin que se te escape ninguno." 
        color="rose" 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GridCard title="Método Práctico (Fórmula)" icon="🔢" color="rose">
          <p>Para figuras alineadas consecutivamente (como segmentos en una recta o triángulos con un mismo vértice).</p>
          <FormulaBox title="Conteo Consecutivo" formula="n(n + 1) / 2" color="rose" />
          <p className="mt-2 text-sm">Donde <strong>n</strong> es el número de espacios base.</p>
        </GridCard>
        <GridCard title="Cuadriláteros en Cuadrícula" icon="🔲" color="rose">
          <p>Si tienes una malla de <strong>m</strong> filas y <strong>n</strong> columnas, la fórmula se aplica a ambos lados y se multiplica.</p>
          <FormulaBox title="Fórmula 2D" formula="[m(m+1)/2] × [n(n+1)/2]" color="rose" />
        </GridCard>
      </div>
    </div>
  );

  return null;
};
