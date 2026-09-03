import re

with open('src/utils/math_razonamiento_5to.ts', 'r') as f:
    content = f.read()

target = '''  }


export function generateMezclasAleaciones'''

replacement = '''  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Lógica Inferencial',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}

export function generateMezclasAleaciones'''

content = content.replace(target, replacement)

with open('src/utils/math_razonamiento_5to.ts', 'w') as f:
    f.write(content)

print("Patched return")
