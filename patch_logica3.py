import re

with open('src/utils/math_razonamiento_5to.ts', 'r') as f:
    content = f.read()

target = r"visualData = \{\s*type:\s*'latex',\s*latex:\s*`p \\quad \$\{op_symbol\} \\quad q`,\s*size:\s*'large'\s*\};"

replacement = '''    const symbol_map: Record<number, string> = { 0: "∧", 1: "∨", 2: "→", 3: "↔" };
    visualData = {
      type: 'logic',
      p: p_str,
      q: q_str,
      op_symbol: symbol_map[op],
      op_name: op_name
    };'''

content_new = re.sub(target, replacement, content, flags=re.DOTALL)
if content_new == content:
    print("regex failed")
else:
    with open('src/utils/math_razonamiento_5to.ts', 'w') as f:
        f.write(content_new)
    print("success")

