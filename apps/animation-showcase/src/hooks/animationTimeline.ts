import { useCallback, useEffect, useRef, useState } from 'react';
import { css, RuleSet } from 'styled-components';
import { Keyframes } from 'styled-components/dist/types';

export type AnimationMap = Record<string, Keyframes>;

export type TimelineEvent<
  TAnimationTarget extends string,
  TAnimationMap extends AnimationMap,
> = {
  name: string;
  at: number;
  animations: AnimationEvent<TAnimationTarget, TAnimationMap>[];
  onStart?: () => void;
  onComplete?: () => void;
};

type AnimationEvent<
  TAnimationTarget extends string,
  TAnimationMap extends AnimationMap,
> = {
  target: TAnimationTarget;
  animation: keyof TAnimationMap;
  easing?: CSSEasingFunction;
  delay?: number;
  duration?: number;
  onStart?: () => void;
  onComplete?: () => void;
};

type CSSEasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out';

const createAnimationStyle = (
  animationMap: AnimationMap,
  animationName: string,
  duration: number,
  delay: number = 0,
  easing: CSSEasingFunction = 'ease'
) => {
  const keyframe = animationMap[animationName];
  if (!keyframe) return css``;

  return css`
    animation: ${keyframe} ${duration}ms ${easing} forwards;
    animation-delay: ${delay}ms;
  `;
};

export const useAnimationTimeline = <
  TAnimationTarget extends string,
  TAnimationMap extends AnimationMap,
>(
  animationMap: TAnimationMap,
  timeline: TimelineEvent<TAnimationTarget, TAnimationMap>[],
  callbacks?: {
    onComplete?: () => void;
  }
) => {
  const [activeAnimations, setActiveAnimations] = useState<
    Record<string, RuleSet>
  >({});
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const play = useCallback(() => {
    if (isPlaying) return;

    setIsPlaying(true);
    setActiveAnimations({});

    // Clear any existing timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    // Schedule all timeline events
    timeline.forEach((event) => {
      const timeout = setTimeout(() => {
        event.onStart?.();

        // Apply animations for this event
        const newAnimations: Record<
          string,
          ReturnType<typeof createAnimationStyle>
        > = {};

        event.animations.forEach(
          (anim: AnimationEvent<TAnimationTarget, TAnimationMap>) => {
            const duration = anim.duration || 300;
            const delay = anim.delay || 0;

            anim.onStart?.();

            newAnimations[anim.target] = createAnimationStyle(
              animationMap,
              anim.animation as string,
              duration,
              delay
            );

            // Schedule completion callback
            if (anim.onComplete) {
              const completeTimeout = setTimeout(
                anim.onComplete,
                delay + duration
              );
              timeoutsRef.current.push(completeTimeout);
            }
          }
        );

        setActiveAnimations((prev) => ({ ...prev, ...newAnimations }));

        // Schedule event completion callback
        if (event.onComplete) {
          const maxAnimationDuration = Math.max(
            ...event.animations.map((a) => (a.delay || 0) + (a.duration || 300))
          );

          const eventCompleteTimeout = setTimeout(
            event.onComplete,
            maxAnimationDuration
          );

          timeoutsRef.current.push(eventCompleteTimeout);
        }
      }, event.at);

      timeoutsRef.current.push(timeout);
    });

    // Calculate total duration
    const totalDuration = Math.max(
      ...timeline.map(
        (event) =>
          event.at +
          Math.max(
            ...event.animations.map(
              (a: AnimationEvent<TAnimationTarget, TAnimationMap>) =>
                (a.delay || 0) + (a.duration || 300)
            )
          )
      )
    );

    // Schedule completion
    const completeTimeout = setTimeout(() => {
      setIsPlaying(false);
      setActiveAnimations({});
      callbacks?.onComplete?.();
    }, totalDuration + 500); // Add buffer for animation completion

    timeoutsRef.current.push(completeTimeout);
  }, [timeline, isPlaying, callbacks]);

  const stop = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
    setIsPlaying(false);
    setActiveAnimations({});
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return {
    activeAnimations,
    isPlaying,
    play,
    stop,
  };
};
