import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

interface Props {
  user: {
    _id: string;
    name: string;
    last_name: string;
    email: string;
    profile_picture?: {
      public_id: string;
      secure_url: string;
    };
    flight_hours?: number;
    buyed_planes: [object];
    rented_planes: [object];
    reviews_given: [object];
    reviews_received: [object];
    documents: [object];
    created_at?: Date;
  };
  setTab: (tab: string) => void;
}

export default function ProfileBody({ user, setTab }: Props) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.follows_container}>
        <ThemedView style={styles.follows_div}>
          <ThemedText style={styles.text_amount}>800</ThemedText>
          <ThemedText style={styles.text_description}>Seguidores</ThemedText>
        </ThemedView>
        <ThemedView style={styles.follows_div}>
          <ThemedText style={styles.text_amount}>743</ThemedText>
          <ThemedText style={styles.text_description}>Seguidos</ThemedText>
        </ThemedView>
      </ThemedView>

      <ScrollView style={styles.cards_container}>
        <ThemedView style={styles.card}>
          <ThemedView style={styles.card_icon}>
            <MaterialCommunityIcons
              name='airplane-clock'
              size={24}
              color={"#2B63AA"}
            />
          </ThemedView>
          <ThemedView style={styles.text_card_container}>
            <ThemedText style={styles.text_card_description}>
              Horas de vuelo:
            </ThemedText>
            <ThemedText style={styles.text_card_value}>
              {user.flight_hours}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText
          style={{ color: "gray", marginBottom: 10, textAlign: "center" }}
        >
          Pulsa para obtener más información
        </ThemedText>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setTab("profile-documents")}
        >
          <ThemedView style={styles.card_icon}>
            <Ionicons name='documents' size={24} color='#2B63AA' />
          </ThemedView>
          <ThemedView style={styles.text_card_container}>
            <ThemedText style={styles.text_card_description}>
              Documentos:
            </ThemedText>
            <ThemedText style={styles.text_card_value}>
              {user.documents.length}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setTab("profile-buyed-planes")}
        >
          <ThemedView style={styles.card_icon}>
            <MaterialCommunityIcons
              name='airplane-plus'
              size={24}
              color='#2B63AA'
            />
          </ThemedView>
          <ThemedView style={styles.text_card_container}>
            <ThemedText style={styles.text_card_description}>
              Aeronaves compradas:
            </ThemedText>
            <ThemedText style={styles.text_card_value}>
              {user.buyed_planes.length}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setTab("profile-rented-planes")}
        >
          <ThemedView style={styles.card_icon}>
            <MaterialCommunityIcons
              name='airplane-takeoff'
              size={24}
              color='#2B63AA'
            />
          </ThemedView>
          <ThemedView style={styles.text_card_container}>
            <ThemedText style={styles.text_card_description}>
              Aeronaves alquiladas:
            </ThemedText>
            <ThemedText style={styles.text_card_value}>
              {user.rented_planes.length}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setTab("profile-reviews")}
        >
          <ThemedView style={styles.card_icon}>
            <Ionicons name='star' size={24} color='#2B63AA' />
          </ThemedView>
          <ThemedView style={styles.text_card_container}>
            <ThemedText style={styles.text_card_description}>
              Reseñas:
            </ThemedText>
            <ThemedText style={styles.text_card_value}>
              {user.reviews_given.length + user.reviews_received.length}
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {},
  follows_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  follows_div: {
    alignItems: "center",
    gap: 3,
  },
  text_amount: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
  },
  text_description: {
    fontSize: 16,
    color: "gray",
    fontWeight: "500",
  },
  cards_container: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#00000020",
    borderRadius: 10,
    height: 75,
    marginBottom: 10,
  },
  text_card_container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingLeft: 5,
    paddingRight: 20,
  },
  card_icon: {
    justifyContent: "center",
    backgroundColor: "#00000030",
    padding: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: "100%",
  },
  text_card_description: {
    fontSize: 16,
    color: "#2B63AA",
    fontWeight: "600",
  },
  text_card_value: {
    fontSize: 18,
    color: "gray",
    fontWeight: "bold",
  },
});
