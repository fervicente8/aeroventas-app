import { Image, StyleSheet, ScrollView } from "react-native";
import Searcher from "@/components/searcher/Searcher";
import { Link } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { MaterialIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.homeContainer}>
      <ThemedView style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/home_banner.jpg")}
          style={{ width: "100%", height: "100%" }}
        />
        <Image
          source={require("@/assets/images/icon.png")}
          style={{
            width: 200,
            height: 200,
            position: "absolute",
            top: 20,
            left: "50%",
            transform: [{ translateX: -100 }],
          }}
        />
        <ThemedView style={styles.searcherContainer}>
          <ThemedText style={styles.title}>¿Que estás buscando hoy?</ThemedText>
          <Searcher />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.redirectContainer}>
        <MaterialIcons
          name='airplanemode-on'
          color={"#2B63AA"}
          style={styles.icon}
        />
        <ThemedText
          type='defaultSemiBold'
          style={{ textTransform: "uppercase" }}
        >
          Compra
        </ThemedText>
        <ThemedText style={styles.description}>
          Encuentra los mejores aviones en venta de Argentina.
        </ThemedText>
        <Link
          href={{
            pathname: "/(tabs)/buy-catalog/[cat_brand]",
            params: { cat_brand: "all//all" },
          }}
        >
          <TabBarIcon
            style={styles.redirectIcon}
            name={"arrow-forward-circle-outline"}
            color={"#2B63AA"}
          />
        </Link>
      </ThemedView>
      <ThemedView
        style={{ borderWidth: 0.5, width: "90%", alignSelf: "center" }}
      ></ThemedView>
      <ThemedView style={styles.redirectContainer}>
        <MaterialIcons
          name='airplane-ticket'
          style={styles.icon}
          color={"#2B63AA"}
        />

        <ThemedText
          type='defaultSemiBold'
          style={{ textTransform: "uppercase" }}
        >
          Pasajes
        </ThemedText>
        <ThemedText style={styles.description}>
          Busca tu pasaje ideal.
        </ThemedText>
        <Link
          href={{
            pathname: "/(tabs)/travel-catalog/[mode]",
            params: { mode: "plane-ticket" },
          }}
        >
          <TabBarIcon
            style={styles.redirectIcon}
            name={"arrow-forward-circle-outline"}
            color={"#2B63AA"}
          />
        </Link>
      </ThemedView>
      <ThemedView
        style={{ borderWidth: 0.5, width: "90%", alignSelf: "center" }}
      ></ThemedView>
      <ThemedView style={styles.redirectContainer}>
        <MaterialIcons
          name='person-pin'
          color={"#2B63AA"}
          style={styles.icon}
        />
        <ThemedText
          type='defaultSemiBold'
          style={{ textTransform: "uppercase" }}
        >
          Pilotos
        </ThemedText>
        <ThemedText style={styles.description}>
          Encuentra el piloto ideal.
        </ThemedText>
        <Link
          href={{
            pathname: "/(tabs)/travel-catalog/[mode]",
            params: { mode: "pilot" },
          }}
        >
          <TabBarIcon
            style={styles.redirectIcon}
            name={"arrow-forward-circle-outline"}
            color={"#2B63AA"}
          />
        </Link>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    overflow: "scroll",
    backgroundColor: "white",
  },
  imageContainer: {
    height: 500,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  searcherContainer: {
    width: "100%",
    paddingVertical: 20,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    gap: 10,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: 300,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  redirectContainer: {
    paddingHorizontal: 15,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 30,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  icon: {
    fontSize: 60,
    marginBottom: 10,
  },
  redirectIcon: {
    fontSize: 35,
  },
  description: {
    marginBottom: 10,
    textAlign: "center",
  },
});
