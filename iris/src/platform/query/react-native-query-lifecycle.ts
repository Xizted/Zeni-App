import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

export function bindReactNativeQueryLifecycle(): () => void {
  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected));
    }),
  );

  const appStateSubscription = AppState.addEventListener('change', (status) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  });

  return () => {
    appStateSubscription.remove();
    onlineManager.setEventListener(() => () => undefined);
    focusManager.setFocused(undefined);
  };
}
