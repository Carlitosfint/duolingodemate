import sys

with open('src/components/CustomIcons.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { \n", "import { Hash, ArrowRight, X, Sparkles as Sparkles2, Check as Check2, \n")
content = content.replace("default: return <Star", """
    case 'hash': return <Hash {...iconProps} />;
    case 'arrow_right': return <ArrowRight {...iconProps} />;
    case 'x': return <X {...iconProps} />;
    case 'check': return <Check2 {...iconProps} />;
    default: return <Star""")

with open('src/components/CustomIcons.tsx', 'w') as f:
    f.write(content)

