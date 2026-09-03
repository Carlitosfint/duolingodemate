import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_ripple = content.find("const GlobalRipple = () => {")
end_ripple = content.find("export default function App", start_ripple)

new_ripple = """const GlobalRipple = () => {
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      if (button && !button.closest('.nav-sidebar') && !button.closest('.no-ripple')) {
        const style = window.getComputedStyle(button);
        const bgColor = style.backgroundColor;
        const match = bgColor.match(/rgba?\\((\\d+,\\s*\\d+,\\s*\\d+)/);
        const rgb = match ? match[1] : '148, 163, 184';
        
        button.style.setProperty('--btn-pulse-color', `rgba(${rgb}, 0.8)`);
        button.style.setProperty('--btn-pulse-trans', `rgba(${rgb}, 0)`);

        button.classList.remove('animate-btn-pop');
        // trigger reflow
        void button.offsetWidth;
        button.classList.add('animate-btn-pop');
        
        setTimeout(() => {
          if (button) button.classList.remove('animate-btn-pop');
        }, 600);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes btn-pop-anim {
        0% {
          box-shadow: 0 0 0 0px var(--btn-pulse-color);
        }
        100% {
          box-shadow: 0 0 0 25px var(--btn-pulse-trans);
        }
      }
      .animate-btn-pop {
        animation: btn-pop-anim 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
      }
    `}} />
  );
};
"""

content = content[:start_ripple] + new_ripple + content[end_ripple:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

