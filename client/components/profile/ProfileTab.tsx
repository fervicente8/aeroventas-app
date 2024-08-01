import { useState } from "react";
import { StyleSheet } from "react-native";
import ProfileHeader from "./ProfileHeader";

import { ThemedView } from "../ThemedView";
import ProfileBody from "./ProfileBody";
import ProfileDocuments from "./ProfileDocuments";
import ProfileBuyedPlanes from "./ProfileBuyedPlanes";
import ProfileRentedPlanes from "./ProfileRentedPlanes";
import ProfileReviews from "./ProfileReviews";
import ProfileSettings from "./ProfileSettings";

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
  onLogout: () => void;
}

export default function ProfileTab({ user, onLogout }: Props) {
  const [selectedTab, setSelectedTab] = useState("profile");

  return (
    <ThemedView style={styles.container}>
      <ProfileHeader
        name={user.name}
        last_name={user.last_name}
        profile_picture={user.profile_picture}
        selectedTab={selectedTab}
        setTab={setSelectedTab}
      />

      {selectedTab === "profile" ? (
        <ProfileBody user={user} setTab={setSelectedTab} />
      ) : selectedTab === "profile-documents" ? (
        <ProfileDocuments documents={user.documents} />
      ) : selectedTab === "profile-buyed-planes" ? (
        <ProfileBuyedPlanes />
      ) : selectedTab === "profile-rented-planes" ? (
        <ProfileRentedPlanes />
      ) : selectedTab === "profile-reviews" ? (
        <ProfileReviews />
      ) : selectedTab === "profile-settings" ? (
        <ProfileSettings />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
});
