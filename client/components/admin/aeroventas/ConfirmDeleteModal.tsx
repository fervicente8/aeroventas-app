import { Modal, TouchableOpacity } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function ConfirmDeleteModal({
  isVisible,
  setIsVisible,
  setDeleteId,
  onDelete,
}: {
  isVisible: boolean;
  setIsVisible: (value: any) => void;
  setDeleteId: (value: any) => void;
  onDelete: () => void;
}) {
  return (
    <Modal
      animationType='slide'
      transparent
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false);
        setDeleteId("");
      }}
    >
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <ThemedView
          style={{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <ThemedText
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Confirmar eliminación
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            ¿Estás seguro de que deseas eliminar esta aeronave?
          </ThemedText>
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={{
                flex: 1,
                paddingVertical: 8,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
            >
              <ThemedText>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              style={{
                flex: 1,
                paddingVertical: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#DA373A",
                borderRadius: 8,
              }}
            >
              <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>
                Eliminar
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}
