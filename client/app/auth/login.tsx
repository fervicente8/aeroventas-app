import React, { useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Alert from "@/components/alerts/Alert";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

interface User {
  email: string;
  password: string;
}

export default function Login() {
  const [loadingLogin, setLoadingLogin] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const [userData, setUserData] = useState<User>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [passwordHided, setPasswordHidden] = useState(true);
  const [showAlert, setShowAlert] = useState<{
    message: string;
  } | null>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleChange = (name: string, value: string) => {
    setUserData(() => ({ ...userData, [name]: value }));
    setError(null);
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!userData.email) {
      setError("no_email");
      return;
    } else if (!validateEmail(userData.email)) {
      setError("invalid_email");
      return;
    } else if (!userData.password) {
      setError("no_password");
      return;
    }
    setError(null);

    setLoadingLogin(true);

    try {
      const response = await fetch(`${apiUrl}/login-user`, {
        method: "PUT",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        setError(data.error);
        setLoadingLogin(false);
        return;
      } else {
        await AsyncStorage.setItem("authToken", data._id);
        await AsyncStorage.setItem("user", JSON.stringify(data));
        router.replace("/(tabs)/profile");
        setLoadingLogin(false);
      }
    } catch (error) {
      console.error(error);
      setShowAlert({
        message: "Error al iniciar sesión. Por favor, inténtelo de nuevo.",
      });
      setLoadingLogin(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Iniciar sesión" }} />

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
        <ThemedView style={styles.input_container}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={[
              styles.input,
              (error === "no_email" || error === "invalid_email") &&
                styles.input_error,
            ]}
            value={userData.email}
            onChangeText={(value) => handleChange("email", value)}
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
            onChangeText={(value) => {
              handleChange("password", value);
            }}
            onSubmitEditing={handleSubmit}
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

          <TouchableOpacity
            onPress={() => {}}
            style={styles.forgot_password_container}
          >
            <ThemedText style={styles.forgot_password_text}>
              Olvidaste tu contraseña?
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {loadingLogin ? (
          <LoadingSpinner
            size='small'
            style={{
              marginTop: 30,
              backgroundColor: "white",
              borderRadius: 3,
              padding: 12,
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.submit_button_container}
          >
            <ThemedText style={styles.submit_button_text}>Ingresar</ThemedText>
          </TouchableOpacity>
        )}
        {error === "invalid_credentials" ? (
          <ThemedText style={styles.credentials_error_text}>
            Datos de inicio de sesión incorrectos
          </ThemedText>
        ) : null}
      </ScrollView>

      {showAlert && (
        <Alert
          closeAlert={() => setShowAlert(null)}
          message={showAlert.message}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2B63AA",
    padding: 10,
    flex: 1,
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
  forgot_password_container: {
    position: "absolute",
    alignSelf: "flex-end",
    bottom: "-35%",
    right: 5,
  },
  forgot_password_text: {
    fontSize: 14,
    color: "white",
  },
  submit_button_container: {
    marginTop: 30,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 3,
    alignItems: "center",
  },
  submit_button_text: {
    color: "#2B63AA",
    fontWeight: "bold",
  },
  credentials_error_text: {
    color: "#DA373A",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
  },
});
