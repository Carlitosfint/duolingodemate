import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix the topic title in infinite_map
target_title = '''                     <div>
                       <h3 className={`font-black uppercase tracking-widest text-sm ${currentThemeStyle.textPrimary}`}>Modo Infinito</h3>
                       <p className="text-xs font-bold text-slate-500">
                         {selectedTopic === 'metodos' ? 'Métodos Operativos' : selectedTopic === 'cripto' ? 'Criptoaritmética' : selectedTopic === 'logica' ? 'Lógica Recreativa' : selectedTopic === 'cronometria' ? 'Cronometría Básica' : 'Conteo de Figuras'}
                       </p>
                     </div>'''

# Let's extract the topic name by finding it in the arrays.
replacement_title = '''                     <div>
                       <h3 className={`font-black uppercase tracking-widest text-sm ${currentThemeStyle.textPrimary}`}>Modo Infinito</h3>
                       <p className="text-xs font-bold text-slate-500 capitalize">
                         {selectedTopic ? selectedTopic.replace(/_/g, ' ') : ''}
                       </p>
                     </div>'''
                     
# Wait, replacing with just selectedTopic.replace(/_/g, ' ') will look like "cronometria avanzada" instead of "Cronometría". It's better to just do a mapping. Let's do a map object.
replacement_title_better = '''                     <div>
                       <h3 className={`font-black uppercase tracking-widest text-sm ${currentThemeStyle.textPrimary}`}>Modo Infinito</h3>
                       <p className="text-xs font-bold text-slate-500">
                         {{
                           'metodos': 'Métodos Operativos',
                           'cripto': 'Criptoaritmética',
                           'logica': 'Lógica Recreativa',
                           'cronometria': 'Cronometría Básica',
                           'conteo': 'Conteo de Figuras',
                           'edades': 'Edades',
                           'cronometria_avanzada': 'Cronometría Avanzada',
                           'logica_inferencial': 'Lógica Inferencial',
                           'mezclas_aleaciones': 'Fracciones y Mezclas',
                           'matematica_financiera': 'Mate Financiera',
                           'planteo_ecuaciones': 'Planteo de Ecuaciones',
                           'propiedades_rt': 'Propiedades de las RT',
                           'resolucion_triangulos': 'Resolución de Triángulos',
                           'angulos_verticales': 'Ángulos Verticales',
                           'geometria_analitica': 'Geometría Analítica',
                           'angulos_posicion_normal': 'Ángulos en Posición Normal'
                         }[selectedTopic] || 'Modo Infinito'}
                       </p>
                     </div>'''

content = content.replace(target_title, replacement_title_better)

# Fix generateMathProblem calls
target_gen_1 = '''                            const prob = generateMathProblem(false, selectedTopic, step);
                            setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });'''
replacement_gen_1 = '''                            const prob = generateMathProblem(false, selectedTopic, step, activeCourse);
                            setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });'''

content = content.replace(target_gen_1, replacement_gen_1)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("App.tsx patched")
