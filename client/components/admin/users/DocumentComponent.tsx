import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import DateTimePicker from "@react-native-community/datetimepicker";
import AdminOptionCard from "../components/AdminOptionCard";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

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
  const [reviewerId, setReviewerId] = useState();
  const [openModalCarousel, setOpenModalCarousel] = useState(false);
  const [imagesHeight, setImagesHeight] = useState(0);
  const [openSettings, setOpenSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState(0);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [toApprove, setToApprove] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [toReject, setToReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const date = new Date(document?.created_at);
  const formattedDate = date.toLocaleDateString("es-AR");

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

  const getReviewer = async () => {
    const user = await AsyncStorage.getItem("user");
    const userJson = JSON.parse(user || "{}");
    setReviewerId(userJson._id);
  };

  useEffect(() => {
    getReviewer();
  }, []);

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

  const onChangeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShowDatePicker(Platform.OS === "ios");
    setExpirationDate(currentDate);
  };

  const restartAll = () => {
    setOpenSettings(false);
    setSettingsTab(0);
    setShowDatePicker(false);
    setToApprove(false);
    setToReject(false);
    setRejectReason("");
    setExpirationDate(new Date());
    setLicenseNumber("");
  };

  const changeStatus = async (status: string, type?: string) => {
    let body;

    try {
      if (status === "rejected") {
        body = {
          userId: userId,
          documentId: document._id,
          status: status,
          reviewerId: reviewerId,
          rejectReason: rejectReason,
        };
      } else if (status === "accepted") {
        if (type === "license") {
          body = {
            userId: userId,
            documentId: document._id,
            status: status,
            expirationDate: expirationDate,
            licenseNumber: licenseNumber,
            reviewerId: reviewerId,
          };
        } else {
          body = {
            userId: userId,
            documentId: document._id,
            status: status,
            expirationDate: expirationDate,
            reviewerId: reviewerId,
          };
        }
      } else if (status === "pending") {
        body = {
          userId: userId,
          documentId: document._id,
          status: status,
          reviewerId: reviewerId,
        };
      }

      const response = await fetch(`${apiUrl}/update-document-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.status === 200) {
        restartAll();
        if (faster) {
          setDocuments(filterFromDocumentsById(document._id));
        } else {
          setDocuments(data);
        }
        setShowAlert({
          message: "Cambio de estado exitoso",
        });
      } else if (response.status === 404) {
        restartAll();
        setShowAlert({
          message: "Error al buscar el usuario o el documento",
        });
      }
    } catch (error) {
      restartAll();
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
          Desde {formattedDate}
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
            onPress={() => restartAll()}
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
                    setToApprove(true);
                    setToReject(false);
                  }}
                  disabled={verifyStatus("accepted", document.status)}
                  iconColor='#008f39'
                />
                {toApprove && (
                  <ThemedView>
                    <TouchableOpacity>
                      <ThemedText
                        style={styles.approve_data_expiration_date}
                        onPress={() => setShowDatePicker(true)}
                      >
                        Vencimiento: {expirationDate.toLocaleDateString()}
                      </ThemedText>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={expirationDate}
                        mode='date'
                        display='spinner'
                        onChange={(event, selectedDate) =>
                          onChangeDate(event, selectedDate)
                        }
                        minimumDate={new Date()}
                      />
                    )}
                    {document.type === "license" && (
                      <TextInput
                        style={styles.approve_data_input}
                        placeholderTextColor={"gray"}
                        placeholder='N° de Licencia'
                        value={licenseNumber}
                        onChangeText={setLicenseNumber}
                      />
                    )}

                    <TouchableOpacity
                      style={[
                        styles.accept_approve_button,
                        document.type === "license" &&
                          !licenseNumber && {
                            backgroundColor: "#EBEBE4",
                          },
                      ]}
                      onPress={() => {
                        changeStatus("accepted", document.type);
                      }}
                      disabled={document.type === "license" && !licenseNumber}
                    >
                      <ThemedText style={styles.accept_approve_text}>
                        Aprobar
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                )}

                <AdminOptionCard
                  title='Rechazado'
                  icon='close'
                  tabToRedirect='1'
                  setTab={() => {
                    setToReject(true);
                    setToApprove(false);
                  }}
                  disabled={verifyStatus("rejected", document.status)}
                  iconColor='#DA373A'
                />
                {toReject && (
                  <ThemedView>
                    <TextInput
                      style={styles.reject_reason_input}
                      multiline
                      numberOfLines={4}
                      textAlignVertical='top'
                      placeholderTextColor={"gray"}
                      placeholder='Motivo de rechazo'
                      value={rejectReason}
                      onChangeText={setRejectReason}
                    />
                    <TouchableOpacity
                      style={[
                        styles.accept_reject_button,
                        !rejectReason && {
                          backgroundColor: "#EBEBE4",
                        },
                      ]}
                      onPress={() => {
                        changeStatus("rejected");
                      }}
                      disabled={!rejectReason}
                    >
                      <ThemedText style={styles.accept_reject_text}>
                        Rechazar
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                )}
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
    width: "95%",
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
  approve_data_expiration_date: {
    fontSize: 14,
    backgroundColor: "#E8E8E8",
    borderRadius: 5,
    padding: 10,
    textAlign: "center",
  },
  approve_data_input: {
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#E8E8E8",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  accept_approve_button: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#008f39",
    padding: 10,
    borderRadius: 5,
  },
  accept_approve_text: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  reject_reason_input: {
    fontSize: 14,
    textAlignVertical: "top",
    backgroundColor: "#E8E8E8",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  accept_reject_button: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#DA373A",
    padding: 10,
    borderRadius: 5,
  },
  accept_reject_text: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  set_document_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
