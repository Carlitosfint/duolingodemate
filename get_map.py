import urllib.request
import json
import base64

try:
    response = urllib.request.urlopen('http://localhost:3000/src/App.tsx')
    data = response.read().decode('utf-8')
    for line in data.splitlines():
        if line.startswith('//# sourceMappingURL=data:application/json;base64,'):
            b64_str = line.split(',', 1)[1]
            map_data = json.loads(base64.b64decode(b64_str).decode('utf-8'))
            if 'sourcesContent' in map_data and len(map_data['sourcesContent']) > 0:
                with open('src/App.tsx', 'w') as f:
                    f.write(map_data['sourcesContent'][0])
                print("Successfully recovered src/App.tsx from sourcemap!")
                break
except Exception as e:
    print(f"Error: {e}")
