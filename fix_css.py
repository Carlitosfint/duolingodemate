import re

with open('src/index.css', 'r') as f:
    content = f.read()

new_css = """
.indestructible-btn {
  position: relative !important;
  z-index: 99999 !important;
  pointer-events: auto !important;
  touch-action: manipulation !important;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease-out, filter 0.2s !important;
}

.indestructible-btn:hover {
  transform: scale(1.05) !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
}

.indestructible-btn:active {
  transform: scale(0.95) !important;
  transition: transform 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55) !important;
}
"""

content = re.sub(r'\.indestructible-btn \{[^}]+\}', new_css.strip(), content)

with open('src/index.css', 'w') as f:
    f.write(content)
