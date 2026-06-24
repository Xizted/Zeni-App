import { QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { createQueryClient } from '@/platform/query/query-client';
import { bindReactNativeQueryLifecycle } from '@/platform/query/react-native-query-lifecycle';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => bindReactNativeQueryLifecycle(), []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
