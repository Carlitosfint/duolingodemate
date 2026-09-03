with open("src/db/schema.ts", "r") as f:
    content = f.read()

content = content.replace("  setupCompleted: boolean('setup_completed').default(false),", "  setupCompleted: boolean('setup_completed').default(false),\n  classroom: text('classroom').default(''),")

with open("src/db/schema.ts", "w") as f:
    f.write(content)
