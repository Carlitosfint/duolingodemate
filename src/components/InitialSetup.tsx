import React, { useState } from 'react';
import { Card, Button } from './UI';
import { Avatar } from './Avatar';
import { Icon } from './CustomIcons';

interface InitialSetupProps {
  initialName: string;
  onComplete: (name: string, avatar: string) => void;
}

export const InitialSetup = ({ initialName, onComplete }: InitialSetupProps) => {
  const [name, setName] = useState(initialName === 'Estudiante' ? '' : initialName);
  const [avatar, setAvatar] = useState('fox');

  const avatars = ['fox', 'cat', 'panda', 'tiger', 'lion', 'bear'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim(), avatar);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[500] flex items-center justify-center p-4 backdrop-blur-md">
      <Card className="w-full max-w-md bg-white border-b-[8px] border-blue-500 p-8 shadow-2xl relative overflow-hidden animate-pop">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            👋
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">¡Bienvenido!</h2>
          <p className="text-slate-500 font-bold text-sm">Antes de empezar, personaliza tu perfil.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3 text-center">Elige tu Avatar</label>
            <div className="grid grid-cols-3 gap-3">
              {avatars.map(a => (
                <div 
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`cursor-pointer border-4 rounded-3xl p-2 flex items-center justify-center transition-all ${avatar === a ? 'border-blue-500 bg-blue-50 transform scale-105' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 grayscale opacity-70'}`}
                >
                  <Avatar name={a} size={48} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 text-center">Tus Nombres y Apellidos</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Carlos Mendoza" 
              required
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-black text-slate-800 bg-slate-50 text-center text-lg"
            />
          </div>

          <Button type="submit" color="blue" className="w-full py-4 text-lg">
            ¡Comenzar a Aprender! <Icon name="chevron_right" size={20} className="inline-block" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
