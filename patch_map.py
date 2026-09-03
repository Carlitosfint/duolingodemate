import sys

with open('src/components/ProgressMap.tsx', 'r') as f:
    content = f.read()

old_div = """              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDragging && onNodeClick) {
                    onNodeClick(step);
                  }
                }}
                className={wrapperClass}
              >
                {innerContent}
              </div>"""

new_div = """              <motion.div 
                layoutId={isCurrent ? "current-node-marker" : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDragging && onNodeClick) {
                    onNodeClick(step);
                  }
                }}
                className={wrapperClass}
              >
                {innerContent}
              </motion.div>"""

content = content.replace(old_div, new_div)

with open('src/components/ProgressMap.tsx', 'w') as f:
    f.write(content)

