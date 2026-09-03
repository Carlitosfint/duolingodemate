import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace all occurrences of <GlobalRipple /> with empty string
content = content.replace("      <GlobalRipple />\n", "")
content = content.replace("      <GlobalRipple />", "")

# Then insert just ONE instance right before the final closing div of App
content = content.replace("    </div>\n  );\n}\n", "      <GlobalRipple />\n    </div>\n  );\n}\n")

with open('src/App.tsx', 'w') as f:
    f.write(content)

