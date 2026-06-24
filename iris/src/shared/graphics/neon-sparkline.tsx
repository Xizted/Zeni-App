import { BlurMask, Canvas, LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

interface NeonSparklineProps {
  accessibilityLabel: string;
  color?: string;
  height: number;
  values: readonly number[];
  width: number;
}

export function NeonSparkline({
  accessibilityLabel,
  color = '#00E5FF',
  height,
  values,
  width,
}: NeonSparklineProps) {
  const path = useMemo(() => {
    const result = Skia.Path.Make();
    const finiteValues = values.filter(Number.isFinite);
    if (finiteValues.length === 0) {
      return result;
    }

    const minimum = Math.min(...finiteValues);
    const maximum = Math.max(...finiteValues);
    const range = maximum - minimum || 1;
    const xStep = finiteValues.length === 1 ? 0 : width / (finiteValues.length - 1);

    finiteValues.forEach((value, index) => {
      const x = index * xStep;
      const y = height - ((value - minimum) / range) * height;
      if (index === 0) {
        result.moveTo(x, y);
      } else {
        result.lineTo(x, y);
      }
    });

    return result;
  }, [height, values, width]);

  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={[styles.container, { height, width }]}>
      <Canvas pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Path path={path} style="stroke" strokeCap="round" strokeJoin="round" strokeWidth={6}>
          <LinearGradient colors={[color, '#FF2BD6']} end={vec(width, height)} start={vec(0, 0)} />
          <BlurMask blur={8} style="solid" />
        </Path>
        <Path path={path} style="stroke" strokeCap="round" strokeJoin="round" strokeWidth={2}>
          <LinearGradient colors={[color, '#FF2BD6']} end={vec(width, height)} start={vec(0, 0)} />
        </Path>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
});
