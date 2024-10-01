import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface Props {
  setTab: (tab: string) => void;
  onLogout: () => void;
}

export default function ProfileSettingsMenu({ setTab, onLogout }: Props) {
  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setTab("settings-profile")}
      >
        <ThemedView style={styles.card_icon}>
          <MaterialCommunityIcons
            name='account-settings'
            size={24}
            color='#2B63AA'
          />
        </ThemedView>
        <ThemedView style={styles.text_card_container}>
          <ThemedText style={styles.text_card_description}>
            Datos de tu cuenta
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setTab("settings-flights-data")}
      >
        <ThemedView style={styles.card_icon}>
          <MaterialCommunityIcons
            name='airplane-cog'
            size={24}
            color='#2B63AA'
          />
        </ThemedView>
        <ThemedView style={styles.text_card_container}>
          <ThemedText style={styles.text_card_description}>
            Datos de vuelo
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => onLogout()}>
        <ThemedView style={styles.card_icon}>
          <MaterialCommunityIcons
            name='logout-variant'
            size={24}
            color='#DA373A'
          />
        </ThemedView>
        <ThemedView style={styles.text_card_container}>
          <ThemedText style={styles.text_card_description_logout}>
            Cerrar sesión
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
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
  text_card_description_logout: {
    fontSize: 16,
    color: "#DA373A",
    fontWeight: "600",
  },
});
