import { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import { Stack, usePathname } from "expo-router";
import Carousel from "react-native-reanimated-carousel";
import {
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  Fontisto,
} from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

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
  images: any[];
}

export default function PlaneView() {
  const [loadingPlane, setLoadingPlane] = useState(true);
  const [loadingStore, setLoadingStore] = useState(true);
  const [plane, setPlane] = useState<Plane | null>(null);
  const [storeData, setStoreData] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    whatsapp_phone: "",
  });
  const segments = usePathname().split("/");
  const id = segments[segments.length - 1];
  const width = Dimensions.get("window").width;
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (id) {
      setLoadingPlane(true);
      const findPlaneById = async () => {
        setLoadingPlane(true);
        const response = await fetch(`${apiUrl}/get-plane-by-id/${id}`);
        const data = await response.json();
        setPlane(data);
        setLoadingPlane(false);
      };

      findPlaneById();
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!plane) return;
      setLoadingStore(true);
      const response = await fetch(`${apiUrl}/get-store-data`);
      const data = await response.json();
      setStoreData(data[0]);
      setLoadingStore(false);
    };
    fetchData();
  }, [plane]);

  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const firstLetterUpperCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const documentationFormatted = (str: string) => {
    if (str === "ready_to_transfer") {
      return "Listo para transferir";
    } else if (str === "ready_to_fly") {
      return "Listo para volar";
    } else if (str === "under_revision") {
      return "En revisión";
    } else {
      return "No disponible";
    }
  };

  const handleWhatsapp = () => {
    Linking.openURL(
      `whatsapp://send?phone=${storeData.whatsapp_phone}&text=Hola!%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20avion.`
    );
  };

  const handleCall = () => {
    Linking.openURL(`tel:${storeData.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${storeData.email}`);
  };

  if (loadingPlane || loadingStore) {
    return <LoadingSpinner fullScreen size='large' text='Cargando aeronave' />;
  } else if (!loadingPlane && plane === null) {
    return (
      <ThemedView>
        <ThemedText style={styles.no_plane_text}>
          No se ha podido encontrar el avion
        </ThemedText>
      </ThemedView>
    );
  } else if (!loadingPlane && !loadingStore && plane) {
    return (
      <>
        <Stack.Screen options={{ title: plane.model }} />
        <ScrollView>
          <Carousel
            loop
            width={width}
            height={300}
            autoPlay={false}
            data={plane.images}
            scrollAnimationDuration={1000}
            mode='parallax'
            modeConfig={{
              parallaxScrollingScale: 1,
              parallaxScrollingOffset: 0,
            }}
            renderItem={({ item }) => (
              <ThemedView
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ width: "100%", height: 300 }}
                  source={{ uri: item.secure_url }}
                  resizeMode='cover'
                />
              </ThemedView>
            )}
          />

          <ThemedView style={styles.container}>
            <ThemedView style={styles.title_price_container}>
              <ThemedText style={styles.title}>{plane.model}</ThemedText>
              <ThemedText style={styles.price}>
                ${formatNumber(plane.price)}
              </ThemedText>
            </ThemedView>
            <ThemedText style={styles.description}>
              {plane.description}
            </ThemedText>
            <ThemedText style={styles.separator_title}>
              Datos técnicos
            </ThemedText>
            <ThemedView style={styles.data_container}>
              <ThemedView style={styles.double_data_container}>
                <ThemedView style={styles.icon_data_container}>
                  <MaterialIcons name='category' size={24} color='#2B63AA' />
                  <ThemedText style={styles.data}>
                    {firstLetterUpperCase(plane.category)}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.icon_data_container}>
                  <MaterialIcons name='label' size={24} color='#2B63AA' />
                  <ThemedText style={styles.data}>
                    {firstLetterUpperCase(plane.brand)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.double_data_container}>
                <ThemedView style={styles.icon_data_container}>
                  <Ionicons name='calendar' size={24} color='#2B63AA' />
                  <ThemedText style={styles.data}>
                    {plane.manufacture_year}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.icon_data_container}>
                  <AntDesign name='clockcircle' size={20} color='#2B63AA' />
                  <ThemedText style={styles.data}>
                    {formatNumber(plane.total_hours)} horas totales
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.double_data_container}>
                <ThemedView style={styles.icon_data_container}>
                  <AntDesign name='clockcircle' size={20} color='#2B63AA' />
                  <ThemedText style={styles.data}>
                    {formatNumber(plane.remainder_motor_hours)} horas remanentes
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.icon_data_container}>
                  <Fontisto name='propeller-1' size={20} color='#2B63AA' />
                  <ThemedText style={styles.data}>
                    {formatNumber(plane.remainder_propeller_hours)} horas
                    remanentes
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.double_data_container}>
                <ThemedView style={styles.icon_data_container}>
                  <MaterialCommunityIcons
                    name='engine'
                    size={24}
                    color='#2B63AA'
                  />
                  <ThemedText style={styles.data}>
                    {plane.engine_model}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.icon_data_container}>
                  <Ionicons name='document' size={22} color='#2B63AA' />
                  <ThemedText style={styles.data}>
                    {documentationFormatted(plane.documentation_status)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>

            <ThemedText style={styles.separator_title}>Contacto</ThemedText>

            <ThemedView style={styles.data_container}>
              <ThemedView
                style={styles.icon_data_container_contact}
                onTouchEnd={handleWhatsapp}
              >
                <Ionicons name='logo-whatsapp' size={24} color='#00bb2d' />
                <ThemedText style={styles.data}>
                  Contáctanos al WhatsApp
                </ThemedText>
              </ThemedView>
              <ThemedView
                style={styles.icon_data_container_contact}
                onTouchEnd={handleCall}
              >
                <Ionicons name='call' size={24} color='#2B63AA' />
                <ThemedText style={styles.data}>{storeData.phone}</ThemedText>
              </ThemedView>
              <ThemedView
                style={styles.icon_data_container_contact}
                onTouchEnd={handleEmail}
              >
                <Ionicons name='mail' size={24} color='#2B63AA' />
                <ThemedText style={styles.data}>{storeData.email}</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  no_plane_text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#2B63AA",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title_price_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#333333",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2B63AA",
  },
  description: {
    fontSize: 16,
    color: "#333333",
  },
  separator_title: {
    fontSize: 20,
    fontWeight: "500",
    textTransform: "uppercase",
    marginTop: 30,
    marginBottom: 15,
    alignSelf: "center",
    color: "#333333",
  },
  data_container: {
    flex: 1,
    gap: 15,
  },
  double_data_container: {
    flexDirection: "row",
  },
  icon_data_container: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  data: {
    fontWeight: "500",
    color: "#333333",
  },
  icon_data_container_contact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
