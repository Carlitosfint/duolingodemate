import re

with open('src/index.css', 'r') as f:
    content = f.read()

btn_css = """
.indestructible-btn {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.indestructible-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  filter: brightness(1.05);
}

.indestructible-btn:active {
  transform: scale(0.95);
  transition: transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
"""

content = re.sub(r'\.indestructible-btn \{.*?(?=\n\n|\Z)', btn_css.strip(), content, flags=re.DOTALL)

with open('src/index.css', 'w') as f:
    f.write(content)

