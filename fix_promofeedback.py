import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const [promoFeedback, setPromoFeedback] = useState("");',
    'const [promoFeedback, setPromoFeedback] = useState<React.ReactNode>("");'
)

# Fix the template literal and quotes
content = content.replace(
    'setPromoFeedback(`<Icon name="check" className="inline-block" size={18} /> ¡Código Válido! Recibes +${bonusCoins} Monedas 🪙`);',
    'setPromoFeedback(<span className="flex items-center gap-1"><Icon name="check" className="text-green-500" size={18} /> ¡Código Válido! Recibes +{bonusCoins} <Icon name="coins" size={18} /></span>);'
)

content = content.replace(
    'setPromoFeedback("<Icon name="x" className="inline-block" size={18} /> Código Inválido o ya canjeado.");',
    'setPromoFeedback(<span className="flex items-center gap-1"><Icon name="x" className="text-red-500" size={18} /> Código Inválido o ya canjeado.</span>);'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done promofeedback")
