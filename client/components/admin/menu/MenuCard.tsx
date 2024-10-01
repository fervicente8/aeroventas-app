import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../../ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Href, Link } from "expo-router";

interface Props {
  title: string;
  icon: "person" | "settings" | "pricetags" | "stopwatch";
  redirectTo: string;
}

export default function MenuCard({ title, icon, redirectTo }: Props) {
  return (
    <Link href={redirectTo as Href<string>} asChild>
      <TouchableOpacity style={styles.container}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <Ionicons name={icon} size={40} color='white' />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 150,
    height: 180,
    padding: 10,
    backgroundColor: "#2B63AA",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
