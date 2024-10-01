import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AdminOptionCard from "../components/AdminOptionCard";

interface Document {
  _id: string;
  type: string;
  files_url: [string];
  created_at: Date;
  status: string;
}

interface Props {
  userId: string;
  apiUrl: string | undefined;
  document: Document;
  setDocuments: (value: any) => void;
  setShowAlert: (value: any) => void;
  faster?: boolean;
  documents?: any;
}

export default function DocumentComponent({
  userId,
  apiUrl,
  document,
  setDocuments,
  setShowAlert,
  faster,
  documents,
}: Props) {
  const [openModalCarousel, setOpenModalCarousel] = useState(false);
  const [imagesHeight, setImagesHeight] = useState(0);
  const [openSettings, setOpenSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState(0);
  const date = new Date(document?.created_at);
  const formatedDate = date.toLocaleDateString("es-AR");

  const translateType = (type: string) => {
    if (type === "dni") {
      return "Documento Nacional de Identidad (DNI)";
    } else if (type === "license") {
      return "Licencia de Piloto (Privado o Comercial)";
    } else {
      return "Certificación Médica Aeronautica (CMA)";
    }
  };

  useEffect(() => {
    if (document.files_url[0]) {
      Image.getSize(document.files_url[0], (width, height) => {
        const ratio = width / height;
        const calculatedHeight = Dimensions.get("window").width / ratio;
        setImagesHeight(calculatedHeight);
      });
    }
  }, [document.files_url[0]]);

  const verifyStatus = (status: string, option: string) => {
    if (status === option) {
      return true;
    } else {
      return false;
    }
  };

  const filterFromDocumentsById = (documentId: string) => {
    return documents.filter(
      (arrayDoc: any) => arrayDoc.document._id !== documentId
    );
  };

  const changeStatus = async (status: string) => {
    try {
      const response = await fetch(`${apiUrl}/update-document-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          documentId: document._id,
          status: status,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setOpenSettings(false);
        if (faster) {
          setDocuments(filterFromDocumentsById(document._id));
        } else {
          setDocuments(data);
        }
        setShowAlert({
          message: "Cambio de estado exitoso",
        });
      } else if (response.status === 404) {
        setOpenSettings(false);
        setShowAlert({
          message: "Error al buscar el usuario o el documento",
        });
      }
    } catch (error) {
      setOpenSettings(false);
      setShowAlert({
        message: "Error al cambiar el estado del documento",
      });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={() => setOpenModalCarousel(true)}>
        <Image style={styles.image} source={{ uri: document?.files_url[0] }} />
      </TouchableOpacity>
      <ThemedView style={styles.content_container}>
        <ThemedText ellipsizeMode='tail' numberOfLines={2} style={styles.title}>
          {translateType(document?.type)}
        </ThemedText>
        <ThemedText style={styles.date} ellipsizeMode='tail' numberOfLines={1}>
          Desde {formatedDate}
        </ThemedText>
      </ThemedView>
      {faster ? (
        <ThemedView style={styles.icon_container}>
          <TouchableOpacity onPress={() => changeStatus("rejected")}>
            <MaterialCommunityIcons name='close' size={28} color='#DA373A' />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeStatus("accepted")}>
            <MaterialCommunityIcons name='check' size={28} color='#008f39' />
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setOpenSettings(true)}
        >
          <Ionicons name='settings' size={24} color='#2B63AA' />
        </TouchableOpacity>
      )}

      <Modal visible={openModalCarousel} animationType='slide' transparent>
        <ThemedView style={styles.modal_container}>
          <TouchableOpacity
            style={{ position: "absolute", right: 10, top: 10, zIndex: 1 }}
            onPress={() => setOpenModalCarousel(false)}
          >
            <Ionicons name='close' size={32} color='white' />
          </TouchableOpacity>
          <Carousel
            width={Dimensions.get("window").width}
            height={200}
            data={document.files_url}
            mode='parallax'
            modeConfig={{
              parallaxScrollingScale: 1,
              parallaxScrollingOffset: 0,
            }}
            renderItem={({ item }) => (
              <Image
                style={{ width: "100%", height: imagesHeight }}
                source={{ uri: item }}
                resizeMode='cover'
              />
            )}
            style={{ flex: 1, alignItems: "center" }}
          />
        </ThemedView>
      </Modal>

      <Modal visible={openSettings} animationType='fade' transparent>
        <ThemedView style={styles.modal_container}>
          <TouchableOpacity
            style={{ position: "absolute", right: 10, top: 10, zIndex: 1 }}
            onPress={() => setOpenSettings(false)}
          >
            <Ionicons name='close' size={32} color='white' />
          </TouchableOpacity>
          <ThemedView style={styles.settings_container}>
            {settingsTab === 0 ? (
              <ThemedView style={styles.config_title_container}>
                <ThemedText style={styles.config_title}>
                  Configuración
                </ThemedText>
              </ThemedView>
            ) : settingsTab === 1 ? (
              <ThemedView style={styles.config_title_container}>
                <TouchableOpacity
                  style={styles.config_back_button}
                  onPress={() => setSettingsTab(0)}
                >
                  <Ionicons name='chevron-back' size={24} color='#2B63AA' />
                </TouchableOpacity>
                <ThemedText style={styles.config_title} ellipsizeMode='tail'>
                  Actualiza el estado del documento
                </ThemedText>
              </ThemedView>
            ) : (
              <ThemedView style={styles.config_title_container}>
                <TouchableOpacity
                  style={styles.config_back_button}
                  onPress={() => setSettingsTab(0)}
                >
                  <Ionicons name='chevron-back' size={24} color='#2B63AA' />
                </TouchableOpacity>
                <ThemedText style={styles.config_title} ellipsizeMode='tail'>
                  Eliminar el documento
                </ThemedText>
              </ThemedView>
            )}
            {settingsTab === 0 ? (
              <>
                <AdminOptionCard
                  title='Actualizar'
                  icon='trash-can'
                  tabToRedirect='1'
                  setTab={() => {
                    setSettingsTab(1);
                  }}
                />
                <AdminOptionCard
                  title='Eliminar'
                  icon='trash-can'
                  tabToRedirect='2'
                  marginBottomOff
                  setTab={() => {
                    setSettingsTab(2);
                  }}
                  iconColor='#DA373A'
                />
              </>
            ) : settingsTab === 1 ? (
              <>
                <AdminOptionCard
                  title='Pendiente'
                  icon='check'
                  tabToRedirect='1'
                  setTab={() => {
                    changeStatus("pending");
                  }}
                  disabled={verifyStatus("pending", document.status)}
                />
                <AdminOptionCard
                  title='Aprobado'
                  icon='check'
                  tabToRedirect='1'
                  setTab={() => {
                    changeStatus("accepted");
                  }}
                  disabled={verifyStatus("accepted", document.status)}
                  iconColor='#008f39'
                />
                <AdminOptionCard
                  title='Rechazado'
                  icon='close'
                  tabToRedirect='1'
                  setTab={() => {
                    changeStatus("rejected");
                  }}
                  disabled={verifyStatus("rejected", document.status)}
                  iconColor='#DA373A'
                />
              </>
            ) : (
              <ThemedView style={styles.set_document_container}></ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 112,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderColor: "#2B63AA",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  image: {
    width: 140,
    height: 110,
    resizeMode: "cover",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  content_container: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  title: {
    fontWeight: "600",
    color: "#2B63AA",
    overflow: "hidden",
  },
  date: {
    color: "#333333",
  },
  icon_container: {
    flexDirection: "row",
    position: "absolute",
    gap: 10,
    right: 5,
    bottom: 5,
  },
  icon: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  modal_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000090",
  },
  settings_container: {
    width: "88%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  config_title_container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    borderBottomColor: "#2B63AA",
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  config_title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2B63AA",
    textAlign: "center",
    maxWidth: "90%",
  },
  config_back_button: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
  },
  set_document_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
