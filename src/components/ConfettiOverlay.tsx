import { Icon } from './CustomIcons';
import React, { useEffect, useRef } from 'react';

export const ConfettiOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; 
    if(!canvas) return;
    const ctx = canvas.getContext('2d'); 
    if(!ctx) return;
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    
    let particles: any[] = []; 
    const colors = ['#facc15', '#3b82f6', '#ec4899', '#10b981', '#a855f7', '#ffffff']; 
    
    for (let i = 0; i < 120; i++) {
      particles.push({ 
        x: canvas.width / 2, 
        y: canvas.height / 2 + (Math.random() * 100), 
        vx: (Math.random() - 0.5) * 25, 
        vy: (Math.random() - 0.5) * 20 - 10, 
        width: Math.random() * 10 + 5, 
        height: Math.random() * 10 + 8,
        color: colors[Math.floor(Math.random() * colors.length)], 
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngle: 0, 
        tiltAngleInc: (Math.random() * 0.07) + 0.05,
        life: 150 + Math.random() * 50
      });
    }
    
    let animationId: number;
    const render = () => { 
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      let active = false; 
      
      for (let i = 0; i < particles.length; i++) { 
        const p = particles[i]; 
        if (p.life <= 0) continue; 
        active = true; 
        
        p.tiltAngle += p.tiltAngleInc;
        p.vy += 0.4; 
        p.vx *= 0.98; 
        
        p.x += Math.sin(p.tiltAngle) * 2 + p.vx; 
        p.y += p.vy; 
        p.life -= 1; 
        
        ctx.save();
        ctx.translate(p.x + p.width/2, p.y + p.height/2);
        ctx.rotate(p.tiltAngle * 0.5);
        ctx.scale(1, Math.abs(Math.sin(p.tiltAngle))); 
        
        ctx.globalAlpha = Math.min(1, p.life / 30); 
        ctx.fillStyle = p.color; 
        ctx.fillRect(-p.width/2, -p.height/2, p.width, p.height); 
        ctx.restore();
      } 
      if(active) {
        animationId = requestAnimationFrame(render); 
      }
    };
    render(); 
    return () => cancelAnimationFrame(animationId);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[400]" />;
};
