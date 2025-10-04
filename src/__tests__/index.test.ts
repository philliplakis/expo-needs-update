import {
  isIos,
  isAndroid,
  configureApp,
  getAppConfig,
  getCurrentBundleIdentifier,
  getCountry,
} from "../index";
import * as Application from "expo-application";
import { appStoreProvider } from "../app-stores/apple";
import { playStoreProvider } from "../app-stores/google";

// Mock expo-application
jest.mock("expo-application", () => ({
  nativeApplicationVersion: "1.0.0",
}));

// Mock app store providers
jest.mock("../app-stores/apple", () => ({
  appStoreProvider: {
    getVersion: jest.fn(),
  },
}));

jest.mock("../app-stores/google", () => ({
  playStoreProvider: {
    getVersion: jest.fn(),
  },
}));

// Mock React Native Platform
jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
  },
}));

describe("expo-needs-update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset configuration to defaults
    configureApp({
      iosBundleIdentifier: "com.philliplakis.cool",
      androidPackageName: "com.philliplakis",
      country: "us",
    });
  });

  describe("Platform detection", () => {
    it("should detect iOS platform", () => {
      expect(isIos).toBe(true);
      expect(isAndroid).toBe(false);
    });
  });

  describe("App Store Providers", () => {
    it("should have Apple App Store provider", () => {
      expect(appStoreProvider).toBeDefined();
      expect(typeof appStoreProvider.getVersion).toBe("function");
    });

    it("should have Google Play Store provider", () => {
      expect(playStoreProvider).toBeDefined();
      expect(typeof playStoreProvider.getVersion).toBe("function");
    });
  });

  describe("Application version", () => {
    it("should get native application version", () => {
      expect(Application.nativeApplicationVersion).toBe("1.0.0");
    });
  });

  describe("Configuration", () => {
    it("should have default configuration", () => {
      const config = getAppConfig();
      expect(config.iosBundleIdentifier).toBe("com.philliplakis.cool");
      expect(config.androidPackageName).toBe("com.philliplakis");
      expect(config.country).toBe("us");
    });

    it("should configure app with custom bundle identifiers and country", () => {
      configureApp({
        iosBundleIdentifier: "com.example.myapp",
        androidPackageName: "com.example.myapp",
        country: "ca",
      });

      const config = getAppConfig();
      expect(config.iosBundleIdentifier).toBe("com.example.myapp");
      expect(config.androidPackageName).toBe("com.example.myapp");
      expect(config.country).toBe("ca");
    });

    it("should get current bundle identifier for iOS", () => {
      configureApp({
        iosBundleIdentifier: "com.test.ios",
        androidPackageName: "com.test.android",
      });

      const bundleId = getCurrentBundleIdentifier();
      expect(bundleId).toBe("com.test.ios");
    });

    it("should get country configuration", () => {
      configureApp({
        country: "gb",
      });

      const country = getCountry();
      expect(country).toBe("gb");
    });

    it("should default to 'us' when country is not configured", () => {
      configureApp({
        iosBundleIdentifier: "com.test.app",
        androidPackageName: "com.test.app",
        // country not specified
      });

      const country = getCountry();
      expect(country).toBe("us");
    });

    it("should update configuration partially", () => {
      configureApp({
        iosBundleIdentifier: "com.partial.update",
        country: "fr",
      });

      const config = getAppConfig();
      expect(config.iosBundleIdentifier).toBe("com.partial.update");
      expect(config.androidPackageName).toBe("com.philliplakis"); // Should remain unchanged
      expect(config.country).toBe("fr");
    });
  });
});
