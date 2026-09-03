import React from 'react';
import { RazonamientoContent } from './codice/RazonamientoContent';
import { Razonamiento5toContent } from './codice/Razonamiento5toContent';
import { TrigonometriaContent } from './codice/TrigonometriaContent';
import { Geometria5toContent } from './codice/Geometria5toContent';

interface Props {
  activeCourse: string;
  activeTab: string;
}

export const DictLabContent: React.FC<Props> = ({ activeCourse, activeTab }) => {
  return (
    <div className="w-full h-full flex flex-col justify-start gap-4 pb-10">
      {activeCourse === 'razonamiento' && <RazonamientoContent tab={activeTab} />}
      {activeCourse === 'razonamiento_5to' && <Razonamiento5toContent tab={activeTab} />}
      {activeCourse === 'trigonometria' && <TrigonometriaContent tab={activeTab} />}
      {activeCourse === 'geometria_5to' && <Geometria5toContent tab={activeTab} />}
    </div>
  );
};
