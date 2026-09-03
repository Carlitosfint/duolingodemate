import sys
import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Remove Tienda de Poderes
pattern_poderes = r"\s*\{\/\*\s*Poderes Desplegados a la Izquierda.*?\s*\}\s*<div className=\"bg-white\/95 backdrop-blur-xl rounded-\[2rem\] border-\[3px\] border-amber-200.*?<\/div>"
content = re.sub(pattern_poderes, "", content, flags=re.DOTALL)

# 2. Remove Tienda Integrada
pattern_tienda_integrada = r"\s*\{\/\*\s*Tienda Integrada: Todo desplegado\s*\*\/\}\s*<div className=\"bg-white\/95 backdrop-blur-xl rounded-\[2\.5rem\] border-\[4px\] border-slate-200.*?Activo\s*<\/span>\s*\)\s*:\s*\(\s*<span.*?<\/span>\s*\)\s*\}\s*<\/div>\s*<\/button>\s*\);\s*\}\)\}\s*<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>"
# Actually regex dotall for the integrated shop might be tricky because of nested divs.
