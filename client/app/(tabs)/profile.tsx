import { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileTab from "@/components/profile/ProfileTab";

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
  document_id: string;
  expiration_date: Date;
  file_url: string;
  created_at: Date;
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
  created_at?: Date;
}

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          const userString = await AsyncStorage.getItem("user");
          const userJson = JSON.parse(userString || "{}");
          setUser(userJson);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size='large' color='#0000ff' />;
  }

  return (
    <ThemedView style={styles.container}>
      {isAuthenticated ? (
        <ProfileTab user={user} onLogout={() => setIsAuthenticated(false)} />
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
