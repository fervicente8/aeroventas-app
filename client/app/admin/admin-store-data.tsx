import { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Stack } from "expo-router";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Alert from "@/components/alerts/Alert";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function AdminStoreData() {
  const [storeData, setStoreData] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    whatsapp_phone: "",
  });
  const [newValue, setNewValue] = useState("");
  const [editing, setEditing] = useState("none");
  const [samePhone, setSamePhone] = useState(true);
  const [storeNotFound, setStoreNotFound] = useState(false);
  const [showAlert, setShowAlert] = useState<{
    message: string;
  } | null>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiUrl}/get-store-data`);
      const data = await response.json();
      if (response.status === 404) {
        setStoreNotFound(true);
        setEditing("create");
      } else {
        setStoreData(data[0]);
      }
    };
    fetchData();
  }, []);

  const handleChange = (name: string, value: string) => {
    if (storeNotFound) {
      setStoreData(() => ({ ...storeData, [name]: value }));
    } else {
      setNewValue(() => value);
    }
  };

  const handleSubmit = async (type: string) => {
    if (
      !storeData.name ||
      !storeData.email ||
      !storeData.phone ||
      (!storeData.whatsapp_phone && !samePhone)
    ) {
      setShowAlert({
        message: "Por favor, rellene todos los campos",
      });
      return;
    }

    let response;
    if (storeNotFound) {
      response = await fetch(`${apiUrl}/create-store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: storeData.name,
          email: storeData.email,
          phone: storeData.phone,
          whatsapp_phone: storeData.whatsapp_phone
            ? storeData.whatsapp_phone
            : storeData.phone,
        }),
      });
    } else {
      response = await fetch(`${apiUrl}/edit-store-data`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          newValue,
        }),
      });
    }

    const data = await response.json();

    if (response.status === 200) {
      setStoreData(data);
      setEditing("none");
      setNewValue("");
      setStoreNotFound(false);
    } else {
      setShowAlert({
        message: "Error al editar los datos de la tienda",
      });
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Panel de administrador - Datos" }} />
      <ThemedView style={styles.container}>
        {showAlert && (
          <Alert
            closeAlert={() => setShowAlert(null)}
            message={showAlert.message}
          />
        )}
        <ScrollView>
          <ThemedText style={styles.title}>Datos de la tienda</ThemedText>

          <ThemedView style={styles.data_container}>
            <ThemedText style={styles.label}>Nombre de la tienda</ThemedText>
            {editing === "name" || editing === "create" ? (
              <ThemedView style={styles.data_pencil_container}>
                <TextInput
                  style={styles.input}
                  placeholder='Nombre de la tienda'
                  value={storeNotFound ? storeData.name : newValue}
                  onChangeText={(value) => handleChange("name", value)}
                />
                {editing === "name" && (
                  <ThemedView
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      backgroundColor: "transparent",
                    }}
                  >
                    <MaterialCommunityIcons
                      name='close'
                      size={22}
                      color='#2B63AA'
                      onPress={() => {
                        setEditing("none");
                        setNewValue(storeData.name);
                      }}
                    />
                    <MaterialCommunityIcons
                      name='content-save'
                      size={22}
                      color='#2B63AA'
                      onPress={() => handleSubmit("email")}
                    />
                  </ThemedView>
                )}
              </ThemedView>
            ) : (
              <ThemedView style={styles.data_pencil_container}>
                <ThemedText style={styles.data}>{storeData.name}</ThemedText>
                <MaterialCommunityIcons
                  name='pencil'
                  size={22}
                  color='#2B63AA'
                  onPress={() => {
                    setEditing("name");
                    setNewValue(storeData.name);
                  }}
                />
              </ThemedView>
            )}
          </ThemedView>

          <ThemedView style={styles.data_container}>
            <ThemedText style={styles.label}>Email</ThemedText>
            {editing === "email" || editing === "create" ? (
              <ThemedView style={styles.data_pencil_container}>
                <TextInput
                  style={styles.input}
                  placeholder='Email'
                  value={storeNotFound ? storeData.email : newValue}
                  onChangeText={(value) => handleChange("email", value)}
                />
                {editing === "email" && (
                  <ThemedView
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      backgroundColor: "transparent",
                    }}
                  >
                    <MaterialCommunityIcons
                      name='close'
                      size={22}
                      color='#2B63AA'
                      onPress={() => {
                        setEditing("none");
                        setNewValue(storeData.email);
                      }}
                    />
                    <MaterialCommunityIcons
                      name='content-save'
                      size={22}
                      color='#2B63AA'
                      onPress={() => handleSubmit("email")}
                    />
                  </ThemedView>
                )}
              </ThemedView>
            ) : (
              <ThemedView style={styles.data_pencil_container}>
                <ThemedText style={styles.data}>{storeData.email}</ThemedText>
                <MaterialCommunityIcons
                  name='pencil'
                  size={22}
                  color='#2B63AA'
                  onPress={() => {
                    setEditing("email");
                    setNewValue(storeData.email);
                  }}
                />
              </ThemedView>
            )}
          </ThemedView>

          <ThemedView style={styles.data_container}>
            <ThemedText style={styles.label}>Numero de celular</ThemedText>
            {editing === "phone" || editing === "create" ? (
              <ThemedView style={styles.data_pencil_container}>
                <TextInput
                  style={styles.input}
                  placeholder='Numero de celular'
                  value={storeNotFound ? storeData.phone : newValue}
                  onChangeText={(value) => handleChange("phone", value)}
                  keyboardType='numeric'
                />
                {editing === "phone" && (
                  <ThemedView
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      backgroundColor: "transparent",
                    }}
                  >
                    <MaterialCommunityIcons
                      name='close'
                      size={22}
                      color='#2B63AA'
                      onPress={() => {
                        setEditing("none");
                        setNewValue(storeData.phone);
                      }}
                    />
                    <MaterialCommunityIcons
                      name='content-save'
                      size={22}
                      color='#2B63AA'
                      onPress={() => handleSubmit("phone")}
                    />
                  </ThemedView>
                )}
              </ThemedView>
            ) : (
              <ThemedView style={styles.data_pencil_container}>
                <ThemedText style={styles.data}>{storeData.phone}</ThemedText>
                <MaterialCommunityIcons
                  name='pencil'
                  size={22}
                  color='#2B63AA'
                  onPress={() => {
                    setEditing("phone");
                    setNewValue(storeData.phone);
                  }}
                />
              </ThemedView>
            )}
          </ThemedView>

          <BouncyCheckbox
            size={20}
            fillColor='#2B63AA'
            unFillColor='#FFFFFF'
            text='¿Se usa el mismo numero para el whatsapp?'
            style={{ marginBottom: 15 }}
            iconStyle={{ borderColor: "#2B63AA" }}
            textStyle={{ textDecorationLine: "none" }}
            innerIconStyle={{ borderWidth: 2, borderColor: "#2B63AA" }}
            onPress={(isChecked: boolean) => {
              setSamePhone(isChecked);
            }}
            isChecked={samePhone}
          />

          {!samePhone && (
            <ThemedView style={styles.data_container}>
              <ThemedText style={styles.label}>Numero de whatsapp</ThemedText>
              {editing === "whatsapp_phone" || editing === "create" ? (
                <ThemedView style={styles.data_pencil_container}>
                  <TextInput
                    style={styles.input}
                    placeholder='Numero de whatsapp'
                    value={storeNotFound ? storeData.whatsapp_phone : newValue}
                    onChangeText={(value) =>
                      handleChange("whatsapp_phone", value)
                    }
                    keyboardType='numeric'
                  />
                  {editing === "whatsapp_phone" && (
                    <ThemedView
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        backgroundColor: "transparent",
                      }}
                    >
                      <MaterialCommunityIcons
                        name='close'
                        size={22}
                        color='#2B63AA'
                        onPress={() => {
                          setEditing("none");
                          setNewValue(storeData.whatsapp_phone);
                        }}
                      />
                      <MaterialCommunityIcons
                        name='content-save'
                        size={22}
                        color='#2B63AA'
                        onPress={() => handleSubmit("whatsapp_phone")}
                      />
                    </ThemedView>
                  )}
                </ThemedView>
              ) : (
                <ThemedView style={styles.data_pencil_container}>
                  <ThemedText style={styles.data}>
                    {storeData.whatsapp_phone}
                  </ThemedText>
                  <MaterialCommunityIcons
                    name='pencil'
                    size={22}
                    color='#2B63AA'
                    onPress={() => {
                      setEditing("whatsapp_phone");
                      setNewValue(storeData.whatsapp_phone);
                    }}
                  />
                </ThemedView>
              )}
            </ThemedView>
          )}

          {storeNotFound && (
            <TouchableOpacity
              style={styles.save_button}
              onPress={() => handleSubmit("new-store")}
            >
              <ThemedText style={styles.save_text}>Guardar</ThemedText>
            </TouchableOpacity>
          )}
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
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
  data_container: {
    flex: 1,
    gap: 5,
    marginBottom: 15,
  },
  data_pencil_container: {
    position: "relative",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00000020",
  },
  input: {
    flex: 1,
    borderRadius: 3,
    borderBottomColor: "#2B63AA",
    borderBottomWidth: 2,
    color: "black",
    padding: 4,
    fontSize: 16,
  },
  label: {
    color: "#2B63AA",
    fontWeight: "bold",
  },
  data: {
    flex: 1,
    padding: 4,
  },
  save_button: {
    marginTop: 10,
    backgroundColor: "#2B63AA",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignSelf: "center",
  },
  save_text: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
