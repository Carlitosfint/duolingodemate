import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

start = content.find("export const PageReveal")
end = content.find("export default function App", start)
print(content[start:end])
