import React, { useCallback, useState } from 'react';
import styled, { css, keyframes, RuleSet } from 'styled-components';
import {
  AnimationMap,
  TimelineEvent,
  useAnimationTimeline,
} from '../hooks/animationTimeline';

type ButtonColor = 'primary' | 'secondary';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  size?: ButtonSize;
  icon?: React.ReactNode;
  completedIcon?: React.ReactNode;
  completedText?: string;
  animated?: boolean;
  children: string;
  // Accessibility props
  ariaLabel?: string;
  ariaDescription?: string;
  announceCompletion?: boolean;
  // Reset functionality
  resetOnPropsChange?: boolean;
}

type AnimationTarget =
  | 'button'
  | 'text'
  | 'text-wrapper'
  | 'icon-wrapper'
  | 'icon-original'
  | 'icon-completed';

const moveIconToCenter = keyframes`
  from {
    inset: 0;
    transform: translateX(0);
  }
  to {
    inset: 0 0 0 50%;
    transform: translateX(-50%);
  }
`;

const moveIconFromCenter = keyframes`
  from {
    inset: 0 0 0 50%;
    transform: translateX(-50%);
  }
  to {
    inset: 0;
    transform: translateX(0);
  }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const collapse = keyframes`
  from { grid-template-columns: 1fr; }
  to { grid-template-columns: 0fr; }
`;

const expand = keyframes`
  from { grid-template-columns: 0fr; }
  to { grid-template-columns: 1fr; }
`;

const collapsePadding = keyframes`
  from {
    padding-left: var(--btn-horizontal-padding);
    padding-right: var(--btn-horizontal-padding);
  }
  to {
    padding-left: 0;
    padding-right: 0;
  }
`;

const expandPadding = keyframes`
  from {
    padding-left: 0;
    padding-right: 0;
  }
  to {
    padding-left: var(--btn-horizontal-padding);
    padding-right: var(--btn-horizontal-padding);
  }
`;

const ANIMATION_MAP = {
  collapse: collapse,
  expand: expand,
  collapsePadding: collapsePadding,
  expandPadding: expandPadding,
  moveToCenter: moveIconToCenter,
  moveFromCenter: moveIconFromCenter,
  fadeOut: fadeOut,
  fadeIn: fadeIn,
} as const satisfies AnimationMap;

const ANIMATION_TIMELINE: TimelineEvent<
  AnimationTarget,
  typeof ANIMATION_MAP
>[] = [
  {
    name: 'move icon to center',
    at: 200,
    animations: [
      { target: 'icon-wrapper', animation: 'moveToCenter', duration: 300 },
      { target: 'text', animation: 'fadeOut', duration: 250 },
    ],
  },
  {
    name: 'collapse text wrapper',
    at: 500,
    animations: [
      {
        target: 'button',
        animation: 'collapsePadding',
        duration: 300,
        easing: 'ease-in',
      },
      {
        target: 'text-wrapper',
        animation: 'collapse',
        duration: 300,
        easing: 'ease-in',
      },
    ],
  },
  {
    name: 'fade out icon original, fade in icon completed',
    at: 1000,
    animations: [
      { target: 'icon-original', animation: 'fadeOut', duration: 1000 },
      { target: 'icon-completed', animation: 'fadeIn', duration: 1000 },
    ],
  },
  {
    name: 'expand text wrapper',
    at: 3000,
    animations: [
      {
        target: 'button',
        animation: 'expandPadding',
        duration: 300,
        easing: 'ease-out',
      },
      {
        target: 'text-wrapper',
        animation: 'expand',
        duration: 300,
        easing: 'ease-out',
      },
    ],
  },
  {
    name: 'move icon from center',
    at: 3300,
    animations: [
      {
        target: 'icon-wrapper',
        animation: 'moveFromCenter',
        duration: 300,
      },
      { target: 'text', animation: 'fadeIn', duration: 250 },
    ],
  },
];

const THEME = {
  primary: {
    backgroundColor: '#106bff',
    hoverBackgroundColor: 'rgba(0, 90, 255, 1)',
    textColor: '#ffffff',
    shadowColorRGB: '16, 107, 255',
  },
  secondary: {
    backgroundColor: '#ffffff',
    hoverBackgroundColor: 'rgba(240, 245, 255, 1)',
    textColor: '#106bff',
    shadowColorRGB: '16, 107, 255',
  },
} as const;

const SIZES = {
  small: {
    height: 32,
    fontSize: 16,
    iconSize: 24,
    gap: 6,
  },
  medium: {
    height: 48,
    fontSize: 18,
    iconSize: 28,
    gap: 8,
  },
  large: {
    height: 64,
    fontSize: 20,
    iconSize: 32,
    gap: 8,
  },
} as const;

const calculateShadow = (
  size: ButtonSize,
  shadowColorRGB: string,
  state: 'default' | 'hover' | 'active' = 'default'
) => {
  const heightValue = SIZES[size].height;

  // Use a non-linear scaling with upper limits
  const scaleFactor = Math.min(
    0.85,
    Math.pow(heightValue / SIZES.large.height, 0.8)
  );

  // Base values with reasonable maximums
  const baseX = Math.min(3, Math.round(3 * scaleFactor));
  const baseY = Math.min(5, Math.round(5 * scaleFactor));
  const baseBlur = Math.min(14, Math.round(14 * scaleFactor));
  const baseOpacity = Math.max(0.45, Math.min(0.65, 0.65 * scaleFactor));

  switch (state) {
    case 'hover':
      return `${baseX}px ${baseY + 1}px ${baseBlur + 2}px 0 rgba(${shadowColorRGB}, ${Math.min(0.7, baseOpacity + 0.1)})`;
    case 'active':
      return `${baseX - 1}px ${baseY - 1}px ${baseBlur - 2}px 0 rgba(${shadowColorRGB}, ${baseOpacity})`;
    default:
      return `${baseX}px ${baseY}px ${baseBlur}px 0 rgba(${shadowColorRGB}, ${baseOpacity})`;
  }
};

const StyledButton = styled.button<{
  $color: ButtonColor;
  $size: ButtonSize;
  $hasIcon: boolean;
  $animations: Record<string, RuleSet>;
}>`
  font-family: inherit;
  font-weight: 500;
  border: none;
  border-radius: 100vh;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus-visible {
    outline: 2px solid #106bff;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${({ $size, $color }) => {
    const { height, fontSize, iconSize } = SIZES[$size];
    const { backgroundColor, textColor, hoverBackgroundColor, shadowColorRGB } =
      THEME[$color];

    return css`
      --btn-height: ${height}px;
      --btn-horizontal-padding: ${height / 3}px;
      --icon-size: ${iconSize}px;

      height: ${height}px;
      font-size: ${fontSize}px;
      background-color: ${backgroundColor};
      color: ${textColor};
      min-width: ${height}px;
      padding: 0 var(--btn-horizontal-padding);
      box-shadow: ${calculateShadow($size, shadowColorRGB)};

      &:hover:not(:disabled) {
        background-color: ${hoverBackgroundColor};
        box-shadow: ${calculateShadow($size, shadowColorRGB, 'hover')};
        transform: translate(-1px, -1px);
      }

      &:active:not(:disabled) {
        transform: scale(0.95);
        box-shadow: ${calculateShadow($size, shadowColorRGB, 'active')};
      }
    `;
  }}

  /* Apply dynamic animations using css helper */
  ${({ $animations }) => css`
    ${$animations.button || css``}

    [data-role='text'] {
      ${$animations.text || css``}
    }

    [data-role='text-wrapper'] {
      ${$animations['text-wrapper'] || css``}
    }

    [data-role='icon-wrapper'] {
      ${$animations['icon-wrapper'] || css``}
    }

    [data-role='icon-original'] {
      ${$animations['icon-original'] || css``}
    }

    [data-role='icon-completed'] {
      ${$animations['icon-completed'] || css``}
    }
  `}

  /* Respect reduced motion preferences */
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transition: none !important;

    [data-role='text'] {
      animation: none !important;
      transition: none !important;
    }

    [data-role='text-wrapper'] {
      animation: none !important;
      transition: none !important;
    }

    [data-role='icon-wrapper'] {
      animation: none !important;
      transition: none !important;
    }

    [data-role='icon-original'] {
      animation: none !important;
      transition: none !important;
    }

    [data-role='icon-completed'] {
      animation: none !important;
      transition: none !important;
    }
  }
`;

const IconWrapper = styled.span<{ $size: ButtonSize; $isCompleted: boolean }>`
  display: inline-block;
  flex-shrink: 0;
  width: ${({ $size }) => SIZES[$size].iconSize}px;
  height: ${({ $size }) => SIZES[$size].iconSize}px;
  position: relative;

  .icon {
    position: absolute;
    inset: 0;

    svg {
      width: 100%;
      height: 100%;
    }

    &.icon-original {
      opacity: ${({ $isCompleted }) => ($isCompleted ? 0 : 1)};
    }

    &.icon-completed {
      opacity: ${({ $isCompleted }) => ($isCompleted ? 1 : 0)};
    }
  }
`;

const TextWrapper = styled.span<{ $hasIcon: boolean; $size: ButtonSize }>`
  display: grid;
  grid-template-columns: 1fr;
  white-space: nowrap;
  width: 100%;
  justify-items: center;
  padding-left: ${({ $hasIcon, $size }) =>
    $hasIcon ? `${SIZES[$size].gap}px` : '0'};

  [data-role='text'] {
    overflow: hidden;
    min-height: 0;
  }
`;

const DefaultCompletedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
      aria-hidden="true"
      fill="currentColor"
    />
  </svg>
);

const AnimatedButton: React.FC<ButtonProps> = ({
  color = 'primary',
  size = 'medium',
  icon,
  completedIcon = <DefaultCompletedIcon />,
  completedText = 'Completed!',
  animated = false,
  children,
  onClick,
  ariaLabel,
  ariaDescription,
  announceCompletion = true,
  resetOnPropsChange = false,
  ...props
}) => {
  const [currentText, setCurrentText] = useState(children);
  const [isCompleted, setIsCompleted] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasBeenTriggered, setHasBeenTriggered] = useState(false);

  // Check for reduced motion preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Reset button state when props change (if enabled)
  React.useEffect(() => {
    if (resetOnPropsChange) {
      setHasBeenTriggered(false);
      setIsCompleted(false);
      setCurrentText(children);
    }
  }, [resetOnPropsChange, children]);

  // Create timeline with text change callback
  const timeline = React.useMemo(() => {
    const events = ANIMATION_TIMELINE.map((event) => ({
      ...event,
      animations: event.animations.map((anim) => ({ ...anim })),
      onStart: event.onStart,
      onComplete: event.onComplete,
    }));

    // Find the expanding event and add text change
    const collapsingEvent = events.find(
      (e) => e.name === 'collapse text wrapper'
    );
    if (collapsingEvent) {
      const originalTrigger = collapsingEvent.onComplete;
      collapsingEvent.onComplete = () => {
        originalTrigger?.();
        setCurrentText(completedText);
      };
    }

    return events;
  }, [completedText, children]);

  const { activeAnimations, isPlaying, play } = useAnimationTimeline<
    AnimationTarget,
    typeof ANIMATION_MAP
  >(ANIMATION_MAP, timeline, {
    onComplete: () => {
      setIsCompleted(true);
      if (announceCompletion) {
        setAnnouncement(completedText);
        // Clear announcement after a short delay to allow screen readers to process it
        setTimeout(() => setAnnouncement(''), 1000);
      }
    },
  });

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent interaction if already triggered
      if (hasBeenTriggered) {
        return;
      }

      if (animated && !isPlaying && !prefersReducedMotion) {
        setHasBeenTriggered(true);
        onClick?.(e);
        play();
      } else if (!isPlaying) {
        setHasBeenTriggered(true);
        onClick?.(e);
        // For reduced motion, just update the state immediately
        if (prefersReducedMotion && animated) {
          setCurrentText(completedText);
          setIsCompleted(true);
          if (announceCompletion) {
            setAnnouncement(completedText);
            setTimeout(() => setAnnouncement(''), 1000);
          }
        }
      }
    },
    [
      hasBeenTriggered,
      animated,
      isPlaying,
      onClick,
      play,
      prefersReducedMotion,
      completedText,
      announceCompletion,
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Prevent interaction if already triggered
      if (hasBeenTriggered) {
        return;
      }

      // Allow space and enter to trigger animation
      if ((e.key === ' ' || e.key === 'Enter') && animated && !isPlaying) {
        e.preventDefault();
        setHasBeenTriggered(true);
        if (!prefersReducedMotion) {
          onClick?.(e as any);
          play();
        } else {
          // For reduced motion, just update the state immediately
          onClick?.(e as any);
          setCurrentText(completedText);
          setIsCompleted(true);
          if (announceCompletion) {
            setAnnouncement(completedText);
            setTimeout(() => setAnnouncement(''), 1000);
          }
        }
      }
    },
    [
      hasBeenTriggered,
      animated,
      isPlaying,
      onClick,
      play,
      prefersReducedMotion,
      completedText,
      announceCompletion,
    ]
  );

  // Generate accessible label
  const accessibleLabel =
    ariaLabel ||
    (icon
      ? `${children}, ${hasBeenTriggered ? 'completed' : 'click to complete'}`
      : hasBeenTriggered
        ? `${children} (completed)`
        : children);

  return (
    <>
      <StyledButton
        $color={color}
        $size={size}
        $hasIcon={Boolean(icon)}
        $animations={activeAnimations}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isPlaying || props.disabled || hasBeenTriggered}
        aria-label={accessibleLabel}
        aria-describedby={
          ariaDescription ? `${props.id || 'button'}-description` : undefined
        }
        aria-live={isPlaying ? 'polite' : 'off'}
        aria-pressed={isCompleted}
        role="button"
        tabIndex={0}
        {...props}
      >
        {icon && (
          <IconWrapper
            $size={size}
            data-role="icon-wrapper"
            $isCompleted={isCompleted}
          >
            <span className="icon icon-original" data-role="icon-original">
              {icon}
            </span>
            <span className="icon icon-completed" data-role="icon-completed">
              {completedIcon}
            </span>
          </IconWrapper>
        )}

        <TextWrapper
          $hasIcon={Boolean(icon)}
          $size={size}
          data-role="text-wrapper"
        >
          <span data-role="text">{currentText}</span>
        </TextWrapper>
      </StyledButton>

      {/* Live region for screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        }}
      >
        {announcement}
      </div>

      {/* Description for screen readers */}
      {ariaDescription && (
        <div
          id={`${props.id || 'button'}-description`}
          className="sr-only"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: '0',
          }}
        >
          {ariaDescription}
        </div>
      )}
    </>
  );
};

export default AnimatedButton;
