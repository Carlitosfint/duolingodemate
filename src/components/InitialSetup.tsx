import React, { useState } from 'react';
import { Card, Button } from './UI';
import { Avatar } from './Avatar';
import { Icon } from './CustomIcons';

export interface SetupData {
  name: string;
  avatar: string;
  role: 'student' | 'teacher';
  grade?: '3ro' | '4to' | '5to';
}

interface InitialSetupProps {
  initialName: string;
  onComplete: (data: SetupData) => void;
}

export const InitialSetup = ({ initialName, onComplete }: InitialSetupProps) => {
  const [step, setStep] = useState(0);
  
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [grade, setGrade] = useState<'3ro' | '4to' | '5to'>('3ro');
  const [name, setName] = useState(initialName === 'Estudiante' ? '' : initialName);
  const [avatar, setAvatar] = useState('fox');

  const avatars = ['fox', 'cat', 'panda', 'tiger', 'lion', 'bear'];

  const handleRoleSelect = (selectedRole: 'student' | 'teacher') => {
    setRole(selectedRole);
    if (selectedRole === 'teacher') {
      setStep(2); // Skip grade selection for teachers
    } else {
      setStep(1); // Go to grade selection for students
    }
  };

  const handleGradeSelect = (selectedGrade: '3ro' | '4to' | '5to') => {
    setGrade(selectedGrade);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete({
        name: name.trim(),
        avatar,
        role,
        ...(role === 'student' ? { grade } : {})
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[500] flex items-center justify-center p-4 backdrop-blur-md">
      <Card className="w-full max-w-md bg-white border-b-[8px] border-blue-500 p-8 shadow-2xl relative overflow-hidden animate-pop min-h-[450px] flex flex-col">
        
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                <Icon name="user" size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">¿Quién eres?</h2>
              <p className="text-slate-500 font-bold text-sm">Selecciona tu perfil para continuar</p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleRoleSelect('student')}
                className="w-full flex items-center p-4 border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500 mr-4 group-hover:scale-110 transition-transform">
                  <Icon name="book" size={24} />
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-800 text-lg">Soy Alumno</div>
                  <div className="text-slate-500 text-xs font-bold">Quiero aprender y practicar</div>
                </div>
              </button>

              <button 
                onClick={() => handleRoleSelect('teacher')}
                className="w-full flex items-center p-4 border-2 border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-500 mr-4 group-hover:scale-110 transition-transform">
                  <Icon name="teacher" size={24} />
                </div>
                <div className="text-left">
                  <div className="font-black text-slate-800 text-lg">Soy Profesor</div>
                  <div className="text-slate-500 text-xs font-bold">Quiero gestionar mis clases</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center animate-fade-in">
            <button onClick={() => setStep(0)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600">
              <Icon name="arrow_right" className="rotate-180" size={24} />
            </button>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">¿En qué grado estás?</h2>
              <p className="text-slate-500 font-bold text-sm">Esto personalizará tus cursos disponibles.</p>
            </div>
            
            <div className="space-y-3">
              <button onClick={() => handleGradeSelect('3ro')} className="w-full py-4 px-6 border-2 border-slate-200 rounded-2xl font-black text-slate-700 text-lg hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all flex justify-between items-center">
                3ro de Secundaria <Icon name="arrow_right" size={20} />
              </button>
              <button onClick={() => handleGradeSelect('4to')} className="w-full py-4 px-6 border-2 border-slate-200 rounded-2xl font-black text-slate-700 text-lg hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all flex justify-between items-center">
                4to de Secundaria <Icon name="arrow_right" size={20} />
              </button>
              <button onClick={() => handleGradeSelect('5to')} className="w-full py-4 px-6 border-2 border-slate-200 rounded-2xl font-black text-slate-700 text-lg hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all flex justify-between items-center">
                5to de Secundaria <Icon name="arrow_right" size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col justify-center animate-fade-in">
            <button onClick={() => setStep(role === 'student' ? 1 : 0)} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600">
              <Icon name="arrow_right" className="rotate-180" size={24} />
            </button>
            
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
        )}

      </Card>
    </div>
  );
};
