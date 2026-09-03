import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update PageReveal signature
content = content.replace(
    "export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean }> = ({ children, className, isFullScreen = false }) => {",
    "export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean, bgClass?: string }> = ({ children, className, isFullScreen = false, bgClass = 'bg-slate-50' }) => {"
)

# 2. Update timings
content = content.replace(
    "const t1 = setTimeout(() => {\n      setPhase(1);\n    }, 3500);",
    "const t1 = setTimeout(() => {\n      setPhase(1);\n    }, 1000);"
)
content = content.replace(
    "const t2 = setTimeout(() => {\n      setPhase(2);\n    }, 3500 + 1500);",
    "const t2 = setTimeout(() => {\n      setPhase(2);\n    }, 1000 + 800);"
)

# 3. Update radius formula
content = content.replace(
    "`circle(${25 - i * 5}vmin at ${clickPos.x}px ${clickPos.y}px)`",
    "`circle(${35 - i * 2.5}vmin at ${clickPos.x}px ${clickPos.y}px)`"
)

# 4. Update 6th layer style and className
old_6th_layer_start = """      <motion.div
        initial={{ clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)` }}"""
new_6th_layer_start = """      <motion.div
        className={`absolute inset-0 z-20 flex flex-col ${bgClass}`}
        initial={{ clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)` }}"""

content = content.replace(old_6th_layer_start, new_6th_layer_start)

old_6th_layer_style = """        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          pointerEvents: phase === 2 ? 'auto' : 'none',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          clipPath: phase === 2 ? 'none' : undefined,
        }}"""
new_6th_layer_style = """        style={{
          pointerEvents: phase === 2 ? 'auto' : 'none',
          clipPath: phase === 2 ? 'none' : undefined,
        }}"""

content = content.replace(old_6th_layer_style, new_6th_layer_style)

# 5. Update main-app key and pass bgClass
content = content.replace(
    """<PageReveal key="main-app" className="max-w-[1600px] xl:max-w-[1850px] w-full px-4 lg:px-6 xl:px-10 mx-auto flex flex-col lg:flex-row landscape:flex-row gap-4 lg:gap-6 landscape:gap-3 h-[calc(100vh-2rem)] z-30 relative landscape-mini">""",
    """<PageReveal key={`main-app-${viewMode}`} bgClass={currentThemeStyle.bgClass} className="max-w-[1600px] xl:max-w-[1850px] w-full px-4 lg:px-6 xl:px-10 mx-auto flex flex-col lg:flex-row landscape:flex-row gap-4 lg:gap-6 landscape:gap-3 h-[calc(100vh-2rem)] z-30 relative landscape-mini">"""
)

# Update exercise-app key and pass bgClass
content = content.replace(
    """<PageReveal key="exercise-app" isFullScreen className="w-full relative z-30 max-w-[1400px] mx-auto landscape-mini">""",
    """<PageReveal key="exercise-app" bgClass={currentThemeStyle.bgClass} isFullScreen className="w-full relative z-30 max-w-[1400px] mx-auto landscape-mini">"""
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
