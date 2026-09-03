with open("src/types.ts", "r") as f:
    content = f.read()

content = content.replace("  courseProgress?: Record<string, number>;", "  courseProgress?: Record<string, number>;\n  classroom?: string;")

with open("src/types.ts", "w") as f:
    f.write(content)
