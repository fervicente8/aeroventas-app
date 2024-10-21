import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function BuyCatalog() {
  let { mode } = useLocalSearchParams();
  const [modeState, setModeState] = useState<any>("none");

  useEffect(() => {
    if (mode !== undefined) {
      setModeState(mode);
    }
  }, [mode]);

  if (modeState === "none") {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.mode_container}
          onPress={() => setModeState("plane-ticket")}
        >
          <Image
            source={require("@/assets/images/mode-plane-ticket.png")}
            style={styles.mode_image}
          />
          <ThemedView style={styles.overlay} />
          <ThemedText style={styles.mode_text}>Catálogo de pasajes</ThemedText>
          <ThemedText style={styles.mode_description}>
            Busca y compara en nuestro catálogo de pasajes
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mode_container}
          onPress={() => setModeState("pilot")}
        >
          <Image
            source={require("@/assets/images/mode-pilot.png")}
            style={styles.mode_image}
          />
          <ThemedView style={styles.overlay} />
          <ThemedText style={styles.mode_text}>Catálogo de pilotos</ThemedText>
          <ThemedText style={styles.mode_description}>
            Explora nuestra exclusiva red de pilotos altamente capacitados y
            certificados
          </ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  } else if (modeState === "plane-ticket") {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView onTouchEnd={() => setModeState("none")}>
          <ThemedText>Volver</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  } else if (modeState === "pilot") {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView onTouchEnd={() => setModeState("none")}>
          <ThemedText>Volver</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mode_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mode_image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#00000080",
  },
  mode_text: {
    color: "white",
    fontSize: 22,
    fontWeight: "500",
    paddingHorizontal: 10,
  },
  mode_description: {
    color: "white",
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: "center",
    marginTop: 5,
  },
});
