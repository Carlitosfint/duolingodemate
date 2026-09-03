import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace Avatars
content = content.replace('["🦊", "🦁", "🐨", "🐼"]', '["fox", "dog", "cat", "bird"]')

# Replace Menu Icons (Sidebar)
content = content.replace('<span className="text-2xl relative z-10">🏠</span>', '<Icon name="home" className="relative z-10" />')
content = content.replace('<span className="text-2xl relative z-10">📖</span>', '<Icon name="book" className="relative z-10" />')
content = content.replace('<span className="text-2xl relative z-10">📂</span>', '<Icon name="folder" className="relative z-10" />')
content = content.replace('<span className="text-2xl relative z-10">🏪</span>', '<Icon name="store" className="relative z-10" />')
content = content.replace('<span className="text-2xl relative z-10">👤</span>', '<Icon name="user" className="relative z-10" />')
content = content.replace('<span className="text-2xl relative z-10">👩‍🏫</span>', '<Icon name="teacher" className="relative z-10" />')

# Mobile Bottom Nav
content = content.replace('<span className="text-xl">🏠</span>', '<Icon name="home" />')
content = content.replace('<span className="text-xl">📖</span>', '<Icon name="book" />')
content = content.replace('<span className="text-xl">📂</span>', '<Icon name="folder" />')
content = content.replace('<span className="text-xl">🏪</span>', '<Icon name="store" />')
content = content.replace('<span className="text-xl">👤</span>', '<Icon name="user" />')

import_marker = "import { THEME_STYLES } from './data';"
content = content.replace(import_marker, import_marker + "\nimport { Icon } from './components/CustomIcons';")

# Replace avatar rendering in login screen
avatar_start = 'className={`p-4 rounded-2xl border-2 text-4xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer indestructible-btn ${loginAvatar === av ? \'bg-blue-50 border-blue-500 shadow-inner\' : \'bg-slate-50 border-slate-200\'}`}'
avatar_end = '</button>'

# We need to replace the content inside the avatar button
# from `> {av} </button>` to `> <Icon name={av} size={40} className="text-slate-600" /> </button>`
import re
content = re.sub(r'className={`p-4 rounded-2xl border-2 text-4xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer indestructible-btn \${loginAvatar === av \? \'bg-blue-50 border-blue-500 shadow-inner\' : \'bg-slate-50 border-slate-200\'}`}\s*>\s*\{av\}\s*</button>',
    'className={`p-4 rounded-2xl border-2 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer indestructible-btn ${loginAvatar === av ? \'bg-blue-50 border-blue-500 shadow-inner text-blue-500\' : \'bg-slate-50 border-slate-200 text-slate-500\'}`}\n                  >\n                    <Icon name={av} size={40} />\n                  </button>', content)

# Avatar rendering in header
content = re.sub(r'<div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xl md:text-2xl cursor-pointer hover:scale-105 transition-transform \${currentThemeStyle\.cardBg}`}\s*onClick=\{([^}]+)\}\s*>\s*\{user\.avatar\}\s*</div>',
    '<div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ${currentThemeStyle.cardBg} ${currentThemeStyle.textPrimary}`} onClick={\\1}>\n                       <Icon name={user.avatar} size={24} />\n                     </div>', content)
    
# Replace the pet emoji in background
content = re.sub(r'\{equipedPet\.emoji\}', '<Icon name={equipedPet.emoji} size={150} className="text-slate-500" />', content)

# Remove pet emoji in equipped text
content = content.replace('{equipedPet.emoji} {equipedPet.name}', '<div className="flex gap-2 items-center"><Icon name={equipedPet.emoji} size={18} /> {equipedPet.name}</div>')
content = content.replace('{pet.emoji} {pet.name}', '<div className="flex gap-2 items-center"><Icon name={pet.emoji} size={18} /> {pet.name}</div>')
content = content.replace('{buff.emoji}', '<Icon name={buff.emoji} size={32} />')
content = content.replace('{buff.emoji} {buff.name}', '<div className="flex gap-2 items-center"><Icon name={buff.emoji} size={18} /> {buff.name}</div>')

# Replace Shop Items emoji inside App.tsx
# "🪙 500" -> "<div className="flex items-center gap-1"><Icon name="coins" size={16} /> 500</div>"
content = re.sub(r'🪙 (\d+)', '<div className="flex items-center justify-center gap-1"><Icon name="coins" size={18} /> \\1</div>', content)
content = re.sub(r'🪙(\d+)', '<div className="flex items-center justify-center gap-1"><Icon name="coins" size={18} /> \\1</div>', content)
content = content.replace('🎟️', '<Icon name="ticket" size={18} className="inline-block -mt-1" />')

# Fix inline emojis
content = content.replace('🎨 Estilos Visuales', '<span className="flex items-center gap-2"><Icon name="sparkles" className="text-blue-500" size={24} /> Estilos Visuales</span>')
content = content.replace('{style.emoji}', '<Icon name={style.emoji} size={40} className="opacity-50" />')
content = content.replace('🏆 Tus Trofeos', '<span className="flex items-center gap-2"><Icon name="crown" className="text-yellow-500" size={24} /> Tus Trofeos</span>')
content = content.replace('🔥 Racha:', '<span className="flex items-center gap-1"><Icon name="fire" className="text-orange-500" size={20} /> Racha:</span>')
content = content.replace('⭐ Resueltos:', '<span className="flex items-center gap-1"><Icon name="star" className="text-yellow-500" size={20} /> Resueltos:</span>')
content = content.replace('📈 Rendimiento', '<span className="flex items-center gap-2"><Icon name="trending_up" className="text-green-500" size={24} /> Rendimiento</span>')
content = content.replace('🎯 Precisión:', '<span className="flex items-center gap-1"><Icon name="target" className="text-red-500" size={20} /> Precisión:</span>')

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done app")
