import re

with open("src/components/DictLabModal.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "<AnimatePresence mode=\"wait\">" in line:
        new_lines.append(line)
        new_lines.append("""          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <DictLabContent activeCourse={activeCourse || 'razonamiento'} activeTab={activeTab} />
          </motion.div>
""")
        skip = True
    elif "</AnimatePresence>" in line:
        skip = False
        new_lines.append(line)
    elif not skip:
        new_lines.append(line)

with open("src/components/DictLabModal.tsx", "w") as f:
    f.writelines(new_lines)
print("AnimatePresence patched")
