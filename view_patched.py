import sys

with open('src/App.tsx.patched', 'r') as f:
    patched = f.read()

start_marker = "const TabTransition:"
end_marker = "export default function App() {"

start_idx = patched.find(start_marker)
end_idx = patched.find(end_marker, start_idx)

print(patched[start_idx:end_idx])
