import sys

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "const buyShopItem = (item: ShopItem) => {" in line:
        skip = True
    if skip and "};" in line and i > 479:
        if i <= 488:
            skip = False
            continue
            
    if "const purchasePet = (pet: PetBuff) => {" in line:
        skip = True
    if skip and "};" in line and i > 458:
        if i <= 471:
            skip = False
            continue
            
    if not skip:
        new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)

