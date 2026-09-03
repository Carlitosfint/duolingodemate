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
        button.classList.remove('animate-btn-pop');
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
          transform: scale(1);
          opacity: 0.6;
        }
        100% {
          transform: scale(1.4);
          opacity: 0;
        }
      }
      .animate-btn-pop {
        position: relative;
        isolation: isolate;
      }
      .animate-btn-pop::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background-color: var(--tw-bg-opacity, currentColor);
        background: inherit;
        filter: brightness(0.9) contrast(1.2);
        opacity: 0;
        z-index: -1;
        animation: btn-pop-anim 0.5s ease-out forwards;
        pointer-events: none;
      }
    `}} />
  );
};
"""

content = content[:start_ripple] + new_ripple + content[end_ripple:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

