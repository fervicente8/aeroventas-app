import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import AdminOptionCard from "../components/AdminOptionCard";
import { useState } from "react";
import ManageUserDocuments from "./ManageUserDocuments";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

interface User {
  _id: string;
  name: string;
  last_name: string;
  email: string;
  profile_picture: {
    public_id: string;
    secure_url: string;
  };
  flight_hours: number;
  buyed_planes: any;
  rented_planes: any;
  reviews_given: any;
  reviews_received: any;
  documents: any;
  created_at: Date;
  type: string;
  status: string;
}

interface Props {
  apiUrl: string | undefined;
  user: User | null;
  setUser: (value: any) => void;
  currentUsersInList: User[];
  setCurrentUsersinList: (value: any) => void;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  setShowAlert: (value: any) => void;
}

export default function ManageUserById({
  apiUrl,
  user,
  setUser,
  currentUsersInList,
  setCurrentUsersinList,
  selectedTab,
  setSelectedTab,
  setShowAlert,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalFunction, setModalFunction] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const deleteUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/delete-user-by-id/${user?._id}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        setCurrentUsersinList(
          currentUsersInList.filter((listUser) => listUser._id !== user?._id)
        );
        setShowAlert({
          message: "Usuario eliminado correctamente",
        });
        setUser(null);
        setOpenModal(false);
        setSelectedTab("users-list");
        setLoading(false);
      } else {
        setShowAlert({
          message: "Error al eliminar el usuario",
        });
        setOpenModal(false);
        setLoading(false);
      }
    } catch (error) {
      setShowAlert({
        message: "Error al eliminar el usuario",
      });
      setOpenModal(false);
      setLoading(false);
    }
  };

  const suspendUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/suspend-user-by-id/${user?._id}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setShowAlert({
          message:
            data === "active"
              ? "Usuario activado correctamente"
              : "Usuario suspendido correctamente",
        });
        setUser({
          ...user,
          status: data,
        });
        setOpenModal(false);
        setLoading(false);
      } else {
        setShowAlert({
          message: "Error al suspender el usuario",
        });
        setOpenModal(false);
        setLoading(false);
      }
    } catch (error) {
      setShowAlert({
        message: "Error al suspender el usuario",
      });
      setOpenModal(false);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <ThemedView>
        <ThemedText style={styles.no_user_text}>
          No se ha podido encontrar el usuario
        </ThemedText>
      </ThemedView>
    );
  } else if (selectedTab === "users-list-manage-user") {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>
          {user.name} {user.last_name}{" "}
          {user.status === "suspended" ? "(Suspendido)" : null}
        </ThemedText>
        <Modal visible={openModal} animationType='fade' transparent>
          <ThemedView style={styles.modal_container}>
            <ThemedView style={styles.modal_content_container}>
              <ThemedText style={styles.modal_text}>{modalMessage}</ThemedText>
              <ThemedView style={styles.modal_buttons_container}>
                <TouchableOpacity
                  onPress={() => {
                    setOpenModal(false);
                  }}
                  style={loading ? { opacity: 0.5 } : {}}
                  disabled={loading}
                >
                  <ThemedText style={styles.modal_button_cancel}>
                    Cancelar
                  </ThemedText>
                </TouchableOpacity>
                {loading ? (
                  <LoadingSpinner
                    style={{
                      backgroundColor: "#DA373A",
                      borderRadius: 5,
                      paddingVertical: 5,
                      width: 120,
                    }}
                    color='white'
                  />
                ) : (
                  <TouchableOpacity
                    onPress={
                      modalFunction === "deleteUser" ? deleteUser : suspendUser
                    }
                  >
                    <ThemedText style={styles.modal_button_delete}>
                      {modalFunction === "suspendUser"
                        ? user.status === "suspended"
                          ? "Activar"
                          : "Suspender"
                        : "Eliminar"}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>
        {/* <AdminOptionCard
          title='Chatear con usuario'
          icon='chatbubbles'
          tabToRedirect='users-list-manage-user-documents'
          setTab={setSelectedTab}
        /> */}
        <AdminOptionCard
          title='Gestionar documentos'
          icon='file-document-multiple'
          tabToRedirect='users-list-manage-user-documents'
          setTab={setSelectedTab}
        />
        <AdminOptionCard
          title={
            user.status === "active" ? "Suspender usuario" : "Activar usuario"
          }
          icon='account-off'
          tabToRedirect='true'
          setTab={() => {
            setOpenModal(true);
            setModalMessage("¿Seguro que quieres suspender a este usuario?");
            setModalFunction("suspendUser");
          }}
        />
        <AdminOptionCard
          title='Eliminar usuario'
          icon='delete'
          tabToRedirect='true'
          iconColor='#DA373A'
          setTab={() => {
            setOpenModal(true);
            setModalMessage("¿Seguro que quieres eliminar a este usuario?");
            setModalFunction("deleteUser");
          }}
        />
      </ThemedView>
    );
  } else {
    return (
      <ManageUserDocuments
        userId={user._id}
        apiUrl={apiUrl}
        setShowAlert={setShowAlert}
      />
    );
  }
}

const styles = StyleSheet.create({
  no_user_text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#2B63AA",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#2B63AA",
    marginBottom: 25,
  },
  modal_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000090",
  },
  modal_content_container: {
    maxWidth: "80%",
    gap: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modal_text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  modal_buttons_container: {
    flexDirection: "row",
    gap: 10,
  },
  modal_button_cancel: {
    backgroundColor: "#2B63AA",
    color: "white",
    fontWeight: "600",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  modal_button_delete: {
    backgroundColor: "#DA373A",
    color: "white",
    fontWeight: "600",
    paddingVertical: 8,
    width: 120,
    textAlign: "center",
    borderRadius: 5,
  },
});
