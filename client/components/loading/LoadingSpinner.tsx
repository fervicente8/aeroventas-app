import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { useEffect, useState } from "react";
import { ThemedView } from "../ThemedView";

interface Props {
  fullScreen?: boolean;
  size?: "small" | "large";
  color?: string;
  text?: string;
  style?: any;
  error?: boolean;
  fetchFunction?: () => void;
  setTries?: (value: number) => void;
  tries?: number;
}

export default function LoadingSpinner({
  fullScreen,
  size,
  color,
  text,
  style,
  error,
  fetchFunction,
  setTries,
  tries,
}: Props) {
  const [dots, setDots] = useState(0);
  const maxDots = 3;

  useEffect(() => {
    if (!error) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots + 1) % (maxDots + 1));
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (error && setTries && tries && fetchFunction) {
      if (tries < 3) {
        setTimeout(() => {
          setTries(tries + 1);
          fetchFunction();
        }, 1000);
      } else {
        setTimeout(() => {
          setTries(4);
        }, 1000);
      }
    }
  }, [tries]);

  return (
    <View
      style={[
        fullScreen ? styles.fullScreenContainer : styles.inlineContainer,
        style,
      ]}
    >
      {error && setTries && tries ? (
        <>
          <ThemedText style={styles.text}>
            Error al cargar la información
          </ThemedText>
          {tries < 4 ? (
            <ThemedText style={styles.text}>
              Reintentando ({tries}/3)
            </ThemedText>
          ) : (
            <TouchableOpacity
              style={styles.retry_button}
              onPress={() => setTries(1)}
            >
              <ThemedText style={styles.retry_button_text}>
                Intentar nuevamente
              </ThemedText>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          <ActivityIndicator size={size} color={color ? color : "#2B63AA"} />
          {text && (
            <ThemedText style={styles.text}>
              {text}
              {".".repeat(dots)}
            </ThemedText>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 999,
  },
  inlineContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    color: "#2B63AA",
    fontSize: 15,
    fontWeight: "600",
  },
  retry_button: {
    marginTop: 10,
    backgroundColor: "#2B63AA",
    padding: 10,
    borderRadius: 5,
  },
  retry_button_text: {
    color: "white",
    fontWeight: "bold",
  },
});
