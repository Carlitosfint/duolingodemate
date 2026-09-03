import { useState, useEffect, useRef } from 'react';

export function useAnimatedNumber(value: number, duration: number = 800) {
  const [displayValue, setDisplayValue] = useState(value);
  const startTime = useRef<number | null>(null);
  const startValue = useRef<number>(value);
  const endValue = useRef<number>(value);

  useEffect(() => {
    if (value === displayValue) return;

    startValue.current = displayValue;
    endValue.current = value;
    startTime.current = null;

    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;
      
      const ratio = Math.min(progress / duration, 1);
      
      // linear
      const currentVal = Math.round(startValue.current + (endValue.current - startValue.current) * ratio);
      setDisplayValue(currentVal);

      if (ratio < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue.current);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return displayValue;
}
