import re

with open('src/components/DictLabModal.tsx', 'r') as f:
    content = f.read()

target = '''            {activeCourse === 'razonamiento_5to' && activeTab === 'logica' && (
              <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200 shadow-sm">
                <h4 className="font-black text-purple-900 text-xl mb-3 flex items-center gap-2">🧠 Lógica Inferencial</h4>
                <p className="text-purple-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Conectores lógicos, tablas de verdad y deducciones. ¡Piensa como un detective!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                  <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                    <strong className="text-purple-700">Condicional (p → q):</strong><br/> 
                    Solo es FALSO cuando el antecedente (p) es Verdadero y el consecuente (q) es Falso (V → F = F).
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                    <strong className="text-purple-700">Equivalencia Clave:</strong><br/>
                    (p → q) es lógicamente equivalente a (~p ∨ q). ¡Úsalo para simplificar esquemas largos!
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm md:col-span-2">
                    <strong className="text-purple-700">Silogismos y Cuadros de Decisiones:</strong> Si el problema tiene personas, profesiones y colores, dibuja una tabla de doble entrada. ¡Usa ✔️ y ❌ y rellena los vacíos!
                  </div>
                </div>
              </div>
            )}'''

replacement = '''            {activeCourse === 'razonamiento_5to' && activeTab === 'logica' && (
              <div className="space-y-6">
                <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-200 shadow-sm">
                  <h4 className="font-black text-purple-900 text-2xl mb-3 flex items-center gap-2">🧠 Lógica Inferencial</h4>
                  <p className="text-purple-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                    La lógica proposicional nos permite deducir conclusiones a partir de proposiciones (p, q, r) mediante conectores lógicos. ¡Conocer sus valores de verdad es la clave para resolver cualquier deducción!
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base mb-4">
                    {/* Negación */}
                    <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-purple-700 text-lg">Negación (~p)</strong>
                        <span className="text-2xl font-black text-purple-300">~</span>
                      </div>
                      <p className="text-slate-600 mb-2">Cambia el valor de verdad de la proposición a su opuesto.</p>
                      <ul className="list-disc pl-5 text-slate-500 font-medium">
                        <li>Si p es <b>V</b> ➔ ~p es <b className="text-red-500">F</b></li>
                        <li>Si p es <b>F</b> ➔ ~p es <b className="text-emerald-500">V</b></li>
                      </ul>
                    </div>

                    {/* Conjunción */}
                    <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-purple-700 text-lg">Conjunción (p ∧ q)</strong>
                        <span className="text-2xl font-black text-purple-300">∧</span>
                      </div>
                      <p className="text-slate-600 mb-2">Representa la palabra <b>"y"</b>. Todo debe cumplirse.</p>
                      <div className="bg-purple-50 p-2 rounded-lg text-center font-bold text-purple-700 border border-purple-100">
                        Solo es <b className="text-emerald-600">VERDADERO (V)</b> si AMBAS (p y q) son verdaderas.
                      </div>
                    </div>

                    {/* Disyunción */}
                    <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-purple-700 text-lg">Disyunción (p ∨ q)</strong>
                        <span className="text-2xl font-black text-purple-300">∨</span>
                      </div>
                      <p className="text-slate-600 mb-2">Representa la palabra <b>"o"</b>. Basta con que una se cumpla.</p>
                      <div className="bg-purple-50 p-2 rounded-lg text-center font-bold text-purple-700 border border-purple-100">
                        Solo es <b className="text-red-500">FALSO (F)</b> si AMBAS (p y q) son falsas.
                      </div>
                    </div>

                    {/* Condicional */}
                    <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-purple-700 text-lg">Condicional / Direccional (p → q)</strong>
                        <span className="text-2xl font-black text-purple-300">→</span>
                      </div>
                      <p className="text-slate-600 mb-2">Representa el <b>"Si p, entonces q"</b>.</p>
                      <div className="bg-purple-50 p-2 rounded-lg text-center font-bold text-purple-700 border border-purple-100">
                        Solo es <b className="text-red-500">FALSO (F)</b> si se parte de una verdad para llegar a una falsedad (V → F = F).
                      </div>
                    </div>

                    {/* Bicondicional */}
                    <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-purple-700 text-lg">Bicondicional / Bidireccional (p ↔ q)</strong>
                        <span className="text-2xl font-black text-purple-300">↔</span>
                      </div>
                      <p className="text-slate-600 mb-2">Representa el <b>"Sí y solo sí"</b>. Ambas son un reflejo.</p>
                      <div className="bg-purple-50 p-2 rounded-lg text-center font-bold text-purple-700 border border-purple-100">
                        Es <b className="text-emerald-600">VERDADERO (V)</b> cuando ambas son iguales (V↔V ó F↔F).
                      </div>
                    </div>

                    {/* Tips Clave */}
                    <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-purple-800 mb-2">💡 Tips Clave de Simplificación:</h5>
                      <ul className="list-disc pl-5 text-slate-600 text-sm space-y-1">
                        <li><b>Equivalencia Condicional:</b> <code className="bg-slate-100 px-1 rounded text-pink-600">(p → q) ≡ (~p ∨ q)</code></li>
                        <li><b>Leyes de Morgan:</b> <code className="bg-slate-100 px-1 rounded text-pink-600">~(p ∧ q) ≡ ~p ∨ ~q</code> y <code className="bg-slate-100 px-1 rounded text-pink-600">~(p ∨ q) ≡ ~p ∧ ~q</code></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}'''

content_new = content.replace(target, replacement)
if content_new == content:
    print("Replace failed")
else:
    with open('src/components/DictLabModal.tsx', 'w') as f:
        f.write(content_new)
    print("Success")

