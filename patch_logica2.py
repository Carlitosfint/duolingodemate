import re

with open('src/utils/math_razonamiento_5to.ts', 'r') as f:
    content = f.read()

target = '''    visualData = {
      type: 'latex',
      latex: `p \\\\quad ${op_symbol} \\\\quad q`,
      size: 'large'
    };'''

replacement = '''    // Uso un type custom para renderizar la formula lógica en grande
    const symbol_map = { 0: "∧", 1: "∨", 2: "→", 3: "↔" };
    visualData = {
      type: 'logic',
      p: p_str,
      q: q_str,
      op_symbol: symbol_map[op],
      op_name: op_name
    };'''

content = content.replace(target, replacement)

with open('src/utils/math_razonamiento_5to.ts', 'w') as f:
    f.write(content)

print("Patched math")
