import { useCallback, useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Linking,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileTab from "@/components/profile/ProfileTab";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

interface Review {
  id: number;
  reviewer: User;
  rating: number;
  comment: string;
  created_at: Date;
}

interface Document {
  type: string;
  files_url: [string];
  created_at: Date;
  status: string;
}

interface UserProfilePicture {
  public_id: string;
  secure_url: string;
}

interface Plane {
  id: number;
  model: string;
  category: string;
  brand: string;
  price: number;
  total_hours: number;
  remainder_motor_hours: number;
  remainder_propeller_hours: number;
  engine_model: string;
  manufacture_year: number;
  documentation_status: string;
  description: string;
  images: string[];
}

interface User {
  _id: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  profile_picture?: UserProfilePicture;
  flight_hours?: number;
  buyed_planes: [Plane];
  rented_planes: [Plane];
  reviews_given: [Review];
  reviews_received: [Review];
  documents: [Document];
  created_at: Date;
  type: string;
  status: string;
}

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [errorFetching, setErrorFetching] = useState(false);
  const [storeEmail, setStoreEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({} as User);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setIsLoadingStore(true);
      setErrorFetching(false);

      const token = await AsyncStorage.getItem("authToken");

      if (token) {
        const userString = await AsyncStorage.getItem("user");
        const userJson = JSON.parse(userString || "{}");

        const userResponse = await fetch(
          `${apiUrl}/get-user-by-id/${userJson._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await userResponse.json();
        setUser(data);
        await AsyncStorage.setItem("user", JSON.stringify(data));
        setIsAuthenticated(true);

        const storeResponse = await fetch(`${apiUrl}/get-store-data`);
        const storeData = await storeResponse.json();
        setIsLoading(false);

        setStoreEmail(storeData[0].email);
        setIsLoadingStore(false);
      } else {
        setIsLoading(false);
        setIsLoadingStore(false);
        setIsAuthenticated(false);
        setErrorFetching(true);
      }
    } catch (error) {
      setIsLoading(false);
      setIsLoadingStore(false);
      setIsAuthenticated(false);
      setErrorFetching(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const onRefresh = useCallback(() => {
    checkAuth();
  }, []);

  if (isLoading || isLoadingStore || errorFetching) {
    return (
      <LoadingSpinner
        fullScreen={true}
        size='large'
        text='Cargando perfil'
        error={errorFetching}
        fetchFunction={checkAuth}
      />
    );
  }

  if (user.status === "suspended") {
    const handleEmail = () => {
      Linking.openURL(`mailto:${storeEmail}`);
    };

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isLoadingStore}
            onRefresh={onRefresh}
          />
        }
      >
        <ThemedText style={styles.authText}>Cuenta suspendida</ThemedText>
        <TouchableOpacity style={styles.authButton} onPress={handleEmail}>
          <ThemedText style={{ color: "white" }}>Hablar con soporte</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {isAuthenticated ? (
        <ProfileTab
          user={user}
          onLogout={() => setIsAuthenticated(false)}
          setUser={setUser}
        />
      ) : (
        <ThemedView style={styles.authContainer}>
          <ThemedText style={styles.authText}>Debes iniciar sesión</ThemedText>
          <Link href='/auth/login' asChild>
            <TouchableOpacity style={styles.authButton}>
              <ThemedText style={{ color: "white" }}>Iniciar sesión</ThemedText>
            </TouchableOpacity>
          </Link>
          <Link href='/auth/register' asChild>
            <TouchableOpacity style={styles.authButton}>
              <ThemedText style={{ color: "white" }}>Registrarse</ThemedText>
            </TouchableOpacity>
          </Link>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    alignItems: "center",
    gap: 10,
  },
  authText: {
    fontSize: 24,
    marginBottom: 15,
  },
  authButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
