import { identity } from "ramda";
import { useCallback, useEffect, useRef, useState } from "react";

interface IAnimationParams {
  duration: number;
  timeFunction(n: number): number;
  shouldInterruptPrevious: boolean;
  shouldResetOnEnd: boolean;
}

export function useAnimationStage({
  duration = 1000,
  timeFunction = identity,
  shouldInterruptPrevious = false,
  shouldResetOnEnd = false,
}: Partial<IAnimationParams>) {
  const timer = useRef<NodeJS.Timeout>();
  const request = useRef<number>(0);
  const [stage, setStage] = useState(0);

  const animate = useCallback(() => {
    const isAnimationInProgress =
      request.current !== 0 || timer.current !== undefined;

    if (isAnimationInProgress && !shouldInterruptPrevious) {
      return;
    }

    timer.current && clearTimeout(timer.current);
    cancelAnimationFrame(request.current);

    let elapsedTime = 0;
    let prevTimestamp: number;

    (function step() {
      request.current = requestAnimationFrame((timestamp: number) => {
        const dt = timestamp - (prevTimestamp ?? timestamp);
        prevTimestamp = timestamp;

        elapsedTime = Math.min(elapsedTime + dt, duration);

        const nextStage = timeFunction(elapsedTime / duration);
        setStage(nextStage);

        if (nextStage !== 1) {
          step();
        } else {
          request.current = 0;

          if (shouldResetOnEnd) {
            timer.current = setTimeout(() => {
              timer.current = undefined;
              setStage(0);
            });
          }
        }
      });
    })();
  }, [duration, timeFunction, shouldInterruptPrevious, shouldResetOnEnd]);

  useEffect(() => () => timer.current && clearTimeout(timer.current), []);

  return [stage, animate] as const;
}
