import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AdminOptionCard from "@/components/admin/components/AdminOptionCard";
import AddAirplane from "@/components/admin/aeroventas/AddAirplane";
import ManageAirplanes from "@/components/admin/aeroventas/ManageAirplanes";
import Alert from "@/components/alerts/Alert";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function AdminAeroventas() {
  const [loadingPlanes, setLoadingPlanes] = useState(true);
  const [planes, setPlanes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("aeroventas-menu");
  const [showAlert, setShowAlert] = useState<{
    message: string;
  } | null>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPlanes = async () => {
      setLoadingPlanes(true);
      const response = await fetch(`${apiUrl}/get-all-buy-planes`);
      const data = await response.json();
      setPlanes(data);
      setLoadingPlanes(false);
    };
    fetchPlanes();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{ title: "Panel de administrador - Aeroventas" }}
      />
      <ThemedView style={styles.container}>
        {showAlert && (
          <Alert
            closeAlert={() => setShowAlert(null)}
            message={showAlert.message}
          />
        )}
        {selectedTab !== "aeroventas-menu" && (
          <TouchableOpacity
            onPress={() => {
              selectedTab === "aeroventas-manage-airplanes-edit"
                ? setSelectedTab("aeroventas-manage-airplanes")
                : setSelectedTab("aeroventas-menu");
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
        {selectedTab === "aeroventas-menu" ? (
          <ScrollView>
            <ThemedText style={styles.title}>Aeroventas</ThemedText>
            <AdminOptionCard
              title='Administrar aviones'
              icon='airplane-cog'
              tabToRedirect='aeroventas-manage-airplanes'
              setTab={setSelectedTab}
            />
            <AdminOptionCard
              title='Agregar avión'
              icon='airplane-plus'
              tabToRedirect='aeroventas-add-airplane'
              setTab={setSelectedTab}
            />
          </ScrollView>
        ) : selectedTab === "aeroventas-manage-airplanes" ||
          selectedTab === "aeroventas-manage-airplanes-edit" ? (
          <>
            <ThemedText style={styles.title}>Administrar aviones</ThemedText>
            <ManageAirplanes
              loadingPlanes={loadingPlanes}
              setShowAlert={setShowAlert}
              planes={planes}
              setPlanes={setPlanes}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </>
        ) : selectedTab === "aeroventas-add-airplane" ? (
          <>
            <ThemedText style={styles.title}>Agregar avión</ThemedText>
            <AddAirplane
              setShowAlert={setShowAlert}
              planes={planes}
              setPlanes={setPlanes}
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
