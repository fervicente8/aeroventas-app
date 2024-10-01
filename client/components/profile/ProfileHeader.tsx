import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Link } from "expo-router";

interface Props {
  name: string;
  last_name: string;
  profile_picture?: {
    public_id: string;
    secure_url: string;
  };
  created_at: Date;
  type: string;
  selectedTab: string;
  setTab: (tab: string) => void;
}

export default function ProfileHeader({
  name,
  last_name,
  profile_picture,
  created_at,
  type,
  selectedTab,
  setTab,
}: Props) {
  const date = new Date(created_at);
  const formatedDate = date.toLocaleDateString("es-AR");

  return (
    <ThemedView style={styles.total_container}>
      <SafeAreaView style={styles.container}>
        {type === "admin" && (
          <Link href={"/admin/admin-panel"} asChild>
            <TouchableOpacity style={styles.admin_button}>
              <MaterialIcons
                name='admin-panel-settings'
                size={30}
                color='white'
              />
            </TouchableOpacity>
          </Link>
        )}
        <ThemedView style={styles.text_edit_button_container}>
          {selectedTab !== "profile" ? (
            <>
              <TouchableOpacity
                onPress={() => setTab("profile")}
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Ionicons name='chevron-back-outline' size={28} color='white' />
                <ThemedText
                  style={{ color: "white", fontSize: 18, fontWeight: "600" }}
                >
                  Mi perfil
                </ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ThemedText style={styles.text_profile}>Mi perfil</ThemedText>
              <TouchableOpacity
                style={styles.button_edit_profile}
                onPress={() => setTab("profile-settings")}
              >
                <ThemedText style={styles.text_edit_profile}>
                  Editar perfil
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </ThemedView>
        <ThemedView style={styles.image_text_container}>
          <Image
            source={
              profile_picture?.secure_url
                ? { uri: profile_picture.secure_url }
                : require("@/assets/images/default_profile_picture.png")
            }
            style={styles.profile_picture}
          />
          <ThemedText style={styles.text_name}>
            {name + " " + last_name}
          </ThemedText>
          <ThemedText style={styles.created_at_text}>
            Miembro desde{"\n"}
            {formatedDate}
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  total_container: {
    backgroundColor: "#2B63AA",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: "hidden",
  },
  container: {
    paddingTop: 5,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  text_edit_button_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 10,
    height: 40,
  },
  image_text_container: {
    gap: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  text_profile: {
    fontWeight: "600",
    fontSize: 18,
    color: "white",
  },
  button_edit_profile: {
    backgroundColor: "#ffffff20",
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  text_edit_profile: {
    fontWeight: "600",
    fontSize: 15,
    color: "white",
  },
  profile_picture: {
    width: 120,
    height: 120,
    borderRadius: 70,
    borderColor: "white",
    borderWidth: 1,
  },
  text_name: {
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1.1,
    color: "white",
    textAlign: "center",
  },
  admin_button: {
    position: "absolute",
    bottom: 15,
    left: 15,
    zIndex: 10,
  },
  created_at_text: {
    textAlign: "center",
    color: "white",
    fontSize: 13,
    letterSpacing: 1.2,
    lineHeight: 15,
  },
});
