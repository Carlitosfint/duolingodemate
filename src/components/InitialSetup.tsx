import React, { useState } from 'react';
import { Card, Button } from './UI';
import { Avatar } from './Avatar';

export interface SetupData {
  avatar: string;
}

interface InitialSetupProps {
  name: string;
  onComplete: (data: SetupData) => void;
}

// Name, grade and section are fixed at enrollment by the school, so this
// screen shows the name instead of asking for it. It used to ask — and
// whatever the student typed replaced their official name on the
// teacher's roster.
export const InitialSetup = ({ name, onComplete }: InitialSetupProps) => {
  const [avatar, setAvatar] = useState('fox');

  const avatars = ['fox', 'cat', 'panda', 'tiger', 'lion', 'bear'];
  const firstName = name.split(' ')[0] || name;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ avatar });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[500] flex items-center justify-center p-4 backdrop-blur-md">
      <Card className="w-full max-w-md bg-white border-b-[8px] border-blue-500 p-8 shadow-2xl relative overflow-hidden animate-pop min-h-[450px] flex flex-col">
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">¡Hola, {firstName}!</h2>
            <p className="text-slate-500 font-bold text-sm">Elige tu avatar para empezar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div role="radiogroup" aria-label="Avatar" className="grid grid-cols-3 gap-3">
              {avatars.map(a => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={avatar === a}
                  aria-label={a}
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`cursor-pointer border-4 rounded-3xl p-2 flex items-center justify-center transition-all ${avatar === a ? 'border-blue-500 bg-blue-50 transform scale-105' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 grayscale opacity-70'}`}
                >
                  <Avatar name={a} size={48} />
                </button>
              ))}
            </div>

            <div className="text-center px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Tu nombre en el colegio</p>
              <p className="font-black text-slate-800 text-lg leading-tight mt-1">{name}</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Si hay un error, avísale a secretaría.</p>
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
