import { StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Carousel from "react-native-reanimated-carousel";

import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import AddDocument from "./AddDocument";

interface Document {
  type: string;
  files_url: [string];
  created_at: Date;
  status: string;
}

interface Props {
  document?: Document;
  type: string;
  isAdding: string;
  setUser: (value: any) => void;
  setIsAdding: (value: string) => void;
  setShowAlert: (value: any) => void;
}

export default function DocumentComponent({
  document,
  type,
  isAdding,
  setUser,
  setIsAdding,
  setShowAlert,
}: Props) {
  const width = Dimensions.get("window").width;

  return (
    <ThemedView style={styles.document_container}>
      <ThemedText style={styles.document_title}>
        {type === "dni"
          ? "Documento Nacional de Identidad (DNI)"
          : type === "license"
          ? "Licencia de Piloto (Privado o Comercial)"
          : "Certificación Médica Aeronautica (CMA)"}
      </ThemedText>
      {document !== undefined ? (
        <ThemedView style={styles.document_image_container}>
          <Carousel
            width={width - 40}
            height={240}
            autoPlay={false}
            vertical={false}
            data={document.files_url}
            renderItem={({ item }) => (
              <Image style={styles.document_image} source={{ uri: item }} />
            )}
          />
          {document.status === "pending" ? (
            <ThemedText
              style={[styles.document_status, styles.document_status_pending]}
            >
              Pendiente
            </ThemedText>
          ) : document.status === "accepted" ? (
            <ThemedText
              style={[styles.document_status, styles.document_status_approved]}
            >
              Aprobado
            </ThemedText>
          ) : (
            <ThemedText
              style={[styles.document_status, styles.document_status_rejected]}
            >
              Rechazado
            </ThemedText>
          )}
          <ThemedText style={styles.document_slide_text}>
            Desliza para ver más
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.no_document_container}>
          {isAdding !== type ? (
            <>
              <ThemedText style={{ color: "white", fontSize: 14 }}>
                Agregá tu documento
              </ThemedText>
              <TouchableOpacity onPress={() => setIsAdding(type)}>
                <MaterialCommunityIcons
                  name='plus-circle'
                  size={34}
                  color='white'
                />
              </TouchableOpacity>
            </>
          ) : (
            <AddDocument
              type={type}
              setIsAdding={setIsAdding}
              setUser={setUser}
              setShowAlert={setShowAlert}
            />
          )}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  document_container: {
    padding: 10,
    borderWidth: 1.1,
    backgroundColor: "#2B63AA",
    borderColor: "#2B63AA",
    borderRadius: 5,
    marginBottom: 10,
  },
  document_title: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },
  document_image_container: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 5,
  },
  document_image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  document_status: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "white",
    padding: 5,
    borderBottomLeftRadius: 5,
  },
  document_status_pending: {
    backgroundColor: "orange",
  },
  document_status_approved: {
    backgroundColor: "green",
  },
  document_status_rejected: {
    backgroundColor: "red",
  },
  document_slide_text: {
    backgroundColor: "#00000050",
    padding: 3,
    color: "white",
    borderTopLeftRadius: 5,
    position: "absolute",
    bottom: 0,
    right: 0,
    fontSize: 14,
  },
  no_document_container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
