import { useEffect, useState, useRef } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

interface Props {
  planeId: string | null;
  setSelectedTab: (value: string) => void;
  setShowAlert: (value: any) => void;
}

export default function EditAirplaneComponent({
  planeId,
  setSelectedTab,
  setShowAlert,
}: Props) {
  const [loadingPlane, setLoadingPlane] = useState(true);
  const [loadingEditing, setLoadingEditing] = useState(false);
  const [airplane, setAirplane] = useState({
    _id: "",
    model: "",
    category: "all",
    brand: "all",
    price: 0,
    total_hours: 0,
    remainder_motor_hours: 0,
    remainder_propeller_hours: 0,
    engine_model: "",
    manufacture_year: 0,
    documentation_status: "under_revision",
    description: "",
    images: [] as any[],
    status: "active",
  });
  const [airplaneImagesUri, setAirplaneImagesUri] = useState<string[]>([""]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [edited, setEdited] = useState(false);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const modelRef = useRef<TextInput>(null);
  const categoryRef = useRef<Picker<string>>(null);
  const brandRef = useRef<Picker<string>>(null);
  const priceRef = useRef<TextInput>(null);
  const totalHoursRef = useRef<TextInput>(null);
  const remainderMotorHoursRef = useRef<TextInput>(null);
  const remainderPropellerHoursRef = useRef<TextInput>(null);
  const engineModelRef = useRef<TextInput>(null);
  const manufactureYearRef = useRef<TextInput>(null);
  const documentationStatusRef = useRef<Picker<string>>(null);
  const descriptionRef = useRef<TextInput>(null);

  useEffect(() => {
    if (planeId) {
      setLoadingPlane(true);
      fetch(`${apiUrl}/get-plane-by-id/${planeId}`)
        .then((response) => response.json())
        .then((data) => {
          setAirplane(data);
          const imagesUri = data.images.map(
            (image: { secure_url: string }) => image.secure_url
          );
          setAirplaneImagesUri([...imagesUri, ""]);
          setLoadingPlane(false);
        })
        .catch(() => {
          setLoadingPlane(false);
          setShowAlert({
            message: "Error al obtener la aeronave.",
          });
        });
    }
  }, [planeId]);

  const handleChange = (name: string, value: any) => {
    if (
      (name === "price" ||
        name === "total_hours" ||
        name === "remainder_motor_hours" ||
        name === "remainder_propeller_hours" ||
        name === "manufacture_year") &&
      isNaN(value)
    ) {
      value = 0;
    }

    setEdited(true);
    setAirplane(() => ({ ...airplane, [name]: value }));
    setError(null);
  };

  const pickImage = async (index = 0) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setShowAlert({
        message: "Lo sentimos, necesitamos permisos para acceder a la galeria.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const newAirplaneImages = [...airplane.images];
      const newAirplaneUris = [...airplaneImagesUri];
      newAirplaneImages[index] = result.assets[0].uri;
      newAirplaneUris[index] = result.assets[0].uri;

      if (newAirplaneUris[newAirplaneUris.length - 1] !== "") {
        setAirplaneImagesUri([...newAirplaneUris, ""]);
      } else {
        setAirplaneImagesUri(newAirplaneImages);
      }
      setAirplane({
        ...airplane,
        images: newAirplaneImages,
      });

      setEdited(true);
    }
  };

  const takePhoto = async (index = 0) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setShowAlert({
        message: "Lo sentimos, necesitamos permisos para acceder a la camara.",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const newAirplaneImages = [...airplane.images];
      const newAirplaneUris = [...airplaneImagesUri];
      newAirplaneImages[index] = result.assets[0].uri;
      newAirplaneUris[index] = result.assets[0].uri;

      if (newAirplaneUris[newAirplaneUris.length - 1] !== "") {
        setAirplaneImagesUri([...newAirplaneUris, ""]);
      } else {
        setAirplaneImagesUri(newAirplaneImages);
      }
      setAirplane({
        ...airplane,
        images: newAirplaneImages,
      });

      setEdited(true);
    }
  };

  const deleteAirplaneImage = (index: number) => {
    const newAirplaneImages = [...airplane.images];
    const newAirplaneUris = [...airplaneImagesUri];
    if (
      newAirplaneUris[index].startsWith("https://") ||
      newAirplaneUris[index].startsWith("http://")
    ) {
      setImagesToDelete([...imagesToDelete, newAirplaneImages[index]]);
    }
    newAirplaneImages.splice(index, 1);
    newAirplaneUris.splice(index, 1);
    if (
      newAirplaneImages[newAirplaneImages.length - 1] === "" &&
      newAirplaneImages[newAirplaneImages.length - 2] === ""
    ) {
      newAirplaneImages.pop();
      newAirplaneUris.pop();
    }
    setAirplaneImagesUri(newAirplaneUris);
    setAirplane({
      ...airplane,
      images: newAirplaneImages,
    });

    setEdited(true);
  };

  const resetAll = () => {
    setAirplane({
      _id: "",
      model: "",
      category: "all",
      brand: "all",
      price: 0,
      total_hours: 0,
      remainder_motor_hours: 0,
      remainder_propeller_hours: 0,
      engine_model: "",
      manufacture_year: 0,
      documentation_status: "under_revision",
      description: "",
      images: [] as string[],
      status: "active",
    });
    setAirplaneImagesUri([""]);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!edited) {
      setShowAlert({ message: "No se realizaron cambios." });
      return;
    } else if (!airplane.model) {
      setError("no_model");
      modelRef.current?.focus();
      return;
    } else if (airplane.category === "all") {
      setError("no_category");
      categoryRef.current?.focus();
      return;
    } else if (airplane.brand === "all") {
      setError("no_brand");
      brandRef.current?.focus();
      return;
    } else if (!airplane.price) {
      setError("no_price");
      priceRef.current?.focus();
      return;
    } else if (!airplane.total_hours) {
      setError("no_total_hours");
      totalHoursRef.current?.focus();
      return;
    } else if (!airplane.remainder_motor_hours) {
      setError("no_remainder_motor_hours");
      remainderMotorHoursRef.current?.focus();
      return;
    } else if (!airplane.remainder_propeller_hours) {
      setError("no_remainder_propeller_hours");
      remainderPropellerHoursRef.current?.focus();
      return;
    } else if (!airplane.engine_model) {
      setError("no_engine_model");
      engineModelRef.current?.focus();
      return;
    } else if (!airplane.manufacture_year) {
      setError("no_manufacture_year");
      manufactureYearRef.current?.focus();
      return;
    } else if (!airplane.description) {
      setError("no_description");
      descriptionRef.current?.focus();
      return;
    } else if (airplane.images.length === 0) {
      setError("no_images");
      return;
    }

    try {
      setLoadingEditing(true);
      const formData = new FormData();
      const { images, ...airplaneWithoutImages } = airplane;
      const newImages = images.filter((image) => typeof image === "string");
      const oldImages = images.filter((image) => typeof image !== "string");

      formData.append("airplane", JSON.stringify(airplaneWithoutImages));
      formData.append("oldImages", JSON.stringify(oldImages));
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      for (let i = 0; i < newImages.length; i++) {
        formData.append(`image${i}`, {
          uri: newImages[i],
          type: "image/jpeg",
          name: `airplane-${airplane.model}-image${i}.jpg`,
        } as any);
      }

      const response = await fetch(`${apiUrl}/edit-buy-plane`, {
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        setShowAlert({ message: "Se ha modificado la aeronave" });
        resetAll();
        setSelectedTab("aeroventas-manage-airplanes");
        setLoadingEditing(false);
      } else if (response.status === 404) {
        setShowAlert({
          message:
            "Hubo un error al subir las imágenes. Por favor, intenta de nuevo mas tarde",
        });
        setLoadingEditing(false);
      } else {
        setShowAlert({
          message:
            "Hubo un error al modificar la aeronave. Por favor, intenta de nuevo",
        });
        resetAll();
        setLoadingEditing(false);
      }
    } catch (error) {
      setShowAlert({
        message:
          "Hubo un error al modificar la aeronave. Por favor, intenta de nuevo",
      });
      resetAll();
      setLoadingEditing(false);
    }
  };

  if (loadingPlane) {
    return <LoadingSpinner fullScreen={true} size='large' />;
  }

  return (
    <ScrollView>
      <ThemedView style={styles.input_container}>
        <ThemedText style={styles.label}>Modelo</ThemedText>
        <TextInput
          style={[styles.input, error === "no_model" && styles.input_error]}
          value={airplane.model}
          onChange={(e) => handleChange("model", e.nativeEvent.text)}
          placeholder='Ej. Cessna 172'
          onSubmitEditing={() => categoryRef.current?.focus()}
          ref={modelRef}
        ></TextInput>
        {error === "no_model" && (
          <ThemedText style={styles.error_text}>
            Debe completar este campo
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.input_container}>
        <ThemedText style={styles.label}>Categoría</ThemedText>

        <ThemedView
          style={[styles.select, error === "no_category" && styles.input_error]}
        >
          <Picker
            selectedValue={airplane.category}
            onValueChange={(value) => {
              handleChange("category", value);
              if (value !== "all" && airplane.brand === "all") {
                brandRef.current?.focus();
              }
            }}
            dropdownIconColor='#2B63AA'
            mode='dropdown'
            ref={categoryRef}
          >
            <Picker.Item label='Selecciona una categoría' value='all' />
            <Picker.Item label='Agrícola' value='agricultural' />
            <Picker.Item label='Bimotor' value='bimotor' />
            <Picker.Item label='Experimental' value='experimental' />
            <Picker.Item label='Helicóptero' value='helicopter' />
            <Picker.Item label='Jets' value='jets' />
            <Picker.Item label='Monomotor' value='monomotor' />
            <Picker.Item label='Planeador' value='planeador' />
          </Picker>
        </ThemedView>
        {error === "no_category" && (
          <ThemedText style={styles.error_text}>
            Debe completar este campo
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.input_container}>
        <ThemedText style={styles.label}>Marca</ThemedText>
        <ThemedView
          style={[styles.select, error === "no_brand" && styles.input_error]}
        >
          <Picker
            selectedValue={airplane.brand}
            onValueChange={(value) => {
              handleChange("brand", value);
              if (value !== "all") {
                priceRef.current?.focus();
              }
            }}
            dropdownIconColor='#2B63AA'
            mode='dropdown'
            ref={brandRef}
          >
            <Picker.Item label='Selecciona una marca' value='all' />
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

        {error === "no_brand" && (
          <ThemedText style={styles.error_text}>
            Debe completar este campo
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.double_input_container}>
        <ThemedView style={styles.input_container}>
          <ThemedText style={styles.label}>Precio</ThemedText>
          <TextInput
            style={[styles.input, error === "no_price" && styles.input_error]}
            value={"$" + airplane.price?.toString()}
            onChange={(e) =>
              handleChange("price", parseInt(e.nativeEvent.text.slice(1)))
            }
            placeholder='0.00'
            keyboardType='numeric'
            onSubmitEditing={() => totalHoursRef.current?.focus()}
            ref={priceRef}
          ></TextInput>
          {error === "no_price" && (
            <ThemedText style={styles.error_text}>
              Debe completar este campo
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.input_container}>
          <ThemedText style={styles.label}>
            Horas totales de fuselage
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              error === "no_total_hours" && styles.input_error,
            ]}
            value={airplane.total_hours?.toString()}
            onChange={(e) =>
              handleChange("total_hours", parseInt(e.nativeEvent.text))
            }
            placeholder='0.00'
            keyboardType='numeric'
            onSubmitEditing={() => remainderMotorHoursRef.current?.focus()}
            ref={totalHoursRef}
          ></TextInput>
          {error === "no_total_hours" && (
            <ThemedText style={styles.error_text}>
              Debe completar este campo
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.double_input_container}>
        <ThemedView style={styles.input_container}>
          <ThemedText style={styles.label}>
            Horas remanentes de motor
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              error === "no_remainder_motor_hours" && styles.input_error,
            ]}
            value={airplane.remainder_motor_hours?.toString()}
            onChange={(e) =>
              handleChange(
                "remainder_motor_hours",
                parseInt(e.nativeEvent.text)
              )
            }
            placeholder='0.00'
            keyboardType='numeric'
            onSubmitEditing={() => remainderPropellerHoursRef.current?.focus()}
            ref={remainderMotorHoursRef}
          ></TextInput>
          {error === "no_remainder_motor_hours" && (
            <ThemedText style={styles.error_text}>
              Debe completar este campo
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.input_container}>
          <ThemedText style={styles.label}>
            Horas remanentes de helice
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              error === "no_remainder_propeller_hours" && styles.input_error,
            ]}
            value={airplane.remainder_propeller_hours?.toString()}
            onChange={(e) =>
              handleChange(
                "remainder_propeller_hours",
                parseInt(e.nativeEvent.text)
              )
            }
            placeholder='0.00'
            keyboardType='numeric'
            onSubmitEditing={() => engineModelRef.current?.focus()}
            ref={remainderPropellerHoursRef}
          ></TextInput>
          {error === "no_remainder_propeller_hours" && (
            <ThemedText style={styles.error_text}>
              Debe completar este campo
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.input_container}>
        <ThemedText style={styles.label}>Modelo de motor</ThemedText>
        <TextInput
          style={[
            styles.input,
            error === "no_engine_model" && styles.input_error,
          ]}
          value={airplane.engine_model}
          onChange={(e) => handleChange("engine_model", e.nativeEvent.text)}
          placeholder='Ej. Lycoming IO-360-L2A'
          onSubmitEditing={() => manufactureYearRef.current?.focus()}
          ref={engineModelRef}
        ></TextInput>
        {error === "no_engine_model" && (
          <ThemedText style={styles.error_text}>
            Debe completar este campo
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.input_container}>
        <ThemedText style={styles.label}>Año de fabricación</ThemedText>
        <TextInput
          style={[
            styles.input,
            error === "no_manufacture_year" && styles.input_error,
          ]}
          value={airplane.manufacture_year.toString()}
          onChange={(e) =>
            handleChange("manufacture_year", parseInt(e.nativeEvent.text))
          }
          placeholder='2022'
          keyboardType='numeric'
          maxLength={4}
          onSubmitEditing={() => documentationStatusRef.current?.focus()}
          ref={manufactureYearRef}
        ></TextInput>
        {error === "no_manufacture_year" && (
          <ThemedText style={styles.error_text}>
            Debe completar este campo
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.input_container}>
        <ThemedText style={styles.label}>Estado de la documentación</ThemedText>
        <ThemedView style={styles.select}>
          <Picker
            selectedValue={airplane.documentation_status}
            onValueChange={(value) => {
              handleChange("documentation_status", value);
              descriptionRef.current?.focus();
            }}
            dropdownIconColor='#2B63AA'
            mode='dropdown'
            ref={documentationStatusRef}
          >
            <Picker.Item label='En Revision' value='under_revision' />
            <Picker.Item
              label='Listo para transferir'
              value='ready_to_transfer'
            />
            <Picker.Item label='Listo para volar' value='ready_to_fly' />
          </Picker>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.input_container}>
        <ThemedText style={styles.label}>Estado de la publicación</ThemedText>
        <ThemedView style={styles.select}>
          <Picker
            selectedValue={airplane.status}
            onValueChange={(value) => {
              handleChange("status", value);
              descriptionRef.current?.focus();
            }}
            dropdownIconColor='#2B63AA'
            mode='dropdown'
            ref={documentationStatusRef}
          >
            <Picker.Item label='Activo' value='active' />
            <Picker.Item label='Vendido' value='sold' />
            <Picker.Item label='Eliminado' value='deleted' />
            <Picker.Item label='En negociación' value='negotiation' />
          </Picker>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.input_container}>
        <ThemedText style={styles.label}>Descripción</ThemedText>
        <TextInput
          style={[
            styles.input,
            error === "no_description" && styles.input_error,
            { textAlignVertical: "top" },
          ]}
          value={airplane.description}
          onChange={(e) => handleChange("description", e.nativeEvent.text)}
          placeholder='Ej. El Cessna 172 es un avión monomotor conocido por su fiabilidad y versatilidad. Fabricado en 2010, tiene 3500 horas de vuelo y está listo para transferir.'
          multiline
          numberOfLines={5}
          ref={descriptionRef}
        ></TextInput>
        {error === "no_description" && (
          <ThemedText style={styles.error_text}>
            Debe completar este campo
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.images_container}>
        <ThemedText style={styles.label}>
          Carga las fotos de tu aeronave
        </ThemedText>
        {airplaneImagesUri.map((uri, index) => (
          <ThemedView
            key={index}
            style={styles.airplane_image_button_container}
          >
            {uri === "" && (
              <ThemedView style={styles.image_button_container}>
                <TouchableOpacity
                  onPress={() => pickImage(index)}
                  style={styles.image_button}
                >
                  <Ionicons name='images-outline' size={18} color='white' />
                  <ThemedText style={styles.button_text}>
                    Cargar imagen
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => takePhoto(index)}
                  style={styles.image_button}
                >
                  <Ionicons name='camera-outline' size={20} color='white' />
                  <ThemedText style={styles.button_text}>
                    Tomar una Foto
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            )}

            {uri !== "" ? (
              <ThemedView
                style={{
                  backgroundColor: "transparent",
                  height: 220,
                  width: "100%",
                  flexDirection: "row",
                  position: "relative",
                  marginVertical: 10,
                }}
              >
                <ThemedText style={styles.image_number}>{index + 1}</ThemedText>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  onPress={() => {
                    deleteAirplaneImage(index);
                  }}
                  style={styles.delete_image_button}
                >
                  <Ionicons name='close-outline' size={20} color='white' />
                </TouchableOpacity>
              </ThemedView>
            ) : uri === "" && !airplane.images[0] ? (
              <ThemedText style={styles.no_image_text}>
                Carga una imagen para ver la previsualización
              </ThemedText>
            ) : null}
          </ThemedView>
        ))}
        {error === "no_images" && (
          <ThemedText style={styles.error_text}>
            Debe cargar al menos una imagen
          </ThemedText>
        )}
      </ThemedView>

      {loadingEditing ? (
        <LoadingSpinner
          size='small'
          style={[styles.button, { padding: 13 }]}
          color='white'
        />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleSubmit();
          }}
        >
          <ThemedText style={styles.submit_button_text}>
            Guardar avión
          </ThemedText>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  double_input_container: {
    flexDirection: "row",
    gap: 15,
    flex: 1,
    marginBottom: 8,
  },
  input_container: {
    flexDirection: "column",
    backgroundColor: "transparent",
    gap: 8,
    flex: 1,
    marginBottom: 20,
    position: "relative",
  },
  error_text: {
    color: "#DA373A",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    position: "absolute",
    bottom: -20,
  },
  label: {
    color: "#2B63AA",
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    borderRadius: 3,
    borderBottomColor: "#2B63AA",
    borderBottomWidth: 2,
    color: "black",
    padding: 8,
    fontSize: 16,
  },
  select: {
    flex: 1,
    borderRadius: 3,
    borderBottomColor: "#2B63AA",
    borderBottomWidth: 2,
  },
  input_error: {
    borderColor: "#DA373A",
  },
  images_container: {
    backgroundColor: "transparent",
  },
  image_button_container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
    backgroundColor: "transparent",
  },
  image_button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#2B63AA",
    padding: 6,
    borderRadius: 3,
    flex: 1,
  },
  airplane_image_button_container: {
    width: "100%",
    backgroundColor: "transparent",
  },
  button_text: {
    color: "white",
  },
  image: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
    borderRadius: 5,
    backgroundColor: "white",
  },
  image_number: {
    position: "absolute",
    top: 0,
    left: 0,
    color: "black",
    fontWeight: "600",
    fontSize: 14,
    backgroundColor: "white",
    zIndex: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomRightRadius: 3,
  },
  delete_image_button: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  no_image_text: {
    color: "gray",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "gray",
    height: 220,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#2B63AA",
    padding: 10,
    borderRadius: 5,
    width: "80%",
    marginVertical: 40,
    alignSelf: "center",
    alignItems: "center",
  },
  submit_button_text: {
    color: "white",
    fontWeight: "600",
  },
});
