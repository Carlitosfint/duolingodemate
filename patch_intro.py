import re

with open("src/utils/math_razonamiento_5to.ts", "r") as f:
    content = f.read()

old_intro = """intro = `Completa la matriz principal de la tabla de verdad para la fórmula lógica mostrada.

*(Escribe los 4 valores de arriba hacia abajo, por ejemplo: VFVF)*`;"""

new_intro = """intro = `Completa la matriz principal de la tabla de verdad para la fórmula lógica mostrada.`;"""

if old_intro in content:
    content = content.replace(old_intro, new_intro)
    with open("src/utils/math_razonamiento_5to.ts", "w") as f:
        f.write(content)
    print("Patched intro successfully")
else:
    print("Could not find intro")
