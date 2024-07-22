import PlanesList from "@/components/buy-catalog/PlanesList";
import { useLocalSearchParams } from "expo-router";

export default function BuyCatalog() {
  const { cat_brand } = useLocalSearchParams();

  if (cat_brand) {
    const cat = (cat_brand as string).split("//")[0];
    const brand = (cat_brand as string).split("//")[1];

    return <PlanesList cat={cat} brand={brand} />;
  } else {
    return <PlanesList cat='all' brand='all' />;
  }
}
