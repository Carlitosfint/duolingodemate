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
        // We add a class that triggers the CSS animation
        button.classList.remove('animate-btn-pop');
        // trigger reflow
        void button.offsetWidth;
        button.classList.add('animate-btn-pop');
        
        // Remove after animation finishes
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
          opacity: 0.8;
        }
        100% {
          transform: scale(1.4);
          opacity: 0;
        }
      }
      .animate-btn-pop {
        position: relative;
      }
      .animate-btn-pop::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background-color: var(--tw-ring-color, currentColor);
        opacity: 0;
        z-index: -1;
        animation: btn-pop-anim 0.6s ease-out forwards;
      }
      
      /* Make sure buttons have z-index > 0 so pseudo-element z-index: -1 works relative to the button and not the page */
      button:not(.nav-sidebar button) {
        transform-style: preserve-3d;
      }
      .animate-btn-pop::after {
        transform: translateZ(-1px);
        background: inherit;
        filter: brightness(0.8) sepia(1) hue-rotate(180deg) saturate(3);
      }
    `}} />
  );
};
"""

content = content[:start_ripple] + new_ripple + content[end_ripple:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

