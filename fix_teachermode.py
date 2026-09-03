import re

with open('src/components/TeacherModeModal.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'setAiText\("El tutor está analizando la pizarra con tiza y calculadora.*?\"\);', 
                'setAiText(<span className="flex items-center gap-1">El tutor está analizando la pizarra con tiza y calculadora... <Icon name="book" size={18} /></span>);', content)

with open('src/components/TeacherModeModal.tsx', 'w') as f:
    f.write(content)

