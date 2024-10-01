import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";

interface Props {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tabToRedirect: string;
  iconColor?: string;
  marginBottomOff?: boolean;
  setTab: (tab: string) => void;
  disabled?: boolean;
}

export default function AdminOptionCard({
  title,
  icon,
  tabToRedirect,
  iconColor,
  marginBottomOff,
  setTab,
  disabled,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        marginBottomOff ? null : { marginBottom: 10 },
        disabled ? { opacity: 0.5 } : null,
      ]}
      onPress={() => setTab(tabToRedirect)}
      disabled={disabled}
    >
      <ThemedView style={styles.card_icon}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={iconColor ? iconColor : "#2B63AA"}
        />
      </ThemedView>
      <ThemedView style={styles.text_card_container}>
        <ThemedText
          style={[
            styles.text_card_description,
            iconColor ? { color: iconColor } : null,
          ]}
        >
          {title}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
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
});
