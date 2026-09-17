import React, { useState } from 'react';
import { Card, Button } from './UI';
import { Avatar } from './Avatar';

export interface SetupData {
  name: string;
  avatar: string;
}

interface InitialSetupProps {
  initialName: string;
  onComplete: (data: SetupData) => void;
}

// Grade/section are fixed at enrollment by whoever registered the
// account — this screen only collects the display profile (avatar,
// name confirmation), it never asks the student anything about their
// grade or role.
export const InitialSetup = ({ initialName, onComplete }: InitialSetupProps) => {
  const [name, setName] = useState(initialName === 'Estudiante' ? '' : initialName);
  const [avatar, setAvatar] = useState('fox');

  const avatars = ['fox', 'cat', 'panda', 'tiger', 'lion', 'bear'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({ name: name.trim(), avatar });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[500] flex items-center justify-center p-4 backdrop-blur-md">
      <Card className="w-full max-w-md bg-white border-b-[8px] border-blue-500 p-8 shadow-2xl relative overflow-hidden animate-pop min-h-[450px] flex flex-col">
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">Crea tu Perfil</h2>
            <p className="text-slate-500 font-bold text-sm">Casi listos para empezar.</p>
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
              ¡Comenzar a Aprender!
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
