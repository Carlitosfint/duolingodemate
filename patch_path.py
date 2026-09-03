import sys

with open('src/components/ProgressMap.tsx', 'r') as f:
    content = f.read()

old_path = """  const pathData = points.map(pt => `${pt.x},${pt.y}`).join(' ');
  const pastPathData = points.slice(0, Math.max(1, progress)).map(pt => `${pt.x},${pt.y}`).join(' ');
  const currentSegmentData = progress > 0 ? points.slice(progress - 1, progress + 1).map(pt => `${pt.x},${pt.y}`).join(' ') : '';"""

new_path = """  const generateCurvedPath = (pts: {x: number, y: number}[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const cp1y = current.y - nodeSpacing / 2;
      const cp2y = next.y + nodeSpacing / 2;
      d += ` C ${current.x},${cp1y} ${next.x},${cp2y} ${next.x},${next.y}`;
    }
    return d;
  };

  const pathData = generateCurvedPath(points);
  const pastPathData = generateCurvedPath(points.slice(0, Math.max(1, progress + 1)));
  const currentSegmentData = progress > 0 && progress <= totalSteps ? generateCurvedPath(points.slice(progress - 1, progress + 1)) : '';"""

content = content.replace(old_path, new_path)

# replace polyline with path
content = content.replace('<polyline points={pathData}', '<path d={pathData}')
content = content.replace('<polyline points={pastPathData}', '<path d={pastPathData}')
content = content.replace('<motion.polyline', '<motion.path')
content = content.replace('points={currentSegmentData}', 'd={currentSegmentData}')

with open('src/components/ProgressMap.tsx', 'w') as f:
    f.write(content)
