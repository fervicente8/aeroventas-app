import { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    created_at: Date;
    type: string;
  };
  setTab: (tab: string) => void;
  loading: boolean;
  onRefresh: () => void;
}

export default function ProfileBody({
  user,
  setTab,
  loading,
  onRefresh,
}: Props) {
  const [currentUserId, setCurrentUserId] = useState<any>();

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        return;
      }
      const userId = JSON.parse(user)._id;
      setCurrentUserId(userId);
    })();
  }, []);

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.no_user_found}>
          Ha habido un error al cargar el perfil
        </ThemedText>
      </ThemedView>
    );
  }

  const findPilotDocument = () => {
    if (user.documents) {
      const document = user.documents.find(
        (doc: any) =>
          doc.type === "license" &&
          doc.license_type === "comercial" &&
          doc.status === "accepted"
      );
      if (document) {
        return document;
      }
    }
  };

  const isCommercialPilot = () => {
    if (findPilotDocument()) {
      return true;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {isCommercialPilot() && (
          <ThemedView style={styles.card}>
            <ThemedView style={styles.card_icon}>
              <MaterialCommunityIcons
                name='airplane-clock'
                size={22}
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
        )}

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
            <Ionicons name='documents' size={22} color='#2B63AA' />
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
          onPress={() => setTab("profile-reviews")}
        >
          <ThemedView style={styles.card_icon}>
            <Ionicons name='star' size={22} color='#2B63AA' />
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

        {user._id === currentUserId && (
          <ThemedView>
            <ThemedText
              style={{
                color: "gray",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Solo tú puedes ver estos datos
            </ThemedText>
            <TouchableOpacity
              style={styles.card}
              onPress={() => setTab("profile-buyed-planes")}
            >
              <ThemedView style={styles.card_icon}>
                <MaterialCommunityIcons
                  name='airplane-plus'
                  size={22}
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
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  no_user_found: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "gray",
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#00000020",
    borderRadius: 10,
    height: 65,
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
    color: "gray",
    fontWeight: "bold",
  },
});
