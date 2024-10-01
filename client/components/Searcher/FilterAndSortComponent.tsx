import { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface Plane {
  _id: string;
  model: string;
  price: number;
  manufacture_year: number;
  category: string;
  brand: string;
}

export default function FilterAndSortComponent(props: {
  allPlanes: Array<Plane>;
  setFilteredPlanes: any;
  searcherCat: string;
  searcherBrand: string;
}) {
  const { allPlanes, setFilteredPlanes, searcherCat, searcherBrand } = props;

  const todayYear = new Date().getFullYear();
  const getMaxPrice = () => {
    let max = 0;
    allPlanes.forEach((plane) => {
      if (plane.price > max) {
        max = plane.price;
      }
    });
    return max;
  };

  const [searcher, setSearcher] = useState({
    cat: searcherCat || "all",
    brand: searcherBrand || "all",
    min_price: 0,
    max_price: getMaxPrice(),
    min_manufacture_year: 1942,
    max_manufacture_year: todayYear,
  });

  const [order, setOrder] = useState({
    order_by: "manufacture_year",
    order_type: "asc",
  });

  useEffect(() => {
    setSearcher(() => ({
      ...searcher,
      max_price: getMaxPrice(),
    }));
  }, [allPlanes]);

  useEffect(() => {
    setSearcher((prevSearcher) => ({
      ...prevSearcher,
      cat: searcherCat || prevSearcher.cat,
      brand: searcherBrand || prevSearcher.brand,
    }));
  }, [searcherCat || searcherBrand]);

  const onChangeSearcher = (key: string, value: any) => {
    if (
      (key === "min_price" ||
        key === "max_price" ||
        key === "min_manufacture_year" ||
        key === "max_manufacture_year") &&
      isNaN(value)
    ) {
      value = 0;
    }

    setSearcher((prevSearcher) => ({
      ...prevSearcher,
      [key]: value,
    }));
  };

  const onFilter = () => {
    const {
      cat,
      brand,
      min_price,
      max_price,
      min_manufacture_year,
      max_manufacture_year,
    } = searcher;

    const results = allPlanes.filter((plane) => {
      let matches = true;

      if (cat !== "all") {
        matches = matches && plane.category === cat;
      }

      if (brand !== "all") {
        matches = matches && plane.brand === brand;
      }

      if (min_price !== undefined && max_price !== undefined) {
        matches =
          matches && plane.price >= min_price && plane.price <= max_price;
      }

      if (
        min_manufacture_year !== undefined &&
        max_manufacture_year !== undefined
      ) {
        matches =
          matches &&
          plane.manufacture_year >= min_manufacture_year &&
          plane.manufacture_year <= max_manufacture_year;
      }

      return matches;
    });

    return results;
  };

  const changeOrder = (
    orderBy: string,
    orderType: string,
    filteredPlanes: any
  ) => {
    setFilteredPlanes(
      filteredPlanes.sort((a: any, b: any) => {
        if (orderType === "asc") {
          return a[orderBy] - b[orderBy];
        } else {
          return b[orderBy] - a[orderBy];
        }
      })
    );
  };

  useEffect(() => {
    const filtered = onFilter();
    changeOrder(order.order_by, order.order_type, filtered);
  }, [searcher, order]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.row_container}>
        <ThemedView style={{ backgroundColor: "transparent", gap: 5, flex: 1 }}>
          <ThemedText style={{ color: "white", fontWeight: "bold" }}>
            Categoría
          </ThemedText>
          <Picker
            selectedValue={searcher.cat}
            onValueChange={(value) => onChangeSearcher("cat", value)}
            style={styles.select}
            mode='dropdown'
          >
            <Picker.Item label='Todas las categorias' value='all' />
            <Picker.Item label='Agrícola' value='agricultural' />
            <Picker.Item label='Bimotor' value='bimotor' />
            <Picker.Item label='Experimental' value='experimental' />
            <Picker.Item label='Helicóptero' value='helicopter' />
            <Picker.Item label='Jets' value='jets' />
            <Picker.Item label='Monomotor' value='monomotor' />
            <Picker.Item label='Planeador' value='planeador' />
          </Picker>
        </ThemedView>
        <ThemedView style={{ backgroundColor: "transparent", gap: 5, flex: 1 }}>
          <ThemedText style={{ color: "white", fontWeight: "bold" }}>
            Marca
          </ThemedText>
          <Picker
            selectedValue={searcher.brand}
            onValueChange={(value) => onChangeSearcher("brand", value)}
            style={styles.select}
            mode='dropdown'
          >
            <Picker.Item label='Todas las marcas' value='all' />
            <Picker.Item label='Aero Boero' value='aeroboero' />
            <Picker.Item label='Air Tractor' value='airtractor' />
            <Picker.Item label='Antonov' value='antonov' />
            <Picker.Item label='Ayres' value='ayres' />
            <Picker.Item label='Beechcraft' value='beechcraft' />
            <Picker.Item label='Bell' value='bell' />
            <Picker.Item label='Bellanca' value='bellanca' />
            <Picker.Item label='Boyero' value='boyero' />
            <Picker.Item label='Cessna' value='cessna' />
            <Picker.Item label='Cirrus' value='cirrus' />
            <Picker.Item label='Commander' value='commander' />
            <Picker.Item label='Ercoupe' value='ercoupe' />
            <Picker.Item label='Evector' value='evector' />
            <Picker.Item label='Ercoupe' value='ercoupe' />
            <Picker.Item label='Grumman' value='grumman' />
            <Picker.Item label='Lancair' value='lancair' />
            <Picker.Item label='Luscombe' value='luscombe' />
            <Picker.Item label='Mitsubishi' value='mitsubishi' />
            <Picker.Item label='Mooney' value='mooney' />
            <Picker.Item label='Piper' value='piper' />
            <Picker.Item label='Pipistrel' value='pipistrel' />
            <Picker.Item label='Puelche' value='puelche' />
            <Picker.Item label='Pzl' value='pzl' />
            <Picker.Item label='Ranquel' value='ranquel' />
            <Picker.Item label='Rans' value='rans' />
            <Picker.Item label='Richard' value='richard' />
            <Picker.Item label='Robinson' value='robinson' />
            <Picker.Item label='Storm Aircraft' value='stormaircraft' />
            <Picker.Item label='Super Decathlon' value='superdecathlon' />
            <Picker.Item label='Taylor' value='taylor' />
            <Picker.Item label='Tecnam' value='tecnam' />
            <Picker.Item label='Vans' value='vans' />
            <Picker.Item label='Weatherly' value='weatherly' />
            <Picker.Item label='Zlin' value='zlin' />
          </Picker>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.row_container}>
        <ThemedView
          style={{ backgroundColor: "transparent", gap: 5, width: "45%" }}
        >
          <ThemedText style={{ color: "white", fontWeight: "bold" }}>
            Precio
          </ThemedText>
          <ThemedView style={styles.row_container}>
            <TextInput
              onChangeText={(value) =>
                onChangeSearcher("min_price", Number(value))
              }
              value={String(searcher.min_price)}
              placeholder='Min'
              style={styles.input}
              keyboardType='numeric'
            />
            <TextInput
              onChangeText={(value) =>
                onChangeSearcher("max_price", Number(value))
              }
              value={String(searcher.max_price)}
              placeholder='Max'
              style={styles.input}
              keyboardType='numeric'
            />
          </ThemedView>
        </ThemedView>
        <ThemedView
          style={{ backgroundColor: "transparent", gap: 5, width: "49.5%" }}
        >
          <ThemedText style={{ color: "white", fontWeight: "bold" }}>
            Año de fabricación
          </ThemedText>
          <ThemedView style={styles.row_container}>
            <TextInput
              onChangeText={(value) =>
                onChangeSearcher("min_manufacture_year", Number(value))
              }
              value={String(searcher.min_manufacture_year)}
              placeholder='Min'
              style={styles.input}
              keyboardType='numeric'
            />
            <TextInput
              onChangeText={(value) =>
                onChangeSearcher("max_manufacture_year", Number(value))
              }
              value={String(searcher.max_manufacture_year)}
              placeholder='Max'
              style={styles.input}
              keyboardType='numeric'
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
      <ThemedView
        style={{
          backgroundColor: "transparent",
          gap: 5,
          width: "100%",
        }}
      >
        <ThemedText style={{ color: "white", fontWeight: "bold" }}>
          Ordenar
        </ThemedText>
        <ThemedView
          style={{
            flexDirection: "row",
            backgroundColor: "transparent",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              gap: 5,
              backgroundColor: "transparent",
              flex: 1,
            }}
          >
            <ThemedText
              style={[
                styles.sort_button_left,
                order.order_by === "manufacture_year" &&
                  styles.selected_sort_button,
              ]}
              onPress={() =>
                setOrder({ ...order, order_by: "manufacture_year" })
              }
            >
              Año
            </ThemedText>
            <ThemedText
              style={[
                styles.sort_button_right,
                order.order_by === "price" && styles.selected_sort_button,
              ]}
              onPress={() => setOrder({ ...order, order_by: "price" })}
            >
              Precio
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={{
              flexDirection: "row",
              gap: 5,
              backgroundColor: "transparent",
              flex: 1,
            }}
          >
            <ThemedText
              style={[
                styles.sort_button_left,
                order.order_type === "asc" && styles.selected_sort_button,
              ]}
              onPress={() => setOrder({ ...order, order_type: "asc" })}
            >
              <FontAwesome
                name='sort-amount-asc'
                size={16}
                color={order.order_type === "asc" ? "white" : "black"}
              />{" "}
              Asc
            </ThemedText>
            <ThemedText
              style={[
                styles.sort_button_right,
                order.order_type === "desc" && styles.selected_sort_button,
              ]}
              onPress={() => setOrder({ ...order, order_type: "desc" })}
            >
              <FontAwesome
                name='sort-amount-desc'
                size={16}
                color={order.order_type === "desc" ? "white" : "black"}
              />{" "}
              Desc
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2B63AA",
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: "#000",
    elevation: 5,
  },
  row_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    gap: 5,
    marginBottom: 5,
  },
  select: {
    backgroundColor: "white",
  },
  input: {
    backgroundColor: "white",
    padding: 5,
    flex: 1,
  },
  sort_button_left: {
    backgroundColor: "white",
    padding: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    fontWeight: "500",
    flex: 1,
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 1.2,
  },
  sort_button_right: {
    backgroundColor: "white",
    padding: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    fontWeight: "500",
    flex: 1,
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 1.2,
  },
  selected_sort_button: {
    backgroundColor: "#1A4176",
    color: "white",
  },
});
