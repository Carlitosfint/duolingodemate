import { Icon } from './CustomIcons';
import React from 'react';

interface SVGWheelProps {
  rotation: number;
  prizes: any[];
  speedClass?: string;
  renderText?: (p: any) => string;
}

export const SVGWheel: React.FC<SVGWheelProps> = ({ rotation, prizes, speedClass = "wheel-fast", renderText }) => {
  const size = 300;
  const center = size / 2;
  const radius = size / 2;
  let currentAngle = 0;
  
  const slices = prizes.map(p => {
    const angle = (p.prob / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = startAngle + angle;
    currentAngle += angle;
    return { ...p, startAngle, endAngle, angle };
  });
  
  const gradientParts: string[] = [];
  let currentPercentage = 0;
  prizes.forEach(p => {
    const percentage = p.prob;
    gradientParts.push(`${p.color} ${currentPercentage}% ${currentPercentage + percentage}%`);
    currentPercentage += percentage;
  });

  return (
    <div className="wheel-container mb-6 md:mb-8 mx-auto relative">
      <div className="wheel-pointer"></div>
      <div className={`wheel ${speedClass} relative bg-white`} style={{ transform: `rotate(${rotation}deg)` }}>
        <div className="absolute inset-0 z-0 pointer-events-none rounded-full" style={{ border: '4px dashed #e2e8f0', margin: '2px' }}></div>
        <div className="wheel-inner absolute inset-2 bg-slate-800" style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}>
          {slices.map((prize) => {
            const textAngle = prize.startAngle + (prize.angle / 2) - 90;
            const radiusOffset = prize.angle < 20 ? 30 : 50;
            const textX = center - 10 + (radius - radiusOffset) * Math.cos(Math.PI * textAngle / 180); 
            const textY = center - 10 + (radius - radiusOffset) * Math.sin(Math.PI * textAngle / 180);
            return (
              <div key={prize.id} className="absolute font-black text-white" 
                   style={{ 
                       left: `${(textX / size) * 100}%`,
                       top: `${(textY / size) * 100}%`,
                       transform: `rotate(${textAngle + 90}deg)`,
                       textShadow: '0px 2px 4px rgba(0,0,0,0.6)',
                       fontSize: prize.angle < 15 ? '0.75rem' : '1.25rem',
                       transformOrigin: 'center center'
                   }}>
                {renderText ? renderText(prize) : prize.icon}
              </div>
            );
          })}
        </div>
      </div>
      <div className="wheel-center"></div>
    </div>
  );
};
