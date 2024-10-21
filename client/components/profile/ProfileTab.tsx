import { useState } from "react";
import { StyleSheet } from "react-native";
import ProfileHeader from "./ProfileHeader";
import ProfileBody from "./ProfileBody";
import ProfileDocuments from "./ProfileDocuments";
import ProfileBuyedPlanes from "./ProfileBuyedPlanes";
import ProfileReviews from "./ProfileReviews";
import ProfileSettings from "./ProfileSettings";
import Alert from "@/components/alerts/Alert";

import { ThemedView } from "../ThemedView";

interface Document {
  type: string;
  files_url: [string];
  created_at: Date;
  status: string;
}

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
    documents: [Document];
    created_at: Date;
    type: string;
  };
  setUser: (user: any) => void;
  onLogout: () => void;
  loading: boolean;
  onRefresh: () => void;
}

export default function ProfileTab({
  user,
  setUser,
  onLogout,
  loading,
  onRefresh,
}: Props) {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [showAlert, setShowAlert] = useState<{
    message: string;
  } | null>(null);

  return (
    <ThemedView style={styles.container}>
      <ProfileHeader
        name={user.name}
        last_name={user.last_name}
        profile_picture={user.profile_picture}
        documents={user.documents}
        created_at={user.created_at}
        type={user.type}
        selectedTab={selectedTab}
        setTab={setSelectedTab}
      />

      {selectedTab === "profile" ? (
        <ProfileBody
          user={user}
          setTab={setSelectedTab}
          loading={loading}
          onRefresh={onRefresh}
        />
      ) : selectedTab === "profile-documents" ? (
        <ProfileDocuments
          user={user}
          setUser={setUser}
          setShowAlert={setShowAlert}
        />
      ) : selectedTab === "profile-buyed-planes" ? (
        <ProfileBuyedPlanes />
      ) : selectedTab === "profile-reviews" ? (
        <ProfileReviews />
      ) : selectedTab === "profile-settings" ? (
        <ProfileSettings
          user={user}
          setUser={setUser}
          setShowAlert={setShowAlert}
          onLogout={onLogout}
        />
      ) : null}

      {showAlert && (
        <Alert
          closeAlert={() => setShowAlert(null)}
          message={showAlert.message}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
});
