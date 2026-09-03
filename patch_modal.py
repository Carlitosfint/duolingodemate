import re

with open("src/components/DictLabModal.tsx", "r") as f:
    content = f.read()

# 1. Fix Tabs Selector (stop squishing)
old_tab_class = "className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-xl font-bold text-[11px] md:text-sm flex items-center justify-center gap-2 transition-all relative shrink-0 cursor-pointer min-w-[130px] md:min-w-0 ${"
new_tab_class = "className={`flex-none py-2 md:py-3 px-4 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all relative shrink-0 cursor-pointer min-w-max ${"
content = content.replace(old_tab_class, new_tab_class)

# 2. Fix Footer (make text always visible, adjust spacing)
old_footer = """      <div className="w-full flex justify-between items-center pt-4 md:pt-6 border-t-2 border-indigo-100 shrink-0">
        <Button onClick={handlePrev} disabled={currentIndex === 0} color="slate" className="!py-2 md:!py-3 !px-4 md:!px-6">
          <Icon name="arrow_left" size={20} className="md:mr-1" />
          <span className="hidden md:inline">Anterior</span>
        </Button>
        <span className="text-slate-400 font-bold text-[10px] md:text-sm uppercase tracking-widest bg-slate-100 px-3 md:px-4 py-1.5 md:py-2 rounded-full">
          {currentIndex + 1} / {tabOrder.length}
        </span>
        <Button onClick={handleNext} color={currentIndex === tabOrder.length - 1 ? 'green' : 'blue'} className="!py-2 md:!py-3 !px-4 md:!px-6">
          <span className="hidden md:inline">{currentIndex === tabOrder.length - 1 ? 'Entendido' : 'Siguiente'}</span>
          {currentIndex === tabOrder.length - 1 ? <Icon name="check" size={20} className="md:ml-1" /> : <Icon name="arrow_right" size={20} className="md:ml-1" />}
        </Button>
      </div>"""

new_footer = """      <div className="w-full flex justify-between items-center pt-4 border-t-2 border-indigo-100 shrink-0 mt-auto">
        <Button onClick={handlePrev} disabled={currentIndex === 0} color="slate" className="!py-2 !px-3 md:!px-5 flex-1 md:flex-none">
          <Icon name="arrow_left" size={18} className="mr-1" />
          <span className="text-xs md:text-sm">Anterior</span>
        </Button>
        <div className="flex-1 flex justify-center">
          <span className="text-slate-500 font-black text-xs md:text-sm uppercase tracking-widest bg-slate-100 px-3 md:px-5 py-1.5 md:py-2 rounded-full shadow-inner border border-slate-200">
            {currentIndex + 1} / {tabOrder.length}
          </span>
        </div>
        <Button onClick={handleNext} color={currentIndex === tabOrder.length - 1 ? 'green' : 'blue'} className="!py-2 !px-3 md:!px-5 flex-1 md:flex-none">
          <span className="text-xs md:text-sm">{currentIndex === tabOrder.length - 1 ? 'Entendido' : 'Siguiente'}</span>
          {currentIndex === tabOrder.length - 1 ? <Icon name="check" size={18} className="ml-1" /> : <Icon name="arrow_right" size={18} className="ml-1" />}
        </Button>
      </div>"""
content = content.replace(old_footer, new_footer)

with open("src/components/DictLabModal.tsx", "w") as f:
    f.write(content)
print("Tabs and Footer patched")
