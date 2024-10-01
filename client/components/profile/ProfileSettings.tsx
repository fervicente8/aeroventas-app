import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import ProfileSettingsProfile from "./ProfileSettingsProfile";
import ProfileSettingsMenu from "./ProfileSettingsMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface Props {
  user: {
    _id: string;
    name: string;
    last_name: string;
    password: string;
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
  };
  setUser: (user: any) => void;
  setShowAlert: (value: any) => void;
  onLogout: () => void;
}

export default function ProfileSettings({
  user,
  setUser,
  setShowAlert,
  onLogout,
}: Props) {
  const [tab, setTab] = useState("settings-menu");

  return (
    <ThemedView style={styles.container}>
      {tab !== "settings-menu" && (
        <TouchableOpacity
          onPress={() => setTab("settings-menu")}
          style={styles.back_button}
        >
          <MaterialCommunityIcons
            name='chevron-left'
            size={30}
            color='#2B63AA'
          />
        </TouchableOpacity>
      )}

      {tab === "settings-menu" ? (
        <>
          <ThemedText style={styles.title}>Menu</ThemedText>
          <ProfileSettingsMenu onLogout={onLogout} setTab={setTab} />
        </>
      ) : (
        <>
          <ThemedText style={styles.title}>Datos de tu cuenta</ThemedText>
          <ProfileSettingsProfile
            user={user}
            setUser={setUser}
            setShowAlert={setShowAlert}
          />
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    padding: 20,
    position: "relative",
  },
  back_button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    position: "absolute",
    top: 16,
    left: 10,
    zIndex: 2,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 18,
    marginBottom: 20,
    textAlign: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    color: "gray",
  },
});
