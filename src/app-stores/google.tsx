import { IVersionAndStoreUrl } from "./types";
import { getAndroidPackageName } from "../app-config";

class PlayStoreProvider {
  async getVersion(): Promise<IVersionAndStoreUrl> {
    try {
      const packageName = getAndroidPackageName();

      if (!packageName) {
        throw new Error(
          "Android package name not configured. Call configureApp() first."
        );
      }

      const storeUrl = `https://play.google.com/store/apps/details?id=${packageName}&hl=en&gl=US`;

      const res = await fetch(storeUrl, {
        headers: { "sec-fetch-site": "same-origin" },
      });
      const text = await res.text();

      // Try to match the "Current Version" span
      const match = text.match(/Current Version.+?>([\d.-]+)<\/span>/);
      if (match) {
        const latestVersion = match[1].trim();
        return { version: latestVersion, storeUrl };
      }

      // Try to match the new layout
      const matchNewLayout = text.match(/\[\[\["([\d-.]+?)"\]\]/);
      if (matchNewLayout) {
        const latestVersion = matchNewLayout[1].trim();
        return { version: latestVersion, storeUrl };
      }

      throw new Error("No info about this app.");
    } catch (e) {
      console.warn(e);
      return {};
    }
  }
}

export const playStoreProvider = new PlayStoreProvider();
