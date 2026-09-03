import re

with open("src/App.tsx", "r") as f:
    content = f.read()

bad_string = "xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e"
good_string = bad_string.replace("'", "\\'")
content = content.replace(bad_string, good_string)

with open("src/App.tsx", "w") as f:
    f.write(content)
