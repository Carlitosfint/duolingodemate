with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("      </main>\n      </div>\n      )}\n      </AnimatePresence>", "      </main>\n      </PageReveal>\n      )}\n      </AnimatePresence>")

with open('src/App.tsx', 'w') as f:
    f.write(content)
