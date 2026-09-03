import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace <motion.div key="map" ... className="...">
pattern = r'<motion\.div key="([^"]+)" initial=\{\{.*?\}\} animate=\{\{.*?\}\} exit=\{\{.*?\}\} transition=\{\{.*?\}\} className="([^"]+)">'
replacement = r'<PageReveal key="\1" className="\2">'
content = re.sub(pattern, replacement, content)

# But wait, we also have to replace </motion.div> with </PageReveal> for those specific ones.
# Because motion.div might be used elsewhere, let's just do it carefully.
# Actually, the only ones with that exact initial/animate/exit signature are the viewMode views!
# Let's verify how many motion.div were replaced, and how to replace the closing tags.
