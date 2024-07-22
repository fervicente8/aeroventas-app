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
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import allPlanes from "../../components/buy-catalog/planes.json";

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

export default function PlaneView() {
  const [plane, setPlane] = useState<Plane | null>(null);
  const segments = usePathname().split("/");
  const id = segments[segments.length - 1];
  const numericId = parseInt(id, 10);

  const width = Dimensions.get("window").width;

  useEffect(() => {
    if (id) {
      const findPlaneById = () => {
        const foundPlane = allPlanes.airplanes.find(
          (plane) => plane.id === numericId
        );
        setPlane(foundPlane || null);
      };

      findPlaneById();
    }
  }, [id, numericId]);

  if (!id || plane === null) {
    return null;
  }

  const priceFormatted = plane.price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const totalHoursFormatted = plane.total_hours
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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
    Linking.openURL(`whatsapp://send?phone=+5492494372843`);
  };

  const handleCall = () => {
    Linking.openURL(`tel:+5492494372843`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${"j5s0M@example.com"}`);
  };

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
          renderItem={({ item, index }) => (
            <ThemedView
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Image
                style={{ width: "100%", height: 300 }}
                source={{ uri: item }}
                resizeMode='cover'
              />
            </ThemedView>
          )}
        />

        <ThemedView style={styles.container}>
          <ThemedView style={styles.title_price_container}>
            <ThemedText style={styles.title}>{plane.model}</ThemedText>
            <ThemedText style={styles.price}>${priceFormatted}</ThemedText>
          </ThemedView>
          <ThemedText style={styles.description}>
            {plane.description}
          </ThemedText>
          <ThemedText style={styles.separator_title}>Datos técnicos</ThemedText>
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
                  {totalHoursFormatted} Horas
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
              <ThemedText style={styles.data}>+54 9 249 4372843</ThemedText>
            </ThemedView>
            <ThemedView
              style={styles.icon_data_container_contact}
              onTouchEnd={handleEmail}
            >
              <Ionicons name='mail' size={24} color='#2B63AA' />
              <ThemedText style={styles.data}>
                mamapenesargentina@gmail.com
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
