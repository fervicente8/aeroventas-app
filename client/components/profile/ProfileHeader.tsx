import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface Props {
  name: string;
  last_name: string;
  profile_picture?: {
    public_id: string;
    secure_url: string;
  };
  selectedTab: string;
  setTab: (tab: string) => void;
}

export default function ProfileHeader({
  name,
  last_name,
  profile_picture,
  selectedTab,
  setTab,
}: Props) {
  return (
    <ThemedView style={styles.total_container}>
      {/* <TouchableOpacity
        style={styles.logout_button}
        onPress={async () => {
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("user");
          onLogout();
        }}
      >
        <Ionicons name='exit-outline' size={24} color='#DA373A' />
      </TouchableOpacity> */}
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.text_edit_button_container}>
          {selectedTab !== "profile" ? (
            <>
              <TouchableOpacity onPress={() => setTab("profile")}>
                <Ionicons name='chevron-back-outline' size={28} color='white' />
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
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  total_container: {
    backgroundColor: "#2B63AA",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  container: {
    paddingTop: 5,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  text_edit_button_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: 30,
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
    width: 140,
    height: 140,
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
});
