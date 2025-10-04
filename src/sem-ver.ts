export function semver(version: string): [number, number, number] {
  const parts = version.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid semver format. Expected x.x.x");
  }
  const [major, minor, patch] = parts.map((part) => {
    const num = Number(part);
    if (!Number.isInteger(num)) {
      throw new Error("Invalid semver format. Expected x.x.x with integers");
    }
    return num;
  });
  return [major, minor, patch];
}

export function isOutdated(storeVersion: string, localVersion: string): boolean {
  const [storeMajor, storeMinor, storePatch] = semver(storeVersion);
  const [localMajor, localMinor, localPatch] = semver(localVersion);

  if (localMajor < storeMajor) return true;
  if (localMajor > storeMajor) return false;

  if (localMinor < storeMinor) return true;
  if (localMinor > storeMinor) return false;

  if (localPatch < storePatch) return true;
  return false;
}
