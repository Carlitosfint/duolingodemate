with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("});ion.div>\n    </motion.div>\n  );\n};\n", "});\n\n")

with open('src/App.tsx', 'w') as f:
    f.write(content)
