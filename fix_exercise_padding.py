import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add padding to the exercise screen container
content = content.replace(
    '<PageReveal key="exercise-app" bgClass={currentThemeStyle.bgClass} isFullScreen className="w-full relative z-30 max-w-[1400px] mx-auto landscape-mini">',
    '<PageReveal key="exercise-app" bgClass={currentThemeStyle.bgClass} isFullScreen className="w-full relative z-30 max-w-[1400px] mx-auto landscape-mini p-4 pb-24 md:p-6 md:pb-32 lg:p-8">'
)

# And make sure the inner div in PageReveal uses height: '100%' appropriately, or just rely on flex: 1
content = content.replace(
    "style={{ flex: 1, width: '100%', height: '100%', position: 'relative', zIndex: 1, overflowY: 'auto', overflowX: 'hidden' }}",
    "style={{ flex: 1, width: '100%', position: 'relative', zIndex: 1, overflowY: 'auto', overflowX: 'hidden' }}"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

