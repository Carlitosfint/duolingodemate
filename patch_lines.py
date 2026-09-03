import sys

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

def replace_line(num, search, replace):
    if search in lines[num - 1]:
        lines[num - 1] = lines[num - 1].replace(search, replace)
    else:
        print(f"Warning: could not find '{search}' on line {num}")

# main-app
replace_line(987, '<motion.div key="main-app"', '<PageReveal key="main-app"')
replace_line(987, 'initial={{ opacity: 0, scale: 0.98, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -15 }} transition={{ duration: 0.3, ease: "easeOut" }} ', '')
replace_line(1362, '</motion.div>', '</PageReveal>')

# exercise-app
replace_line(1364, '<motion.div key="exercise-app"', '<PageReveal key="exercise-app" isFullScreen')
replace_line(1364, 'initial={{ opacity: 0, scale: 0.98, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -15 }} transition={{ duration: 0.3, ease: "easeOut" }} ', '')
replace_line(1578, '</motion.div>', '</PageReveal>')

# map
replace_line(1035, '<motion.div key="map"', '<PageReveal key="map"')
replace_line(1035, 'initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} ', '')
replace_line(1070, '</motion.div>', '</PageReveal>')

# codice
replace_line(1074, '<motion.div key="codice"', '<PageReveal key="codice"')
replace_line(1074, 'initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} ', '')
replace_line(1076, '</motion.div>', '</PageReveal>')

# album
replace_line(1080, '<motion.div key="album"', '<PageReveal key="album"')
replace_line(1080, 'initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} ', '')
replace_line(1087, '</motion.div>', '</PageReveal>')

# shop
replace_line(1091, '<motion.div key="shop"', '<PageReveal key="shop"')
replace_line(1091, 'initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} ', '')
replace_line(1218, '</motion.div>', '</PageReveal>')

# mistakes
replace_line(1222, '<motion.div key="mistakes"', '<PageReveal key="mistakes"')
replace_line(1222, 'initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} ', '')
replace_line(1224, '</motion.div>', '</PageReveal>')

# profile
replace_line(1228, '<motion.div key="profile"', '<PageReveal key="profile"')
replace_line(1228, 'initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} ', '')
replace_line(1237, '</motion.div>', '</PageReveal>')

# teacher
replace_line(1241, '<motion.div key="teacher"', '<PageReveal key="teacher"')
replace_line(1241, 'initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} ', '')
replace_line(1249, '</motion.div>', '</PageReveal>')

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
