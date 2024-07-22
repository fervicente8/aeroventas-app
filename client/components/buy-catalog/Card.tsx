import { Image, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Card(props: {
  id: number;
  model: string;
  price: number;
  manufacture_year: number;
  images: string[];
}) {
  let modelFormatted;
  if (props.model.length > 18) {
    modelFormatted = props.model.substring(0, 18 - 3) + "...";
  } else {
    modelFormatted = props.model;
  }

  const priceFormatted = props.price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <Link href={`/buy-plane/${props.id}`} asChild>
      <Pressable style={styles.card_container}>
        <Image source={{ uri: props.images[0] }} style={styles.card_img} />
        <ThemedView style={styles.card_content_container}>
          <ThemedText
            style={{
              fontWeight: "bold",
              textTransform: "uppercase",
              maxWidth: "100%",
              marginBottom: 5,
            }}
          >
            {modelFormatted}
          </ThemedText>
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
              marginBottom: 5,
            }}
          >
            <Ionicons name='calendar-outline' size={18} color='#2B63AA' />
            <ThemedText>Año: {props.manufacture_year}</ThemedText>
          </ThemedView>
          <ThemedText
            style={{
              fontWeight: "bold",
              color: "#2B63AA",
              fontSize: 18,
            }}
          >
            ${priceFormatted}
          </ThemedText>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card_container: {
    flex: 1,
    height: 300,
    position: "relative",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowRadius: 3,
    elevation: 5,
    maxWidth: "50%",
  },
  card_img: {
    width: "100%",
    height: 190,
  },
  card_content_container: {
    padding: 10,
    backgroundColor: "transparent",
  },
});
