import { Image, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Card(props: {
  _id: string;
  model: string;
  price: number;
  manufacture_year: number;
  images: any[];
}) {
  const priceFormatted = props.price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <Link href={`/buy-plane/${props._id}`} asChild>
      <Pressable style={styles.card_container}>
        <Image
          source={{ uri: props.images[0].secure_url }}
          style={styles.card_img}
        />
        <ThemedView style={styles.card_content_container}>
          <ThemedText
            style={{
              fontWeight: "bold",
              textTransform: "uppercase",
              maxWidth: "100%",
              marginBottom: 5,
            }}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {props.model}
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
    shadowRadius: 1,
    elevation: 2,
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
