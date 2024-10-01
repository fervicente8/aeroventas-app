import { useState } from "react";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Picker } from "@react-native-picker/picker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function Searcher() {
  const [selectedOption, setSelectedOption] = useState<string>("buy-catalog");
  const [searcher, setSearcher] = useState<{ cat: string; brand: string }>({
    cat: "all",
    brand: "all",
  });

  const onChangeSearcher = (key: string, value: string) => {
    setSearcher({
      ...searcher,
      [key]: value,
    });
  };

  return (
    <ThemedView style={styles.selectContainer}>
      <ThemedView style={styles.sellRentContainer}>
        <ThemedText
          style={
            selectedOption === "buy-catalog"
              ? styles.selectedOption
              : styles.option
          }
          onPress={() => setSelectedOption("buy-catalog")}
        >
          Vender
        </ThemedText>
        <ThemedText
          style={
            selectedOption === "rent-catalog"
              ? styles.selectedOption
              : styles.option
          }
          onPress={() => setSelectedOption("rent-catalog")}
        >
          Alquilar
        </ThemedText>
      </ThemedView>
      <Picker
        selectedValue={searcher.cat}
        onValueChange={(value) => onChangeSearcher("cat", value)}
        style={styles.select}
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
      <Picker
        selectedValue={searcher.brand}
        onValueChange={(value) => onChangeSearcher("brand", value)}
        style={styles.select}
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
      <Link
        style={{
          width: "100%",
          textAlign: "center",
          padding: 8,
          color: "white",
          fontWeight: "bold",
          textTransform: "uppercase",
          backgroundColor: "#2B63AA",
          borderRadius: 5,
        }}
        href={{
          pathname:
            (`/(tabs)/${selectedOption}/[cat_brand]` as "/(tabs)/buy-catalog/[cat_brand]") ||
            "/(tabs)/rent-catalog/[cat_brand]",
          params: { cat_brand: `${searcher.cat}//${searcher.brand}` },
        }}
        onPressOut={() => setSearcher({ cat: "all", brand: "all" })}
      >
        Buscar
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  selectContainer: {
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    gap: 10,
  },
  sellRentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  option: {
    color: "white",
    width: "48%",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#2B63AA",
    padding: 5,
    borderRadius: 5,
  },
  selectedOption: {
    color: "white",
    backgroundColor: "#2B63AA",
    width: "48%",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#2B63AA",
    padding: 5,
    borderRadius: 5,
  },
  select: {
    backgroundColor: "white",
  },
});
