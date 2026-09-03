import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_marker = "<button \n            onClick={() => setViewMode('map')} \n            className=\"mb-4 text-white font-bold"
start_idx = content.find(start_marker)

if start_idx == -1:
    print("Could not find start_marker")
    sys.exit(1)

end_marker = "<header className={`max-w-5xl mx-auto w-full flex flex-row justify-between items-center gap-1.5 md:gap-2 mb-4 z-30 relative shrink-0 transition-all duration-300`}>"
end_idx = content.find(end_marker, start_idx)

if end_idx == -1:
    print("Could not find end_marker")
    sys.exit(1)

new_content = content[:start_idx] + end_marker + content[end_idx + len(end_marker):]

with open('src/App.tsx', 'w') as f:
    f.write(new_content)

print("Done")
