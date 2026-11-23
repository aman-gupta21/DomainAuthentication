import { useEffect, useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

let hasHydrated = false;
const hydrationListeners = new Set<() => void>();

function subscribeToHydration(listener: () => void) {
  hydrationListeners.add(listener);
  return () => {
    hydrationListeners.delete(listener);
  };
}

function getHydrationSnapshot() {
  return hasHydrated;
}

function getServerHydrationSnapshot() {
  return false;
}

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  useEffect(() => {
    if (hasHydrated) return;
    hasHydrated = true;
    hydrationListeners.forEach((listener) => listener());
  }, []);

  const colorScheme = useRNColorScheme();

  if (hydrated) {
    return colorScheme;
  }

  return 'light';
}
