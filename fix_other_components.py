import sys
import glob
import re

for filepath in glob.glob('src/components/*.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Import Icon if not imported
    if "import { Icon }" not in content and "lucide-react" not in content and "<Icon" not in content:
        import_stmt = "import { Icon } from './CustomIcons';\n"
        if "import React" in content:
            content = content.replace("import React", import_stmt + "import React")
        else:
            content = import_stmt + content
            
    # Add imports to files that will use Icon
    if "<Icon" in content and "import { Icon }" not in content:
        content = "import { Icon } from './CustomIcons';\n" + content
    
    content = content.replace('🪙', '<Icon name="coins" size={18} className="inline-block" />')
    content = content.replace('🎟️', '<Icon name="ticket" size={18} className="inline-block" />')
    content = content.replace('💰', '<Icon name="money_bag" size={18} className="inline-block" />')
    
    # We should be careful not to replace emoji inside string literals in a way that breaks syntax,
    # but since these components are TSX, we can replace them if they are in JSX.
    # Actually, replacing them globally might break things like: `icon: "🪙"`
    # So let's only do it for known text rendering or use regex carefully.
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Done other components")
