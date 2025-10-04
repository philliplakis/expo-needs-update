import { IVersionAndStoreUrl } from "./types";
import { getIOSBundleIdentifier, getCountry } from "../app-config";

class AppStoreProvider {
  async getVersion(): Promise<IVersionAndStoreUrl> {
    try {
      const bundleId = getIOSBundleIdentifier();
      const country = getCountry();

      if (!bundleId) {
        throw new Error(
          "iOS bundle identifier not configured. Call configureApp() first."
        );
      }

      const dateNow = new Date().getTime();
      const url = `https://itunes.apple.com/${country}/lookup?bundleId=${bundleId}&date=${dateNow}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.resultCount) {
        const version = json.results[0].version;
        const appId = json.results[0].trackId;
        const storeUrl = `itms-apps://apps.apple.com/${country}/app/id${appId}`;
        return {
          version,
          storeUrl,
        };
      }
      throw new Error("No info about this app.");
    } catch (e) {
      console.warn(e);
      return {};
    }
  }
}

export const appStoreProvider = new AppStoreProvider();
