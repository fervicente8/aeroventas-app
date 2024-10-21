import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import EditAirplaneComponent from "./EditAirplaneComponent";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";

interface Plane {
  _id: string;
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
  images: { secure_url: string; public_id: string }[];
  status: string;
  created_at: Date;
}

interface Props {
  loadingPlanes: boolean;
  setShowAlert: (value: any) => void;
  planes: Plane[];
  setPlanes: (value: any) => void;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

export default function ManageAirplanes({
  loadingPlanes,
  setShowAlert,
  planes,
  setPlanes,
  selectedTab,
  setSelectedTab,
}: Props) {
  const [planesFiltered, setPlanesFiltered] = useState<Plane[]>([]);
  const [editPlaneId, setEditPlaneId] = useState<string | null>(null);
  const [idPlaneToDelete, setIdPlaneToDelete] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [filtersHeight, setFiltersHeight] = useState(0);
  const [searcher, setSearcher] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
  });
  const [orderDate, setOrderDate] = useState("asc");

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setFiltersHeight(height);
  };

  const onFilter = () => {
    const { category, status } = filters;

    let tempPlanes = [...planes];

    //search
    if (searcher) {
      tempPlanes = tempPlanes.filter((plane) => {
        return (
          plane.model.toLowerCase().includes(searcher.toLowerCase()) ||
          plane.brand.toLowerCase().includes(searcher.toLowerCase())
        );
      });
    }

    const results = tempPlanes.filter((plane) => {
      let matches = true;

      if (category !== "all") {
        matches = matches && plane.category === category;
      }
      if (status !== "all") {
        matches = matches && plane.status === status;
      }

      return matches;
    });

    return results;
  };

  const handleOrderPlanes = (filteredPlanes: Plane[]) => {
    setPlanesFiltered(
      filteredPlanes.sort((a, b) => {
        if (orderDate === "asc") {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        } else {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
      })
    );
  };

  useEffect(() => {
    const filtered = onFilter();
    handleOrderPlanes(filtered);
  }, [filters, searcher, orderDate]);

  const uppercaseFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const translateCategory = (str: string) => {
    if (str === "agricultural") {
      return "Agrícola";
    } else if (str === "bimotor") {
      return "Bimotor";
    } else if (str === "experimental") {
      return "Experimental";
    } else if (str === "helicopter") {
      return "Helicóptero";
    } else if (str === "jets") {
      return "Jets";
    } else if (str === "monomotor") {
      return "Monomotor";
    } else if (str === "planeador") {
      return "Planeador";
    }
  };

  const priceFormatted = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const deleteById = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/delete-buy-plane/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setPlanes(planes.filter((plane) => plane._id !== id));
        setPlanesFiltered(planes.filter((plane) => plane._id !== id));
        setConfirmDelete(false);
        setIdPlaneToDelete("");
        setShowAlert({
          message: "Aeronave eliminada correctamente",
        });
      } else {
        setConfirmDelete(false);
        setIdPlaneToDelete("");
        setShowAlert({
          message: "Error al eliminar la aeronave",
        });
      }
    } catch (error) {
      setShowAlert({
        message: "Error al eliminar la aeronave",
      });
    }
  };

  if (planes.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text_title}>
          No hay aeronaves registradas
        </ThemedText>
      </ThemedView>
    );
  }

  if (selectedTab === "aeroventas-manage-airplanes") {
    return (
      <ThemedView style={styles.container}>
        <ThemedView
          style={styles.filters_searcher_container}
          onLayout={handleLayout}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              gap: 10,
              width: "100%",
              backgroundColor: "transparent",
            }}
          >
            <ThemedView style={styles.searcher_container}>
              <TextInput
                style={styles.searcher}
                placeholder='Buscar...'
                value={searcher}
                onChangeText={(text) => setSearcher(text)}
              />
              <MaterialCommunityIcons
                name='magnify'
                size={24}
                color='#2B63AA'
              />
            </ThemedView>
            <TouchableOpacity
              style={styles.sort_container}
              onPress={() => setOrderDate(orderDate === "asc" ? "desc" : "asc")}
            >
              <ThemedText
                ellipsizeMode='tail'
                numberOfLines={2}
                style={styles.sort_text}
              >
                {orderDate === "asc" ? "Mas reciente" : "Mas antiguo"}
              </ThemedText>
              <MaterialCommunityIcons
                name={
                  orderDate === "asc" ? "sort-ascending" : "sort-descending"
                }
                size={24}
                color='white'
              />
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={styles.filters_container}>
            <ThemedView style={styles.filter_container}>
              <ThemedText style={styles.filter_text}>Categoría:</ThemedText>
              <ThemedView style={styles.picker_container}>
                <Picker
                  selectedValue={filters.category}
                  onValueChange={(itemValue) =>
                    setFilters({ ...filters, category: itemValue })
                  }
                  mode='dropdown'
                  style={styles.picker}
                  dropdownIconColor='#2B63AA'
                >
                  <Picker.Item label='Todas' value='all' />
                  <Picker.Item label='Agrícola' value='agricultural' />
                  <Picker.Item label='Bimotor' value='bimotor' />
                  <Picker.Item label='Experimental' value='experimental' />
                  <Picker.Item label='Helicóptero' value='helicopter' />
                  <Picker.Item label='Jets' value='jets' />
                  <Picker.Item label='Monomotor' value='monomotor' />
                  <Picker.Item label='Planeador' value='planeador' />
                </Picker>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.filter_container}>
              <ThemedText style={styles.filter_text}>Estado:</ThemedText>
              <ThemedView style={styles.picker_container}>
                <Picker
                  selectedValue={filters.status}
                  onValueChange={(itemValue) =>
                    setFilters({ ...filters, status: itemValue })
                  }
                  mode='dropdown'
                  style={styles.picker}
                  dropdownIconColor='#2B63AA'
                >
                  <Picker.Item label='Todos' value='all' />
                  <Picker.Item label='Activo' value='active' />
                  <Picker.Item label='Vendido' value='sold' />
                  <Picker.Item label='Eliminado' value='deleted' />
                  <Picker.Item label='Negociación' value='negotiation' />
                </Picker>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        {loadingPlanes ? (
          <LoadingSpinner
            fullScreen={true}
            size='large'
            text='Cargando aeronaves'
          />
        ) : (
          <ScrollView style={{ marginTop: filtersHeight + 10 }}>
            {planesFiltered.map((plane) => (
              <ThemedView key={plane._id} style={styles.card_container}>
                <ThemedView style={styles.row_container}>
                  <Image
                    source={{ uri: plane.images[0].secure_url }}
                    style={{
                      width: 100,
                      height: 80,
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                    }}
                  />
                  <ThemedView style={{ backgroundColor: "transparent" }}>
                    <ThemedText
                      style={styles.text_title}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {uppercaseFirstLetter(plane.model)}
                    </ThemedText>
                    <ThemedText
                      style={styles.text_subtitle}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      ${priceFormatted(plane.price)}
                    </ThemedText>
                    <ThemedText
                      style={styles.text_subtitle}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {translateCategory(plane.category)}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.buttons_container}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setEditPlaneId(plane._id);
                      setSelectedTab("aeroventas-manage-airplanes-edit");
                    }}
                  >
                    <MaterialCommunityIcons
                      name='pencil'
                      size={28}
                      color='#2B63AA'
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setIdPlaneToDelete(plane._id);
                      setConfirmDelete(true);
                    }}
                  >
                    <MaterialCommunityIcons
                      name='delete'
                      size={28}
                      color='#DA373A'
                    />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            ))}
            <ConfirmDeleteModal
              isVisible={confirmDelete}
              setIsVisible={setConfirmDelete}
              setDeleteId={setIdPlaneToDelete}
              onDelete={() => {
                deleteById(idPlaneToDelete);
              }}
            />
          </ScrollView>
        )}
      </ThemedView>
    );
  } else if (selectedTab === "aeroventas-manage-airplanes-edit") {
    return (
      <EditAirplaneComponent
        planeId={editPlaneId}
        setSelectedTab={setSelectedTab}
        setShowAlert={setShowAlert}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -32,
  },
  filters_searcher_container: {
    backgroundColor: "#2B63AA",
    position: "absolute",
    top: 0,
    left: "-3.2%",
    right: 0,
    width: "106.4%",
    zIndex: 1,
    padding: 10,
  },
  searcher_container: {
    flex: 1,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
  },
  filters_container: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  filter_container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    gap: 5,
  },
  filter_text: {
    color: "white",
    fontSize: 14,
  },
  picker_container: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  picker: {
    width: "100%",
    borderRadius: 5,
    color: "#2B63AA",
    fontSize: 14,
  },
  sort_container: {
    width: 90,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  sort_text: {
    color: "white",
    fontSize: 14,
  },
  searcher: {
    backgroundColor: "transparent",
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  card_container: {
    maxHeight: 81,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "transparent",
    borderColor: "#2B63AA",
    borderWidth: 1,
    marginBottom: 10,
  },
  row_container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: "32%",
  },
  text_title: {
    fontWeight: "600",
    fontSize: 18,
    color: "#2B63AA",
    overflow: "hidden",
  },
  text_subtitle: {
    fontSize: 14,
    color: "black",
  },
  buttons_container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  button: {
    backgroundColor: "#2B63AA20",
    padding: 10,
    height: "100%",
    justifyContent: "center",
  },
});
