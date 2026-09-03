import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_shop = """              {viewMode === 'shop' && (
                <div className={`flex-1 relative overflow-y-auto p-6 md:p-10 no-scrollbar ${currentThemeStyle.bgClass} ${currentThemeStyle.textPrimary}`}>"""

new_shop = """              {viewMode === 'shop' && (
                <motion.div key="shop" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} className={`flex-1 relative overflow-y-auto p-6 md:p-10 no-scrollbar ${currentThemeStyle.bgClass} ${currentThemeStyle.textPrimary}`}>"""
content = content.replace(old_shop, new_shop)

old_shop_end = """                      </div>
                    </div>
                  </div>
                </div>
              )}"""
new_shop_end = """                      </div>
                    </div>
                  </div>
                </motion.div>
              )}"""
content = content.replace(old_shop_end, new_shop_end)

with open('src/App.tsx', 'w') as f:
    f.write(content)
