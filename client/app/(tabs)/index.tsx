import { Image, StyleSheet, ScrollView } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Link } from "expo-router";
import Searcher from "@/components/searcher/Searcher";

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
          <ThemedText style={styles.title}>Encuentra tu aeronave</ThemedText>
          <Searcher />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.redirectContainer}>
        <TabBarIcon
          style={styles.icon}
          name={"pricetags-outline"}
          color={"#2B63AA"}
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
        <TabBarIcon
          style={styles.icon}
          name={"stopwatch-outline"}
          color={"#2B63AA"}
        />
        <ThemedText
          type='defaultSemiBold'
          style={{ textTransform: "uppercase" }}
        >
          Alquila
        </ThemedText>
        <ThemedText style={styles.description}>
          Alquila tu avión ideal y explora los cielos.
        </ThemedText>
        <Link href='/rent-catalog'>
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
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textAlign: "center",
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
  },
});
