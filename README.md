# expo-needs-update

A React hook for checking if your Expo app needs to be updated by comparing the current app version with the latest version available on the App Store (iOS) or Google Play Store (Android).

## Features

- ✅ React hook for easy integration
- ✅ Automatic platform detection (iOS/Android)
- ✅ App Store and Play Store version checking
- ✅ Semantic version comparison
- ✅ Direct store links for updates
- ✅ TypeScript support
- ✅ Error handling and fallbacks

## Installation

```bash
npm install expo-needs-update
# or
yarn add expo-needs-update
```

## Prerequisites

This package requires:
- Expo SDK 49 or higher
- React Native 0.72 or higher
- React 18 or higher
- expo-application package

## Usage

### Basic Usage

```typescript
import React from 'react';
import { View, Text, Button, Linking } from 'react-native';
import { useNeedsUpdate, configureApp } from 'expo-needs-update';

// Configure your app's bundle identifiers
// These should match your app.json configuration
configureApp({
  iosBundleIdentifier: 'com.yourcompany.yourapp', // From app.json ios.bundleIdentifier
  androidPackageName: 'com.yourcompany.yourapp', // From app.json android.package
  country: 'us', // Optional, defaults to 'us'
});

export default function App() {
  const { needsUpdate, version, storeUrl } = useNeedsUpdate();

  if (needsUpdate) {
    return (
      <View>
        <Text>Update available! Version {version} is ready.</Text>
        <Button title="Update Now" onPress={() => Linking.openURL(storeUrl)} />
      </View>
    );
  }

  return (
    <View>
      <Text>Your app is up to date!</Text>
    </View>
  );
}
```

### Advanced Usage

```typescript
import React from 'react';
import { View, Text, Button, Linking } from 'react-native';
import { useNeedsUpdate, configureApp } from 'expo-needs-update';

// Configure once at app startup
configureApp({
  iosBundleIdentifier: 'com.yourcompany.yourapp',
  androidPackageName: 'com.yourcompany.yourapp',
  country: 'ca' // For Canadian App Store
});

export default function UpdateChecker() {
  const { needsUpdate, version, storeUrl } = useNeedsUpdate(true); // Start with true to show loading state

  const handleUpdate = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  return (
    <View>
      {needsUpdate ? (
        <>
          <Text>New version {version} available!</Text>
          <Button title="Update Now" onPress={handleUpdate} />
        </>
      ) : (
        <Text>You have the latest version</Text>
      )}
    </View>
  );
}
```

### Configuration

The package requires you to configure your app's bundle identifiers to match your published apps. You can do this by calling `configureApp()` with your bundle identifiers from your `app.json`:

```typescript
import { configureApp } from 'expo-needs-update';

// Configure with your app.json values
configureApp({
  iosBundleIdentifier: 'com.philliplakis.cool', // From app.json ios.bundleIdentifier
  androidPackageName: 'com.philliplakis', // From app.json android.package
  country: 'us', // Optional, defaults to 'us'
});
```

**Your app.json should look like this:**
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.philliplakis.cool"
    },
    "android": { 
      "package": "com.philliplakis"
    }
  }
}
```

## API Reference

### `configureApp(config: AppConfig)`

Configures the app's bundle identifiers for store lookups.

**Parameters:**
- `config.iosBundleIdentifier` (optional): iOS bundle identifier from app.json
- `config.androidPackageName` (optional): Android package name from app.json
- `config.country` (optional): Country code for App Store (defaults to 'us')

**Example:**
```typescript
configureApp({
  iosBundleIdentifier: 'com.yourcompany.yourapp',
  androidPackageName: 'com.yourcompany.yourapp',
  country: 'us' // Optional, defaults to 'us'
});
```

### `useNeedsUpdate(initialValue?: boolean)`

A React hook that checks if your app needs to be updated.

**Parameters:**
- `initialValue` (optional): Initial value for `needsUpdate` state. Defaults to `false`.

**Returns:** An object with the following properties:
- `needsUpdate: boolean` - Whether an update is available
- `version: string` - The latest version available in the store
- `storeUrl: string` - Direct link to the app store page

### `getAppConfig()`

Gets the current app configuration.

**Returns:** Object containing the current bundle identifiers.

### `getCurrentBundleIdentifier()`

Gets the bundle identifier for the current platform.

**Returns:** Bundle identifier string for the current platform (iOS/Android).

### `getCountry()`

Gets the configured country code.

**Returns:** Country code string (defaults to 'us').

### Platform Detection

The package also exports platform detection utilities:

```typescript
import { isIos, isAndroid } from 'expo-needs-update';

if (isIos) {
  // iOS-specific logic
}

if (isAndroid) {
  // Android-specific logic
}
```

## How It Works

1. **Version Detection**: Uses `expo-application` to get the current app version
2. **Store Checking**: 
   - **iOS**: Queries the iTunes Search API to get the latest App Store version
   - **Android**: Scrapes the Google Play Store page to get the latest version
3. **Version Comparison**: Uses semantic versioning to compare versions
4. **Store Links**: Provides direct links to open the respective app stores

## Important Notes

- This package checks against published store versions, not Expo Updates
- Requires internet connection to check store versions
- Store version checking may be rate-limited
- Make sure your bundle identifiers match your published apps
- The hook runs automatically when the component mounts

## Error Handling

The hook gracefully handles errors:
- Network failures return empty version strings
- Invalid version formats are handled safely
- Store API failures don't crash the app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/philliplakis/expo-needs-update/issues).
