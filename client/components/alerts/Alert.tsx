import React, { useRef } from "react";
import { StyleSheet, Animated, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "../ThemedView";

interface AlertProps {
  closeAlert: () => void;
  message: string;
  redirectTo?: string;
  redirectToText?: string;
}

export default function Alert({
  closeAlert,
  message,
  redirectTo,
  redirectToText,
}: AlertProps) {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleRedirect = () => {
    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: fadeAnim }] },
      ]}
    >
      <ThemedText style={styles.message}>{message}</ThemedText>
      <ThemedView style={styles.buttons_container}>
        {redirectTo && (
          <ThemedText style={styles.button} onPress={handleRedirect}>
            {redirectToText}
          </ThemedText>
        )}
        <ThemedText onPress={closeAlert} style={styles.button}>
          Cerrar
        </ThemedText>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00000095",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
    gap: 10,
  },
  message: {
    fontSize: 16,
    letterSpacing: 1.2,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  buttons_container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    backgroundColor: "#2B63AA",
    color: "white",
    fontWeight: "600",
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
  },
});
