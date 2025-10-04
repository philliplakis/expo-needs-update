import React from "react";
import { View, Text, Button, StyleSheet, Linking } from "react-native";
import { useNeedsUpdate, configureApp } from "../build";

// Configure the app with your bundle identifiers
// This should match your app.json configuration
configureApp({
  iosBundleIdentifier: "com.philliplakis.cool", // From app.json ios.bundleIdentifier
  androidPackageName: "com.philliplakis", // From app.json android.package
  country: "us", // Optional, defaults to "us"
});

export default function UpdateCheckerExample() {
  const { needsUpdate, version, storeUrl } = useNeedsUpdate();

  const handleOpenStore = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  if (needsUpdate) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Update Available!</Text>
        <Text style={styles.text}>
          A new version ({version}) is available in the store.
        </Text>
        <Button title="Update Now" onPress={handleOpenStore} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App is up to date</Text>
      <Text style={styles.text}>You have the latest version installed.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
