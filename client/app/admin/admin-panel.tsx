import { ScrollView, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import MenuCard from "@/components/admin/menu/MenuCard";
import { ThemedView } from "@/components/ThemedView";

export default function AdminPanel() {
  return (
    <>
      <Stack.Screen options={{ title: "Panel de administrador" }} />
      <ScrollView style={styles.scroll_container}>
        <ThemedView style={styles.container}>
          <MenuCard
            title='Administrar usuarios'
            icon='person'
            redirectTo='/admin/admin-users'
          />
          <MenuCard
            title='Datos de la tienda'
            icon='settings'
            redirectTo='/admin/admin-store-data'
          />
          <MenuCard
            title='Aeroventas'
            icon='pricetags'
            redirectTo='/admin/admin-aeroventas'
          />
          <MenuCard
            title='Aeroalquila'
            icon='stopwatch'
            redirectTo='/admin/admin-aeroalquila'
          />
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll_container: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    padding: 5,
    gap: 5,
  },
});
