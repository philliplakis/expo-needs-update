import { isOutdated } from "./sem-ver";
import * as Application from "expo-application";
import { useEffect, useMemo, useState } from "react";
import { IVersionAndStoreUrl } from "./app-stores/types";
import { appStoreProvider } from "./app-stores/apple";
import { playStoreProvider } from "./app-stores/google";
import { Platform } from "react-native";

export const isIos = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

// Export configuration functions
export {
  configureApp,
  getAppConfig,
  getCurrentBundleIdentifier,
  getCountry,
} from "./app-config";

/**
 * useNeedsUpdate - Example basic React hook.
 * Returns a boolean indicating if an update is needed.
 */
export function useNeedsUpdate(initialValue: boolean = false) {
  const current = useMemo(() => Application.nativeApplicationVersion, []);
  const [needsUpdate, setNeedsUpdate] = useState(initialValue);
  const [version, setVersion] = useState<IVersionAndStoreUrl>({
    version: undefined,
    storeUrl: undefined,
  });

  async function check() {
    let v: IVersionAndStoreUrl = { version: undefined, storeUrl: undefined };
    // Example: could check for updates here
    // setNeedsUpdate(true) if update is needed
    if (isIos) v = await appStoreProvider.getVersion();
    if (isAndroid) v = await playStoreProvider.getVersion();
    if (v.version?.length) {
      // Use isOutdated to determine if update is needed
      // If current is undefined/null, fallback to not setting needsUpdate
      if (current && isOutdated(v.version, current)) setNeedsUpdate(true);
    }

    setVersion(v);
    return;
  }

  useEffect(() => {
    check();
  }, []);

  return { needsUpdate, ...version };
}
