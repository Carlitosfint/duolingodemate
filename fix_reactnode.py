import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("text: string }>", "text: React.ReactNode }>")
content = content.replace("text: \"\"", "text: null")

content = content.replace(
    'let boostText = extraTickets > 0 ? ` [¡SUPERNOVA! +${extraTickets} <Icon name="ticket" size={18} className="inline-block -mt-1" />]` : "";',
    'let boostText = extraTickets > 0 ? <span className="inline-flex items-center gap-1 text-purple-600">[¡SUPERNOVA! +{extraTickets} <Icon name="ticket" size={18} />]</span> : null;'
)
content = content.replace(
    'let goldenText = currentProblem.data.isGolden ? " <Icon name=\\"star\\" size={18} className=\\"inline-block\\" /> ¡DESAFÍO GOLDEN COMPLETO!" : "";',
    'let goldenText = currentProblem.data.isGolden ? <span className="inline-flex items-center gap-1 text-yellow-500"><Icon name="star" size={18} /> ¡DESAFÍO GOLDEN COMPLETO!</span> : null;'
)

# Correct string literal
content = content.replace(
    'text: `¡Correcto! +${coinsEarned} 🪙 | +${ticketsEarned} <Icon name="ticket" size={18} className="inline-block -mt-1" />.${speedText}${boostText}${goldenText}`',
    'text: <span className="flex items-center gap-1 flex-wrap justify-center">¡Correcto! +{coinsEarned} <Icon name="coins" size={18} /> | +{ticketsEarned} <Icon name="ticket" size={18} /> {speedText} {boostText} {goldenText}</span>'
)

content = content.replace(
    'text: `<Icon name="x" className="inline-block" size={18} /> Respuesta incorrecta. ¡Tu Escudo te protegió y salvó tu racha de <Icon name="fire" className="inline-block" size={18} /> ${streak}!`',
    'text: <span className="flex items-center gap-1 flex-wrap justify-center"><Icon name="x" size={18} /> Respuesta incorrecta. ¡Tu Escudo te protegió y salvó tu racha de <Icon name="fire" size={18} /> {streak}!</span>'
)

content = content.replace(
    'text: `<Icon name="x" className="inline-block" size={18} /> Incorrecto. La respuesta era ${correctVal}%. ¡Vuelve a intentarlo!`',
    'text: <span className="flex items-center gap-1 flex-wrap justify-center"><Icon name="x" size={18} /> Incorrecto. La respuesta era {correctVal}%. ¡Vuelve a intentarlo!</span>'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)


with open('src/components/DictLabModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'isInline ? "Inicio" : "Entendido <Icon name=\\"check\\" size={18} className=\\"inline-block\\" />"',
    'isInline ? "Inicio" : <span className="flex items-center gap-1">Entendido <Icon name="check" size={18} /></span>'
)

with open('src/components/DictLabModal.tsx', 'w') as f:
    f.write(content)


with open('src/components/TeacherModeModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'setAiText("El tutor está analizando la pizarra con tiza y calculadora... <Icon name=\\"book\\" size={18} className=\\"inline-block\\" />️");',
    'setAiText(<span className="flex items-center gap-1">El tutor está analizando la pizarra con tiza y calculadora... <Icon name="book" size={18} /></span>);'
)
content = content.replace(
    'useState<string | null>("¡Hola!',
    'useState<React.ReactNode>("¡Hola!'
)
content = content.replace(
    'useState<string>("¡Hola!',
    'useState<React.ReactNode>("¡Hola!'
)

with open('src/components/TeacherModeModal.tsx', 'w') as f:
    f.write(content)

print("Done reactnode")
