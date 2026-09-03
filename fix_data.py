import sys

with open('src/data.ts', 'r') as f:
    content = f.read()

replacements = {
    '"🪙"': '"coins"',
    '"🎟️"': '"ticket"',
    '"💰"': '"money_bag"',
    '"🎫"': '"coupon"',
    '"💎"': '"diamond"',
    '"👑"': '"crown"',
    
    "'💵'": "'cash'",
    "'🗄️'": "'safe'",
    "'🧈'": "'gold_bar'",
    "'📈'": "'trending_up'",
    
    "'✨'": "'sparkles'",
    "'🐂'": "'bull'",
    "'🐱'": "'cat'",
    "'🦉'": "'owl'",
    "'🦊'": "'fox'",
    
    "'📉'": "'trending_down'",
    "'🏛️'": "'bank'",
    "'💸'": "'flying_money'",
    
    "'⚡'": "'zap'",
    
    "'🌱'": "'sprout'",
    "'🔥'": "'fire'",
    "'🎯'": "'target'",
    "'🏦'": "'bank'"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('src/data.ts', 'w') as f:
    f.write(content)

print("Done data")
