import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import LoadingSpinner from "../loading/LoadingSpinner";

interface Props {
  user: {
    _id: string;
    name: string;
    last_name: string;
    password: string;
    email: string;
    profile_picture?: {
      public_id: string;
      secure_url: string;
    };
    created_at: Date;
  };
  setUser: (user: any) => void;
  setShowAlert: (value: any) => void;
}

export default function ProfileSettingsProfile({
  user,
  setUser,
  setShowAlert,
}: Props) {
  const [loadingEditing, setLoadingEditing] = useState(false);
  const [userState, setUserState] = useState({
    _id: user._id,
    name: user.name,
    last_name: user.last_name,
    password: user.password,
    email: user.email,
    profile_picture: user.profile_picture,
    created_at: user.created_at,
  });
  const [editing, setEditing] = useState("none");
  const [newValue, setNewValue] = useState("");
  const [lastImage, setLastImage] = useState({
    public_id: user.profile_picture?.public_id || "",
    secure_url: user.profile_picture?.secure_url || "",
  });
  const [tempImage, setTempImage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actualPassword, setActualPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [actualPasswordHidden, setActualPasswordHidden] = useState(true);
  const [newPasswordHidden, setNewPasswordHidden] = useState(true);
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    setUserState({
      _id: user._id,
      name: user.name,
      last_name: user.last_name,
      password: user.password,
      email: user.email,
      profile_picture: user.profile_picture,
      created_at: user.created_at,
    });
  }, [user]);

  const pickImage = async () => {
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
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (userState.profile_picture !== undefined) {
        setLastImage(userState.profile_picture);
      }
      setTempImage(result.assets[0].uri);
      setEditing("none");
    }
  };

  const takePhoto = async () => {
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
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (userState.profile_picture !== undefined) {
        setLastImage(userState.profile_picture);
      }
      setTempImage(result.assets[0].uri);
      setEditing("none");
    }
  };

  const handleSubmit = async (to_edit: keyof Props["user"]) => {
    try {
      if (to_edit === "profile_picture") {
        setLoadingEditing(true);
        const formData = new FormData();
        formData.append("user_id", userState._id);
        formData.append("to_edit", to_edit);
        formData.append("image", {
          uri: tempImage,
          name: "image",
          type: "image/jpeg",
        } as any);
        formData.append("image_delete_id", lastImage?.public_id);

        const response = await fetch(`${apiUrl}/edit-user`, {
          method: "PUT",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = await response.json();

        if (response.status === 200) {
          await AsyncStorage.setItem("user", JSON.stringify(data));
          setUserState({
            ...userState,
            profile_picture: data.profile_picture,
          });
          setUser(data);
          setTempImage("");
          setEditing("none");
          setLoadingEditing(false);
        } else {
          setShowAlert({
            message:
              "Ha ocurrido un error al editar tu perfil, intentalo de nuevo.",
          });
          setLoadingEditing(false);
        }
      } else {
        if (newValue === "" && to_edit !== "password") {
          setError("empty_field");
          return;
        } else if (to_edit === "email") {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(userState.email)) {
            setError("invalid_email");
            return;
          }
        } else if (to_edit === "password") {
          if (newPassword !== confirmNewPassword) {
            setError("passwords_dont_match");
            return;
          } else if (actualPassword === "") {
            setError("empty_field_actual_password");
            return;
          } else if (newPassword === "") {
            setError("empty_field_new_password");
            return;
          } else if (confirmNewPassword === "") {
            setError("empty_field_confirm_new_password");
            return;
          } else if (newPassword.length < 8) {
            setError("password_too_short");
            return;
          }
        }

        setLoadingEditing(true);
        let sendData;

        if (to_edit === "password") {
          sendData = {
            actualPassword,
            newPassword,
          };
        } else {
          sendData = newValue;
        }

        const response = await fetch(`${apiUrl}/edit-user`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userState._id,
            to_edit,
            data: sendData,
          }),
        });

        const data = await response.json();

        if (response.status === 200) {
          await AsyncStorage.setItem("user", JSON.stringify(data));
          setUserState({
            ...userState,
            [to_edit]: data[to_edit],
          });
          setUser(data);
          setEditing("none");
          setLoadingEditing(false);
        } else if (response.status === 401 && to_edit === "password") {
          setError("invalid_password");
          setActualPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          setLoadingEditing(false);
          return;
        } else {
          setShowAlert({
            message:
              "Ha ocurrido un error al editar tu perfil, intentalo de nuevo.",
          });
          setLoadingEditing(false);
        }
      }
    } catch (error) {
      setShowAlert({
        message:
          "Ha ocurrido un error al editar tu perfil, intentalo de nuevo.",
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.data_container}>
        <ThemedText style={styles.label}>Avatar</ThemedText>

        <Modal
          animationType='fade'
          visible={editing === "profile_picture"}
          transparent
        >
          <ThemedView style={styles.edit_avatar_modal_centered}>
            <TouchableOpacity
              style={styles.edit_avatar_modal_background}
              onPress={() => setEditing("none")}
            ></TouchableOpacity>
            {tempImage.length > 0 ? (
              <Image source={{ uri: tempImage }} style={styles.modal_image} />
            ) : userState.profile_picture?.secure_url ? (
              <Image
                style={styles.modal_image}
                width={100}
                height={100}
                source={{ uri: userState.profile_picture.secure_url }}
              />
            ) : (
              <Image
                source={require("@/assets/images/blank_image_preview.png")}
                style={styles.modal_image}
              />
            )}
            <ThemedView style={styles.image_button_container}>
              <TouchableOpacity onPress={pickImage} style={styles.image_button}>
                <Ionicons name='images-outline' size={18} color='white' />
                <ThemedText style={styles.button_text}>
                  Cargar imagen
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={takePhoto} style={styles.image_button}>
                <Ionicons name='camera-outline' size={20} color='white' />
                <ThemedText style={styles.button_text}>
                  Tomar una Foto
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </Modal>

        <ThemedView style={styles.avatar_pencil_container}>
          {tempImage ? (
            <ThemedView style={styles.confirm_avatar_container}>
              <Image source={{ uri: tempImage }} style={styles.image} />
              {loadingEditing ? (
                <LoadingSpinner size='large' style={{ paddingLeft: 35 }} />
              ) : (
                <ThemedView
                  style={{
                    justifyContent: "center",
                    gap: 8,
                    backgroundColor: "transparent",
                  }}
                >
                  <TouchableOpacity
                    style={styles.confirm_avatar_button}
                    onPress={() => {
                      setUserState({
                        ...userState,
                        profile_picture: lastImage,
                      });
                      setTempImage("");
                      setEditing("none");
                    }}
                  >
                    <MaterialCommunityIcons
                      name='close'
                      size={24}
                      color='white'
                    />
                    <ThemedText style={styles.confirm_avatar_text}>
                      Cancelar
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirm_avatar_button}
                    onPress={() => handleSubmit("profile_picture")}
                  >
                    <MaterialCommunityIcons
                      name='content-save'
                      size={24}
                      color='white'
                    />
                    <ThemedText style={styles.confirm_avatar_text}>
                      Confirmar
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              )}
            </ThemedView>
          ) : userState.profile_picture?.secure_url ? (
            <>
              <Image
                style={styles.image}
                width={100}
                height={100}
                source={{ uri: userState.profile_picture.secure_url }}
              />
              <TouchableOpacity
                disabled={loadingEditing}
                onPress={() => setEditing("profile_picture")}
                style={styles.avatar_pencil_background}
              ></TouchableOpacity>
              <MaterialCommunityIcons
                name='pencil'
                size={30}
                color='white'
                style={styles.avatar_pencil}
                onPress={() => setEditing("profile_picture")}
              />
            </>
          ) : (
            <TouchableOpacity onPress={() => setEditing("profile_picture")}>
              <Image
                source={require("@/assets/images/blank_image_preview.png")}
                style={styles.image}
              />
            </TouchableOpacity>
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.data_container}>
        <ThemedText style={styles.label}>Email</ThemedText>
        {editing === "email" ? (
          <ThemedView style={styles.data_pencil_container}>
            <TextInput
              style={styles.input}
              placeholder='Nuevo email'
              value={newValue}
              onChangeText={(text) => setNewValue(text)}
            />
            {loadingEditing ? (
              <LoadingSpinner size='small' />
            ) : (
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
                    setNewValue(userState.email);
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
            <ThemedText style={styles.data}>{userState.email}</ThemedText>
            <MaterialCommunityIcons
              disabled={loadingEditing}
              name='pencil'
              size={22}
              color='#2B63AA'
              onPress={() => {
                setEditing("email");
                setNewValue(userState.email);
              }}
            />
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.data_container}>
        {editing !== "password" && (
          <ThemedText style={styles.label}>Contraseña</ThemedText>
        )}

        {editing === "password" ? (
          <ThemedView style={styles.change_password_container}>
            <ThemedView style={styles.data_container}>
              <ThemedText style={styles.label}>Contraseña actual</ThemedText>
              <ThemedView style={styles.data_pencil_container}>
                <TextInput
                  style={styles.input}
                  placeholder='Contraseña actual'
                  value={actualPassword}
                  onChangeText={(text) => setActualPassword(text)}
                  onSubmitEditing={() => newPasswordRef.current?.focus()}
                  secureTextEntry={actualPasswordHidden}
                />
                {actualPasswordHidden ? (
                  <Ionicons
                    name='eye-off-outline'
                    size={24}
                    color='black'
                    onPress={() => setActualPasswordHidden(false)}
                  />
                ) : (
                  <Ionicons
                    name='eye-outline'
                    size={24}
                    color='black'
                    onPress={() => setActualPasswordHidden(true)}
                  />
                )}
                {editing === "password" &&
                error === "empty_field_actual_password" ? (
                  <ThemedText style={styles.error_text}>
                    Se debe completar este campo
                  </ThemedText>
                ) : editing === "password" && error === "invalid_password" ? (
                  <ThemedText style={styles.error_text}>
                    Contraseña incorrecta
                  </ThemedText>
                ) : null}
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.data_container}>
              <ThemedText style={styles.label}>Nueva contraseña</ThemedText>
              <ThemedView style={styles.data_pencil_container}>
                <TextInput
                  style={styles.input}
                  placeholder='Nueva contraseña'
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                  ref={newPasswordRef}
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  secureTextEntry={newPasswordHidden}
                />
                {newPasswordHidden ? (
                  <Ionicons
                    name='eye-off-outline'
                    size={24}
                    color='black'
                    onPress={() => setNewPasswordHidden(false)}
                  />
                ) : (
                  <Ionicons
                    name='eye-outline'
                    size={24}
                    color='black'
                    onPress={() => setNewPasswordHidden(true)}
                  />
                )}
                {editing === "password" &&
                error === "empty_field_new_password" ? (
                  <ThemedText style={styles.error_text}>
                    Se debe completar este campo
                  </ThemedText>
                ) : editing === "password" && error === "password_too_short" ? (
                  <ThemedText style={styles.error_text}>
                    La nueva contraseña debe tener al menos 8 caracteres
                  </ThemedText>
                ) : null}
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.data_container}>
              <ThemedText style={styles.label}>
                Confirmar nueva contraseña
              </ThemedText>
              <ThemedView style={styles.data_pencil_container}>
                <TextInput
                  style={styles.input}
                  placeholder='Confirmar nueva contraseña'
                  value={confirmNewPassword}
                  onChangeText={(text) => setConfirmNewPassword(text)}
                  ref={confirmPasswordRef}
                  secureTextEntry={newPasswordHidden}
                />
                {newPasswordHidden ? (
                  <Ionicons
                    name='eye-off-outline'
                    size={24}
                    color='black'
                    onPress={() => setNewPasswordHidden(false)}
                  />
                ) : (
                  <Ionicons
                    name='eye-outline'
                    size={24}
                    color='black'
                    onPress={() => setNewPasswordHidden(true)}
                  />
                )}
                {editing === "password" &&
                error === "empty_field_confirm_new_password" ? (
                  <ThemedText style={styles.error_text}>
                    Se debe completar este campo
                  </ThemedText>
                ) : editing === "password" &&
                  error === "passwords_dont_match" ? (
                  <ThemedText style={styles.error_text}>
                    Las contraseñas no coinciden
                  </ThemedText>
                ) : null}
              </ThemedView>
            </ThemedView>
            {loadingEditing ? (
              <LoadingSpinner size='large' style={{ padding: 20 }} />
            ) : (
              <ThemedView
                style={{
                  justifyContent: "center",
                  gap: 8,
                  backgroundColor: "transparent",
                }}
              >
                <TouchableOpacity
                  style={styles.confirm_avatar_button}
                  onPress={() => {
                    setActualPassword("");
                    setNewPassword("");
                    setConfirmNewPassword("");
                    setEditing("none");
                    setNewValue("");
                    setError("");
                  }}
                >
                  <MaterialCommunityIcons
                    name='close'
                    size={24}
                    color='white'
                  />
                  <ThemedText style={styles.confirm_avatar_text}>
                    Cancelar
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirm_avatar_button}
                  onPress={() => handleSubmit("password")}
                >
                  <MaterialCommunityIcons
                    name='content-save'
                    size={24}
                    color='white'
                  />
                  <ThemedText style={styles.confirm_avatar_text}>
                    Confirmar
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}
          </ThemedView>
        ) : (
          <ThemedView style={styles.data_pencil_container}>
            <ThemedView
              style={[
                styles.data,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  gap: 5,
                },
              ]}
            >
              <Ionicons name='eye-off-outline' size={22} color='black' />
              <ThemedText>Oculto</ThemedText>
            </ThemedView>
            <MaterialCommunityIcons
              disabled={loadingEditing}
              name='pencil'
              size={22}
              color='#2B63AA'
              onPress={() => setEditing("password")}
            />
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.data_container}>
        <ThemedText style={styles.label}>Nombre</ThemedText>
        {editing === "name" ? (
          <ThemedView style={styles.data_pencil_container}>
            <TextInput
              style={styles.input}
              placeholder='Nuevo nombre'
              value={newValue}
              onChangeText={(text) => setNewValue(text)}
            />
            {loadingEditing ? (
              <LoadingSpinner size='small' />
            ) : (
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
                    setNewValue(userState.name);
                  }}
                />
                <MaterialCommunityIcons
                  name='content-save'
                  size={22}
                  color='#2B63AA'
                  onPress={() => handleSubmit("name")}
                />
              </ThemedView>
            )}
          </ThemedView>
        ) : (
          <ThemedView style={styles.data_pencil_container}>
            <ThemedText style={styles.data}>{userState.name}</ThemedText>
            <MaterialCommunityIcons
              disabled={loadingEditing}
              name='pencil'
              size={22}
              color='#2B63AA'
              onPress={() => {
                setEditing("name");
                setNewValue(userState.name);
              }}
            />
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView style={styles.data_container}>
        <ThemedText style={styles.label}>Apellido</ThemedText>
        {editing === "last_name" ? (
          <ThemedView style={styles.data_pencil_container}>
            <TextInput
              style={styles.input}
              placeholder='Nuevo apellido'
              value={newValue}
              onChangeText={(text) => setNewValue(text)}
            />
            {loadingEditing ? (
              <LoadingSpinner size='small' />
            ) : (
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
                    setNewValue(userState.last_name);
                  }}
                />
                <MaterialCommunityIcons
                  name='content-save'
                  size={22}
                  color='#2B63AA'
                  onPress={() => handleSubmit("last_name")}
                />
              </ThemedView>
            )}
          </ThemedView>
        ) : (
          <ThemedView style={styles.data_pencil_container}>
            <ThemedText style={styles.data}>{userState.last_name}</ThemedText>
            <MaterialCommunityIcons
              disabled={loadingEditing}
              name='pencil'
              size={22}
              color='#2B63AA'
              onPress={() => {
                setEditing("last_name");
                setNewValue(userState.last_name);
              }}
            />
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    position: "relative",
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
  avatar_pencil_container: {
    width: "100%",
    height: 150,
    position: "relative",
    overflow: "hidden",
  },
  avatar_pencil_background: {
    position: "absolute",
    width: 150,
    height: "100%",
    backgroundColor: "black",
    opacity: 0.5,
    borderRadius: 75,
  },
  avatar_pencil: {
    position: "absolute",
    top: 75,
    left: 75,
    transform: [{ translateX: -12 }, { translateY: -18 }],
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
  edit_avatar_modal_centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    backgroundColor: "transparent",
  },
  edit_avatar_modal_background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    opacity: 0.7,
  },
  modal_image: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  image_button_container: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 10,
    padding: 10,
  },
  image_button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#2B63AA",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 3,
    flex: 1,
  },
  button_text: {
    color: "white",
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  confirm_avatar_container: {
    flexDirection: "row",
    gap: 20,
    backgroundColor: "transparent",
  },
  confirm_avatar_button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#2B63AA",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  confirm_avatar_text: {
    color: "white",
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  change_password_container: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#2B63AA",
    borderRadius: 3,
  },
  error_text: {
    color: "#DA373A",
    position: "absolute",
    bottom: -20,
    right: 2,
    fontSize: 14,
  },
});
