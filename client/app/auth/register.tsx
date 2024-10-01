import React, { useState, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Alert from "@/components/alerts/Alert";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

interface User {
  name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function Register() {
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [userData, setUserData] = useState<User>({
    name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [imageUri, setImageUri] = useState<string>("");
  const [imageName, setImageName] = useState<string | null | undefined>("");
  const [imageType, setImageType] = useState<string | null | undefined>("");
  const [error, setError] = useState<string | null>(null);
  const [passwordHided, setPasswordHidden] = useState(true);
  const [confirmPasswordHided, setConfirmPasswordHidden] = useState(true);
  const [showAlert, setShowAlert] = useState<{
    message: string;
    redirectTo?: string;
    redirectToText?: string;
  } | null>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleChange = (name: string, value: string) => {
    setUserData(() => ({ ...userData, [name]: value }));
    setError(null);
  };

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
      setImageName(result.assets[0].fileName);
      setImageType(result.assets[0].mimeType);
      setImageUri(result.assets[0].uri);
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
      setImageName(result.assets[0].fileName);
      setImageType(result.assets[0].mimeType);
      setImageUri(result.assets[0].uri);
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const resetAll = () => {
    setUserData({
      name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
    setImageUri("");
    setImageName(null);
    setImageType(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!userData.name) {
      setError("no_name");
      return;
    } else if (!userData.last_name) {
      setError("no_last_name");
      return;
    } else if (!userData.email) {
      setError("no_email");
      return;
    } else if (!validateEmail(userData.email)) {
      setError("invalid_email");
      return;
    } else if (!userData.password) {
      setError("no_password");
      return;
    } else if (!userData.password_confirmation) {
      setError("no_password_confirmation");
      return;
    } else if (userData.password !== userData.password_confirmation) {
      setError("passwords_dont_match");
      setUserData((prev) => ({
        ...prev,
        password: "",
        password_confirmation: "",
      }));
      return;
    } else if (userData.password.length < 8) {
      setError("password_too_short");
      return;
    } else if (userData.password.length > 128) {
      setError("password_too_long");
      return;
    } else {
      setError(null);
    }

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("last_name", userData.last_name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);

      if (imageUri?.length > 0) {
        formData.append("image", {
          uri: imageUri,
          name: imageName,
          type: imageType,
        } as any);
      }

      const response = await fetch(`${apiUrl}/create-user`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (data.error === "User already exists") {
        setShowAlert({
          message: "Ya existe un usuario con ese correo electronico.",
          redirectTo: "/auth/login",
          redirectToText: "Iniciar sesión",
        });
        return;
      }

      if (response.ok) {
        setShowAlert({
          message: "Tu cuenta ha sido creada correctamente.",
          redirectTo: "/auth/login",
          redirectToText: "Iniciar sesión",
        });
      }
    } catch (error) {
      setShowAlert({
        message:
          "Hubo un error al crear tu cuenta. Por favor, intenta de nuevo.",
      });
      resetAll();
      return;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Registrarse" }} />

      <ScrollView>
        <Image
          source={require("@/assets/images/icon.png")}
          style={{
            width: 230,
            height: 230,
            alignSelf: "center",
            marginBottom: 30,
            marginTop: 20,
          }}
        />
        <ThemedView style={styles.double_input_container}>
          <ThemedView style={styles.input_container}>
            <ThemedText style={styles.label}>Nombre</ThemedText>
            <TextInput
              style={[styles.input, error === "no_name" && styles.input_error]}
              value={userData.name}
              onChange={(e) => handleChange("name", e.nativeEvent.text)}
              onSubmitEditing={() => lastNameRef.current?.focus()}
            ></TextInput>
            {error === "no_name" && (
              <ThemedText style={styles.error_text}>
                No se ha introducido un nombre
              </ThemedText>
            )}
          </ThemedView>
          <ThemedView style={styles.input_container}>
            <ThemedText style={styles.label}>Apellido</ThemedText>
            <TextInput
              ref={lastNameRef}
              style={[
                styles.input,
                error === "no_last_name" && styles.input_error,
              ]}
              value={userData.last_name}
              onChange={(e) => handleChange("last_name", e.nativeEvent.text)}
              onSubmitEditing={() => emailRef.current?.focus()}
            ></TextInput>
            {error === "no_last_name" && (
              <ThemedText style={styles.error_text}>
                No se ha introducido un apellido
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.input_container}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            ref={emailRef}
            style={[
              styles.input,
              (error === "no_email" || error === "invalid_email") &&
                styles.input_error,
            ]}
            value={userData.email}
            onChange={(e) => handleChange("email", e.nativeEvent.text)}
            onSubmitEditing={() => passwordRef.current?.focus()}
          ></TextInput>
          {error === "no_email" ? (
            <ThemedText style={styles.error_text}>
              No se ha introducido un email
            </ThemedText>
          ) : error === "invalid_email" ? (
            <ThemedText style={styles.error_text}>
              El email introducido no es valido
            </ThemedText>
          ) : null}
        </ThemedView>
        <ThemedView style={styles.input_container}>
          <ThemedText style={styles.label}>Contraseña</ThemedText>
          <TextInput
            ref={passwordRef}
            style={[
              styles.input,
              (error === "no_password" ||
                error === "password_too_short" ||
                error === "password_too_long") &&
                styles.input_error,
            ]}
            value={userData.password}
            secureTextEntry={passwordHided ? true : false}
            onChange={(e) => handleChange("password", e.nativeEvent.text)}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          ></TextInput>
          {error === "no_password" ? (
            <ThemedText style={styles.error_text}>
              No se ha introducido una contraseña
            </ThemedText>
          ) : error === "password_too_short" ? (
            <ThemedText style={styles.error_text}>
              La contraseña debe tener al menos 8 caracteres
            </ThemedText>
          ) : error === "password_too_long" ? (
            <ThemedText style={styles.error_text}>
              La contraseña debe tener menos de 128 caracteres
            </ThemedText>
          ) : null}
          {passwordHided ? (
            <Ionicons
              name='eye-off-outline'
              size={24}
              color='black'
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: [{ translateY: 4 }],
              }}
              onPress={() => setPasswordHidden(false)}
            />
          ) : (
            <Ionicons
              name='eye-outline'
              size={24}
              color='black'
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: [{ translateY: 4 }],
              }}
              onPress={() => setPasswordHidden(true)}
            />
          )}
        </ThemedView>
        <ThemedView style={styles.input_container}>
          <ThemedText style={styles.label}>Confirmar contraseña</ThemedText>
          <TextInput
            ref={confirmPasswordRef}
            style={[
              styles.input,
              error === "no_password_confirmation" && styles.input_error,
            ]}
            value={userData.password_confirmation}
            secureTextEntry={confirmPasswordHided ? true : false}
            onChange={(e) =>
              handleChange("password_confirmation", e.nativeEvent.text)
            }
          ></TextInput>
          {error === "no_password_confirmation" && (
            <ThemedText style={styles.error_text}>
              Se debe confirmar la contraseña
            </ThemedText>
          )}
          {confirmPasswordHided ? (
            <Ionicons
              name='eye-off-outline'
              size={24}
              color='black'
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: [{ translateY: 4 }],
              }}
              onPress={() => setConfirmPasswordHidden(false)}
            />
          ) : (
            <Ionicons
              name='eye-outline'
              size={24}
              color='black'
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: [{ translateY: 4 }],
              }}
              onPress={() => setConfirmPasswordHidden(true)}
            />
          )}
        </ThemedView>
        <ThemedView style={styles.input_container}>
          <ThemedText style={styles.label}>
            Carga una imagen de perfil (opcional)
          </ThemedText>
          <ThemedView style={styles.image_button_container}>
            <TouchableOpacity onPress={pickImage} style={styles.image_button}>
              <Ionicons name='images-outline' size={18} color='white' />
              <ThemedText style={styles.button_text}>Cargar imagen</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.image_button}>
              <Ionicons name='camera-outline' size={20} color='white' />
              <ThemedText style={styles.button_text}>Tomar una Foto</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Image
              source={require("@/assets/images/blank_image_preview.png")}
              style={styles.image}
            />
          )}
        </ThemedView>
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submit_button_container}
        >
          <ThemedText style={styles.submit_button_text}>Registrarse</ThemedText>
        </TouchableOpacity>
      </ScrollView>
      {showAlert && (
        <Alert
          closeAlert={() => setShowAlert(null)}
          message={showAlert.message}
          redirectTo={showAlert.redirectTo}
          redirectToText={showAlert.redirectToText}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingHorizontal: 10,
    backgroundColor: "#2B63AA",
    flex: 1,
  },
  double_input_container: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 10,
  },
  input_container: {
    flexDirection: "column",
    backgroundColor: "transparent",
    gap: 8,
    flex: 1,
    marginBottom: 20,
    position: "relative",
  },
  error_text: {
    color: "#DA373A",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute",
    bottom: -20,
  },
  label: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    padding: 8,
    backgroundColor: "#00000010",
    borderRadius: 3,
    borderBottomColor: "white",
    borderBottomWidth: 2,
    color: "white",
    fontSize: 16,
  },
  input_error: {
    borderColor: "#DA373A",
  },
  image_button_container: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 10,
  },
  image_button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333333",
    padding: 5,
    borderRadius: 3,
    flex: 1,
  },
  button_text: {
    color: "white",
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginTop: 15,
  },
  submit_button_container: {
    marginBottom: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 3,
    alignItems: "center",
  },
  submit_button_text: {
    color: "#2B63AA",
    fontWeight: "bold",
  },
});
