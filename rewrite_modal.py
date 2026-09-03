import re

with open("src/components/DictLabModal.tsx", "r") as f:
    content = f.read()

tabs_pattern = r"const allTabs: any = \{.*?\n  \};"

new_tabs = """const allTabs: any = {
    razonamiento_5to: [
      { id: 'edades', label: 'Edades', icon: '👨‍👦' },
      { id: 'cronometria', label: 'Cronometría', icon: '⏳' },
      { id: 'logica', label: 'Lógica Inferencial', icon: '🧠' },
      { id: 'mezclas', label: 'Fracciones y Mezclas', icon: '🧪' },
      { id: 'financiera', label: 'Mate Financiera', icon: '💰' },
      { id: 'planteo', label: 'Planteo Ecuaciones', icon: '📊' }
    ],
    trigonometria: [
      { id: 'rt', label: 'Propiedades RT', icon: '📐' },
      { id: 'triangulos', label: 'Resolución de Triángulos', icon: '📐' },
      { id: 'verticales', label: 'Ángulos Verticales', icon: '👀' },
      { id: 'geo_ana', label: 'Geometría Analítica', icon: '📍' },
      { id: 'pos_norm', label: 'Posición Normal', icon: '🔄' }
    ],
    razonamiento: [
      { id: 'metodos', label: 'Métodos Operativos', icon: '🧠' },
      { id: 'cripto', label: 'Criptoaritmética', icon: '🔢' },
      { id: 'logica', label: 'Lógica Recreativa', icon: '🎲' },
      { id: 'cronometria', label: 'Cronometría Bás.', icon: '⏱️' },
      { id: 'conteo', label: 'Conteo de Figuras', icon: '📐' }
    ],
    geometria_5to: [
      { id: 'metrica', label: 'Relaciones Métricas', icon: '📏' },
      { id: 'areas', label: 'Áreas de Regiones', icon: '📐' },
      { id: 'circulos', label: 'Superficies Circ.', icon: '⭕' },
      { id: 'espacio', label: 'Geometría Espacio', icon: '🧊' },
      { id: 'solidos', label: 'Sólidos y Poliedros', icon: '🎲' }
    ]
  };"""

content = re.sub(tabs_pattern, new_tabs, content, flags=re.DOTALL)

with open("src/components/DictLabModal.tsx", "w") as f:
    f.write(content)
print("Tabs rewritten")
