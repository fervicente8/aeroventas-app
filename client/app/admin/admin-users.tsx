import { useState } from "react";
import { TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AdminOptionCard from "@/components/admin/components/AdminOptionCard";
import Alert from "@/components/alerts/Alert";
import UsersList from "@/components/admin/users/UsersList";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ManagePendingDocuments from "@/components/admin/users/ManagePendingDocuments";

export default function AdminUsers() {
  const [selectedTab, setSelectedTab] = useState("users-menu");
  const [showAlert, setShowAlert] = useState<{
    message: string;
  } | null>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const verifyTabManageDocuments = () => {
    if (
      selectedTab === "users-manage-documents-pending" ||
      selectedTab === "users-manage-documents-approved" ||
      selectedTab === "users-manage-documents-rejected"
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Panel de administrador - Usuarios" }} />
      <ThemedView style={styles.container}>
        {showAlert && (
          <Alert
            closeAlert={() => setShowAlert(null)}
            message={showAlert.message}
          />
        )}
        {selectedTab !== "users-menu" && (
          <TouchableOpacity
            onPress={() => {
              selectedTab === "users-list-manage-user"
                ? setSelectedTab("users-list")
                : verifyTabManageDocuments()
                ? setSelectedTab("users-manage-documents")
                : selectedTab === "users-list-manage-user-documents"
                ? setSelectedTab("users-list-manage-user")
                : setSelectedTab("users-menu");
            }}
            style={styles.back_button}
          >
            <MaterialCommunityIcons
              name='chevron-left'
              size={30}
              color='#2B63AA'
            />
          </TouchableOpacity>
        )}
        {selectedTab === "users-menu" ? (
          <ScrollView>
            <ThemedText style={styles.title}>Usuarios</ThemedText>
            <AdminOptionCard
              title='Lista de usuarios'
              icon='account-group'
              tabToRedirect='users-list'
              setTab={setSelectedTab}
            />
            <AdminOptionCard
              title='Gestionar documentos'
              icon='file-document-edit'
              tabToRedirect='users-manage-documents'
              setTab={setSelectedTab}
            />
          </ScrollView>
        ) : selectedTab === "users-list" ||
          selectedTab === "users-list-manage-user" ||
          selectedTab === "users-list-manage-user-documents" ? (
          <>
            <ThemedText style={styles.title}>Lista de usuarios</ThemedText>
            <UsersList
              apiUrl={apiUrl}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              setShowAlert={setShowAlert}
            />
          </>
        ) : selectedTab === "users-manage-documents" ||
          verifyTabManageDocuments() ? (
          <>
            <ThemedText style={styles.title}>Gestionar documentos</ThemedText>
            <ManagePendingDocuments
              apiUrl={apiUrl}
              setShowAlert={setShowAlert}
            />
          </>
        ) : null}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    padding: 20,
    gap: 10,
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
