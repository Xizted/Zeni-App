import { Easing, ReduceMotion, type WithSpringConfig, type WithTimingConfig } from 'react-native-reanimated';

export const MotionDuration = {
  instant: 0,
  fast: 140,
  normal: 240,
  slow: 420,
} as const;

export const MotionTiming: Readonly<Record<'emphasized' | 'standard', WithTimingConfig>> = {
  emphasized: {
    duration: MotionDuration.normal,
    easing: Easing.bezier(0.2, 0, 0, 1),
    reduceMotion: ReduceMotion.System,
  },
  standard: {
    duration: MotionDuration.fast,
    easing: Easing.out(Easing.cubic),
    reduceMotion: ReduceMotion.System,
  },
};

export const MotionSpring: Readonly<Record<'expressive' | 'responsive', WithSpringConfig>> = {
  expressive: { damping: 18, mass: 0.8, reduceMotion: ReduceMotion.System, stiffness: 180 },
  responsive: { damping: 22, mass: 0.7, reduceMotion: ReduceMotion.System, stiffness: 260 },
};
