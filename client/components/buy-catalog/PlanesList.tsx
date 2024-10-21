import { useEffect, useState } from "react";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "./Card";
import FilterAndSortComponent from "../searcher/FilterAndSortComponent";
import LoadingSpinner from "../loading/LoadingSpinner";

import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

interface Plane {
  _id: string;
  model: string;
  category: string;
  brand: string;
  price: number;
  manufacture_year: number;
  images: any[];
}

export default function PlanesList(props: { cat: string; brand: string }) {
  const [loadingPlanes, setLoadingPlanes] = useState(true);
  const [allPlanes, setAllPlanes] = useState<Plane[]>([]);
  const [filteredPlanes, setFilteredPlanes] = useState<Plane[]>([]);
  const filterHeight = 320;
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, filterHeight);
  const translateY = diffClamp.interpolate({
    inputRange: [0, filterHeight],
    outputRange: [0, -filterHeight],
  });
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchPlanes = async () => {
    setLoadingPlanes(true);
    const response = await fetch(`${apiUrl}/get-all-buy-planes`);
    const data = await response.json();
    setAllPlanes(data);
    setLoadingPlanes(false);
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

  useEffect(() => {
    if (props.cat === "all" && props.brand === "all") {
      setFilteredPlanes(allPlanes);
    } else {
      if (props.brand === "all" && props.cat !== "all") {
        setFilteredPlanes(
          allPlanes.filter((plane) => plane.category === props.cat)
        );
      } else if (props.cat === "all" && props.brand !== "all") {
        setFilteredPlanes(
          allPlanes.filter((plane) => plane.brand === props.brand)
        );
      } else {
        setFilteredPlanes(
          allPlanes.filter(
            (plane) =>
              plane.category === props.cat && plane.brand === props.brand
          )
        );
      }
    }
  }, [props.cat, props.brand, allPlanes]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <Animated.View
          style={{
            transform: [{ translateY: translateY }],
            zIndex: 5,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <FilterAndSortComponent
            allPlanes={allPlanes}
            setFilteredPlanes={setFilteredPlanes}
            searcherCat={props.cat}
            searcherBrand={props.brand}
          />
        </Animated.View>
        {loadingPlanes ? (
          <ThemedView style={{ flex: 1, paddingTop: filterHeight - 50 }}>
            <LoadingSpinner
              fullScreen={true}
              size='large'
              text='Cargando aeronaves en venta'
            />
          </ThemedView>
        ) : filteredPlanes.length > 0 ? (
          <Animated.FlatList
            data={filteredPlanes}
            numColumns={2}
            renderItem={({ item }) => <Card {...item} />}
            contentContainerStyle={{
              gap: 5,
              padding: 5,
              paddingTop: filterHeight - 50,
            }}
            columnWrapperStyle={{ gap: 5 }}
            keyExtractor={(item) => item._id.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
          />
        ) : (
          <ThemedView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: filterHeight - 50,
              paddingHorizontal: 10,
            }}
          >
            <ThemedText style={{ textAlign: "center" }}>
              No hay aeronaves que coincidan con tu búsqueda
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
