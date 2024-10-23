import { useState } from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Picker } from "@react-native-picker/picker";

interface Props {
  type: string;
  setIsAdding: (value: string) => void;
  setUser: (value: any) => void;
  setShowAlert: (value: any) => void;
}

export default function AddDocument({
  type,
  setIsAdding,
  setUser,
  setShowAlert,
}: Props) {
  const [documentData, setDocumentData] = useState({
    type: type,
    files_url: [] as string[],
  });
  const [licenseType, setLicenseType] = useState<string>("private");
  const [frontImageUri, setFrontImageUri] = useState<string>("");
  const [backImageUri, setBackImageUri] = useState<string>("");
  const [cmaImagesUri, setCmaImagesUri] = useState<string[]>([""]);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const pickImage = async (type: string, index = 0) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setShowAlert({
        message: "Lo sentimos, necesitamos permisos para acceder a la galeria.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "front") {
        setDocumentData({
          ...documentData,
          files_url: [result.assets[0].uri, documentData.files_url[1]],
        });
        setFrontImageUri(result.assets[0].uri);
      } else if (type === "back") {
        setDocumentData({
          ...documentData,
          files_url: [documentData.files_url[0], result.assets[0].uri],
        });
        setBackImageUri(result.assets[0].uri);
      } else if (type === "cma") {
        const newCmaImagesUri = [...cmaImagesUri];
        newCmaImagesUri[index] = result.assets[0].uri;

        if (newCmaImagesUri[newCmaImagesUri.length - 1] !== "") {
          setCmaImagesUri([...newCmaImagesUri, ""]);
        } else {
          setCmaImagesUri(newCmaImagesUri);
        }
        setDocumentData({
          ...documentData,
          files_url: newCmaImagesUri,
        });
      }
    }
  };

  const takePhoto = async (type: string, index = 0) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setShowAlert({
        message: "Lo sentimos, necesitamos permisos para acceder a la camara.",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "front") {
        setDocumentData({
          ...documentData,
          files_url: [result.assets[0].uri, documentData.files_url[1]],
        });
        setFrontImageUri(result.assets[0].uri);
      } else if (type === "back") {
        setDocumentData({
          ...documentData,
          files_url: [documentData.files_url[0], result.assets[0].uri],
        });
        setBackImageUri(result.assets[0].uri);
      } else if (type === "cma") {
        const newCmaImagesUri = [...cmaImagesUri];
        newCmaImagesUri[index] = result.assets[0].uri;
        if (newCmaImagesUri[newCmaImagesUri.length - 1] !== "") {
          setCmaImagesUri([...newCmaImagesUri, ""]);
        } else {
          setCmaImagesUri(newCmaImagesUri);
        }
        setDocumentData({
          ...documentData,
          files_url: newCmaImagesUri,
        });
      }
    }
  };

  const resetAll = () => {
    setIsAdding("no");
    setFrontImageUri("");
    setBackImageUri("");
  };

  const deleteCmaImage = (index: number) => {
    const newCmaImagesUri = [...cmaImagesUri];
    newCmaImagesUri[index] = "";
    if (
      newCmaImagesUri[newCmaImagesUri.length - 1] === "" &&
      newCmaImagesUri[newCmaImagesUri.length - 2] === ""
    ) {
      newCmaImagesUri.pop();
    }
    setCmaImagesUri(newCmaImagesUri);
    setDocumentData({
      ...documentData,
      files_url: newCmaImagesUri,
    });
  };

  const handleSubmit = async () => {
    if (
      (type === "license" || type === "dni") &&
      (!frontImageUri || !backImageUri)
    ) {
      setShowAlert({
        message: "Por favor, carga las dos imagenes de tu documento.",
      });
      return;
    }

    if (type === "cma" && !cmaImagesUri[0]) {
      setShowAlert({
        message: "Por favor, carga las imagenes de tu CMA.",
      });
      return;
    }

    const userString = await AsyncStorage.getItem("user");
    const userJson = JSON.parse(userString || "{}");

    if (!userJson._id) {
      setShowAlert({
        message: "Por favor, inicia sesión.",
      });
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", userJson._id);
      formData.append("type", type);
      type === "license" && formData.append("license_type", licenseType);
      for (let i = 0; i < documentData.files_url.length; i++) {
        formData.append(`image${i}`, {
          uri: documentData.files_url[i],
          type: "image/jpeg",
          name: `${type}-image${i}.jpg`,
        } as any);
      }

      const response = await fetch(`${apiUrl}/add-user-document`, {
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setShowAlert({ message: "Se ha agregado el documento" });
        setUser(data);
        await AsyncStorage.setItem("user", JSON.stringify(data));
        resetAll();
      } else {
        setShowAlert({
          message:
            "Hubo un error al agregar el documento. Por favor, intenta de nuevo",
        });
        resetAll();
      }
    } catch (error) {
      setShowAlert({
        message:
          "Hubo un error al agregar el documento. Por favor, intenta de nuevo",
      });
      resetAll();
      console.error(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {type === "license" && (
        <ThemedView style={styles.license_type_container}>
          <ThemedText style={styles.license_type_text}>
            Tipo de licencia:
          </ThemedText>
          <Picker
            selectedValue={licenseType}
            onValueChange={(el) => setLicenseType(el)}
            style={styles.license_type_picker}
            itemStyle={{ color: "black" }}
            dropdownIconColor={"white"}
            mode='dropdown'
          >
            <Picker.Item label='Privado' value='private' />
            <Picker.Item label='Comercial' value='comercial' />
          </Picker>
        </ThemedView>
      )}
      {(type === "license" || type === "dni") && (
        <ThemedView style={styles.images_container}>
          <ThemedText style={styles.front_text}>
            Frente {type === "dni" ? "del DNI" : "de la Licencia"}:
          </ThemedText>
          <ThemedView style={styles.image_button_container}>
            <TouchableOpacity
              onPress={() => pickImage("front")}
              style={styles.image_button}
            >
              <Ionicons name='images-outline' size={18} color='white' />
              <ThemedText style={styles.button_text}>Cargar imagen</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => takePhoto("front")}
              style={styles.image_button}
            >
              <Ionicons name='camera-outline' size={20} color='white' />
              <ThemedText style={styles.button_text}>Tomar una Foto</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          {frontImageUri ? (
            <ThemedView style={{ backgroundColor: "transparent", height: 220 }}>
              <Image source={{ uri: frontImageUri }} style={styles.image} />
            </ThemedView>
          ) : (
            <ThemedText style={styles.no_image_text}>
              Carga una imagen para ver la previsualización
            </ThemedText>
          )}
          <ThemedText style={styles.back_text}>
            Dorso {type === "dni" ? "del DNI" : "de la Licencia"}:
          </ThemedText>
          <ThemedView style={styles.image_button_container}>
            <TouchableOpacity
              onPress={() => pickImage("back")}
              style={styles.image_button}
            >
              <Ionicons name='images-outline' size={18} color='white' />
              <ThemedText style={styles.button_text}>Cargar imagen</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => takePhoto("back")}
              style={styles.image_button}
            >
              <Ionicons name='camera-outline' size={20} color='white' />
              <ThemedText style={styles.button_text}>Tomar una Foto</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          {backImageUri ? (
            <ThemedView style={{ backgroundColor: "transparent", height: 220 }}>
              <Image source={{ uri: backImageUri }} style={styles.image} />
            </ThemedView>
          ) : (
            <ThemedText style={styles.no_image_text}>
              Carga una imagen para ver la previsualización
            </ThemedText>
          )}
        </ThemedView>
      )}

      {type === "cma" && (
        <ThemedView style={styles.images_container}>
          <ThemedText style={styles.front_text}>
            Carga las fotos de tu CMA:
          </ThemedText>
          {cmaImagesUri.map((uri, index) => (
            <ThemedView key={index} style={styles.cma_image_button_container}>
              {uri === "" && (
                <ThemedView style={styles.image_button_container}>
                  <TouchableOpacity
                    onPress={() => pickImage("cma", index)}
                    style={styles.image_button}
                  >
                    <Ionicons name='images-outline' size={16} color='white' />
                    <ThemedText style={styles.button_text}>
                      Cargar imagen
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => takePhoto("cma", index)}
                    style={styles.image_button}
                  >
                    <Ionicons name='camera-outline' size={18} color='white' />
                    <ThemedText style={styles.button_text}>
                      Tomar una Foto
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              )}

              {uri !== "" ? (
                <ThemedView
                  style={{
                    backgroundColor: "transparent",
                    height: 220,
                    width: "100%",
                    flexDirection: "row",
                    position: "relative",
                    marginVertical: 10,
                  }}
                >
                  <ThemedText style={styles.image_number}>
                    {index + 1}
                  </ThemedText>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    onPress={() => {
                      deleteCmaImage(index);
                    }}
                    style={styles.delete_image_button}
                  >
                    <Ionicons name='close-outline' size={20} color='white' />
                  </TouchableOpacity>
                </ThemedView>
              ) : (
                <ThemedText style={styles.no_image_text}>
                  Carga una imagen para ver la previsualización
                </ThemedText>
              )}
            </ThemedView>
          ))}
        </ThemedView>
      )}

      <ThemedView style={styles.buttons_container}>
        <TouchableOpacity
          onPress={() => setIsAdding("no")}
          style={styles.add_button_container}
        >
          <ThemedText style={styles.add_text}>Cancelar</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.add_button_container}
        >
          <ThemedText style={styles.add_text}>Guardar</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  license_type_container: {
    backgroundColor: "transparent",
    gap: 15,
    width: "100%",
  },
  license_type_text: {
    fontSize: 16,
    color: "white",
  },
  license_type_picker: {
    backgroundColor: "#00000020",
    flex: 1,
    color: "white",
  },
  images_container: {
    backgroundColor: "transparent",
    marginVertical: 20,
  },
  front_text: {
    fontSize: 14,
    alignSelf: "flex-start",
    color: "white",
    textDecorationColor: "white",
  },
  back_text: {
    fontSize: 14,
    alignSelf: "flex-start",
    color: "white",
    marginTop: 20,
    textDecorationColor: "white",
  },
  image_button_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginVertical: 10,
    backgroundColor: "transparent",
  },
  image_button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    padding: 5,
    borderRadius: 3,
    flex: 1,
  },
  cma_image_button_container: {
    width: "100%",
    backgroundColor: "transparent",
  },
  button_text: {
    color: "white",
    fontWeight: "600",
    letterSpacing: 1.2,
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
    borderRadius: 5,
    backgroundColor: "white",
  },
  image_number: {
    position: "absolute",
    top: 0,
    left: 0,
    color: "black",
    fontWeight: "600",
    fontSize: 14,
    backgroundColor: "white",
    zIndex: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomRightRadius: 3,
  },
  delete_image_button: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  no_image_text: {
    color: "gray",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "gray",
    height: 220,
    borderRadius: 5,
  },
  buttons_container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  add_button_container: {
    padding: 10,
    backgroundColor: "#00000010",
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: "white",
    borderTopWidth: 1,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    borderTopRightRadius: 3,
    marginTop: 10,
  },
  add_text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
