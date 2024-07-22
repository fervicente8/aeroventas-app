import { Animated, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import Card from "./Card";
import FilterAndSortComponent from "../Searcher/FilterAndSortComponent";

import planes from "./planes.json";

interface Plane {
  id: number;
  model: string;
  price: number;
  manufacture_year: number;
  images: string[];
}

export default function PlanesList(props: { cat: string; brand: string }) {
  const [filteredPlanes, setFilteredPlanes] = useState<Plane[]>([]);

  const filterHeight = 270;
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 318);
  const translateY = diffClamp.interpolate({
    inputRange: [0, filterHeight],
    outputRange: [0, -filterHeight],
  });

  useEffect(() => {
    if (props.cat === "all" && props.brand === "all") {
      setFilteredPlanes(planes.airplanes);
    } else {
      if (props.brand === "all" && props.cat !== "all") {
        setFilteredPlanes(
          planes.airplanes.filter((plane) => plane.category === props.cat)
        );
      } else if (props.cat === "all" && props.brand !== "all") {
        setFilteredPlanes(
          planes.airplanes.filter((plane) => plane.brand === props.brand)
        );
      } else {
        setFilteredPlanes(
          planes.airplanes.filter(
            (plane) =>
              plane.category === props.cat && plane.brand === props.brand
          )
        );
      }
    }
  }, [props.cat, props.brand]);

  return (
    <SafeAreaView>
      <Animated.View
        style={{
          transform: [{ translateY: translateY }],
          elevation: 5,
          zIndex: 5,
        }}
      >
        <FilterAndSortComponent
          allPlanes={planes.airplanes}
          setFilteredPlanes={setFilteredPlanes}
          searcherCat={props.cat}
          searcherBrand={props.brand}
        />
      </Animated.View>
      <FlatList
        data={filteredPlanes}
        numColumns={2}
        renderItem={({ item }) => <Card {...item} />}
        contentContainerStyle={{ gap: 5, padding: 5, paddingTop: filterHeight }}
        columnWrapperStyle={{ gap: 5 }}
        keyExtractor={(item) => item.id.toString()}
        onScroll={(e) => {
          scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
      />
    </SafeAreaView>
  );
}
