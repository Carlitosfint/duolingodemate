import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_ex_container = """      ) : (
        <div className="w-full relative z-30 animate-slide-up max-w-[1400px] mx-auto">"""

new_ex_container = """      ) : (
        <div className="w-full relative z-30 animate-slide-up max-w-[1400px] mx-auto landscape-mini">"""

content = content.replace(old_ex_container, new_ex_container)

with open('src/App.tsx', 'w') as f:
    f.write(content)
