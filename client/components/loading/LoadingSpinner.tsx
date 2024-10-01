import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { useEffect, useState } from "react";

interface Props {
  fullScreen?: boolean;
  size?: "small" | "large";
  color?: string;
  text?: string;
  style?: any;
  error?: boolean;
  fetchFunction?: () => void;
}

export default function LoadingSpinner({
  fullScreen,
  size,
  color,
  text,
  style,
  error,
  fetchFunction,
}: Props) {
  const [dots, setDots] = useState(0);
  const maxDots = 3;
  const [tries, setTries] = useState(1);

  useEffect(() => {
    if (!error) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots + 1) % (maxDots + 1));
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  console.log("d");

  return (
    <View
      style={[
        fullScreen ? styles.fullScreenContainer : styles.inlineContainer,
        style,
      ]}
    >
      {error ? (
        <>
          <ThemedText style={styles.text}>
            Error al cargar la información
          </ThemedText>
          {tries < 3 ? (
            <TouchableOpacity style={styles.retry_button}>
              <ThemedText
                style={styles.retry_button_text}
                onPress={() => {
                  setTries(tries + 1);
                  if (fetchFunction) fetchFunction();
                }}
              >
                Intentar de nuevo ({tries}/3)
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedText style={styles.text}>
              Vuelve a intentarlo mas tarde ({tries}/3)
            </ThemedText>
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
