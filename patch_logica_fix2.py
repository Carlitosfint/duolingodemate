import re

with open('src/utils/math_razonamiento_5to.ts', 'r') as f:
    content = f.read()

target = r"(\s*\n)(\s*export function generateMezclasAleaciones)"

replacement = r'''\1
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

\2'''

content_new = re.sub(target, replacement, content)

with open('src/utils/math_razonamiento_5to.ts', 'w') as f:
    f.write(content_new)

print("Patched return again")
