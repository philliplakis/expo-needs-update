import { Platform } from "react-native";

export interface AppConfig {
  iosBundleIdentifier?: string;
  androidPackageName?: string;
  country?: string;
}

// Global configuration storage
let appConfig: AppConfig = {
  iosBundleIdentifier: "com.philliplakis.cool", // Default fallback
  androidPackageName: "com.philliplakis", // Default fallback
  country: "us", // Default country
};

/**
 * Configure the app's bundle identifiers and country
 * Call this function in your app to set the correct bundle identifiers
 *
 * @param config Configuration object with bundle identifiers and country
 *
 * @example
 * ```typescript
 * import { configureApp } from 'expo-needs-update';
 *
 * configureApp({
 *   iosBundleIdentifier: 'com.yourcompany.yourapp',
 *   androidPackageName: 'com.yourcompany.yourapp',
 *   country: 'us' // Optional, defaults to 'us'
 * });
 * ```
 */
export function configureApp(config: AppConfig): void {
  appConfig = { ...appConfig, ...config };
}

/**
 * Gets the current app configuration
 */
export function getAppConfig(): AppConfig {
  return { ...appConfig };
}

/**
 * Gets the appropriate bundle identifier for the current platform
 */
export function getCurrentBundleIdentifier(): string | undefined {
  if (Platform.OS === "ios") {
    return appConfig.iosBundleIdentifier;
  } else if (Platform.OS === "android") {
    return appConfig.androidPackageName;
  }

  return undefined;
}

/**
 * Gets the iOS bundle identifier
 */
export function getIOSBundleIdentifier(): string | undefined {
  return appConfig.iosBundleIdentifier;
}

/**
 * Gets the Android package name
 */
export function getAndroidPackageName(): string | undefined {
  return appConfig.androidPackageName;
}

/**
 * Gets the configured country code
 */
export function getCountry(): string {
  return appConfig.country || "us";
}
