import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the views inside the Main Content Area
old_views_start = """           {/* Main Content Area */}
           <div className={`flex-1 rounded-[2.5rem] border-2 shadow-sm relative overflow-hidden flex flex-col ${currentThemeStyle.bentoBg}`}>
              
              {viewMode === 'map' && (
                <>
                  {/* Map Header */}"""

new_views_start = """           {/* Main Content Area */}
           <div className={`flex-1 rounded-[2.5rem] border-2 md:border-[3px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col ${currentThemeStyle.bentoBg}`}>
              <AnimatePresence mode="wait">
              {viewMode === 'map' && (
                <motion.div key="map" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex-1 flex flex-col h-full relative z-10">
                  {/* Map Header */}"""

content = content.replace(old_views_start, new_views_start)

# Close the map
old_map_end = """                  </div>
                </>
              )}"""

new_map_end = """                  </div>
                </motion.div>
              )}"""

content = content.replace(old_map_end, new_map_end)

# Modify Codice
old_codice = """              {viewMode === 'codice' && (
                <div className="flex-1 relative bg-white/50 overflow-hidden">
                  <DictLabModal isInline={true} />
                </div>
              )}"""

new_codice = """              {viewMode === 'codice' && (
                <motion.div key="codice" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex-1 relative bg-white/50 overflow-hidden">
                  <DictLabModal isInline={true} />
                </motion.div>
              )}"""
content = content.replace(old_codice, new_codice)

# Modify Album
old_album = """              {viewMode === 'album' && (
                <div className="flex-1 relative bg-slate-900 overflow-hidden">
                  <AlbumModal 
                    albumState={albumState} 
                    currentThemeStyle={currentThemeStyle} 
                    setAlbumState={setAlbumState}
                    isInline={true} 
                  />
                </div>
              )}"""

new_album = """              {viewMode === 'album' && (
                <motion.div key="album" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex-1 relative bg-slate-900 overflow-hidden">
                  <AlbumModal 
                    albumState={albumState} 
                    currentThemeStyle={currentThemeStyle} 
                    setAlbumState={setAlbumState}
                    isInline={true} 
                  />
                </motion.div>
              )}"""
content = content.replace(old_album, new_album)

# Modify Mistakes
old_mistakes = """              {viewMode === 'mistakes' && (
                <div className="flex-1 relative overflow-hidden bg-white/80">
                  <MistakesBook
                    mistakesList={mistakesList}
                    currentThemeStyle={currentThemeStyle}
                    setMistakesList={setMistakesList}
                    isInline={true}
                  />
                </div>
              )}"""

new_mistakes = """              {viewMode === 'mistakes' && (
                <motion.div key="mistakes" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex-1 relative overflow-hidden bg-white/80">
                  <MistakesBook
                    mistakesList={mistakesList}
                    currentThemeStyle={currentThemeStyle}
                    setMistakesList={setMistakesList}
                    isInline={true}
                  />
                </motion.div>
              )}"""
content = content.replace(old_mistakes, new_mistakes)

# Modify Profile
old_profile = """              {viewMode === 'profile' && (
                <div className="flex-1 relative overflow-hidden bg-slate-50">
                  <ProfileDashboard 
                    user={user} 
                    currentThemeStyle={currentThemeStyle} 
                    purchasedThemes={purchasedThemes}
                    purchasedPets={purchasedPets}
                    themes={themes}
                    PET_BUFFS={PET_BUFFS}
                    setActiveTheme={handleThemeClick}
                    setEquipedPet={setEquipedPet}
                    equipedPet={equipedPet}
                    activeTheme={activeTheme}
                    stats={stats}
                    setShowShellGame={setShowShellGame}
                    setShowPetRace={setShowPetRace}
                    callGemini={callGemini}
                  />
                </div>
              )}
           </div>"""

new_profile = """              {viewMode === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex-1 relative overflow-hidden bg-slate-50">
                  <ProfileDashboard 
                    user={user} 
                    currentThemeStyle={currentThemeStyle} 
                    purchasedThemes={purchasedThemes}
                    purchasedPets={purchasedPets}
                    themes={themes}
                    PET_BUFFS={PET_BUFFS}
                    setActiveTheme={handleThemeClick}
                    setEquipedPet={setEquipedPet}
                    equipedPet={equipedPet}
                    activeTheme={activeTheme}
                    stats={stats}
                    setShowShellGame={setShowShellGame}
                    setShowPetRace={setShowPetRace}
                    callGemini={callGemini}
                  />
                </motion.div>
              )}
              </AnimatePresence>
           </div>"""
content = content.replace(old_profile, new_profile)

with open('src/App.tsx', 'w') as f:
    f.write(content)

