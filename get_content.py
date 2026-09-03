import re
with open('src/components/DictLabModal.tsx', 'r') as f:
    c = f.read()
print(c[c.find('<AnimatePresence'):c.rfind('</AnimatePresence>')+18])
