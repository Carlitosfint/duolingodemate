import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

tabs = [
  ("map", "swipe"),
  ("codice", "blocks"),
  ("album", "diagonal"),
  ("shop", "swipe"),
  ("mistakes", "blocks"),
  ("profile", "diagonal"),
  ("teacher", "swipe"),
]

for tab, ttype in tabs:
    # Find {viewMode === '{tab}' && (
    start_str = f"{{viewMode === '{tab}' && ("
    start_idx = content.find(start_str)
    if start_idx == -1:
        continue
    
    # Replace the start
    new_start_str = f"{{viewMode === '{tab}' && (<TabTransition type=\"{ttype}\" key=\"{tab}\">"
    content = content[:start_idx] + new_start_str + content[start_idx + len(start_str):]
    
    # We need to find the matching `)}` that closes this tab content.
    # It will be right before the next `{viewMode === '` or right before `</AnimatePresence>`
    
    # Find the next tab or end of AnimatePresence
    next_tab_idx = len(content)
    # Look for `{viewMode === '` after start_idx + len(new_start_str)
    next_view_idx = content.find("{viewMode === '", start_idx + len(new_start_str))
    end_anim_idx = content.find("</AnimatePresence>", start_idx + len(new_start_str))
    
    if next_view_idx != -1 and next_view_idx < end_anim_idx:
        next_tab_idx = next_view_idx
    else:
        next_tab_idx = end_anim_idx
        
    # Now find the last `)}` before next_tab_idx
    last_brace_idx = content.rfind(")}", start_idx, next_tab_idx)
    if last_brace_idx != -1:
        content = content[:last_brace_idx] + "</TabTransition>)}" + content[last_brace_idx + 2:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

