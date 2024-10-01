import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import DocumentComponent from "./DocumentComponent";
import LoadingSpinner from "../loading/LoadingSpinner";

import { ThemedText } from "../ThemedText";

interface Document {
  type: string;
  files_url: [string];
  created_at: Date;
  status: string;
}

interface Props {
  user: {
    _id: string;
    name: string;
    last_name: string;
    email: string;
    profile_picture?: {
      public_id: string;
      secure_url: string;
    };
    flight_hours?: number;
    buyed_planes: [object];
    rented_planes: [object];
    reviews_given: [object];
    reviews_received: [object];
    documents: [Document];
    created_at: Date;
  };
  setUser: (value: any) => void;
  setShowAlert: (value: any) => void;
}

export default function ProfileDocuments({
  user,
  setUser,
  setShowAlert,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState("no");

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/get-user-documents/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const updatedDocuments = await response.json();

      setUser({ ...user, documents: updatedDocuments });
      setLoading(false);
    } catch (error) {
      setShowAlert({
        message: "Error al obtener los documentos del usuario",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const findDocumentByType = (type: string) => {
    return user.documents.find((document) => document.type === type);
  };

  const updateUser = (value: any) => {
    setUser(value);
  };

  const onRefresh = useCallback(() => {
    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner
        fullScreen={true}
        size='large'
        text='Cargando documentos'
      />
    );
  } else {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <ThemedText style={styles.title}>Documentos</ThemedText>

        <DocumentComponent
          document={findDocumentByType("dni")}
          type='dni'
          isAdding={isAdding}
          setUser={updateUser}
          setIsAdding={setIsAdding}
          setShowAlert={setShowAlert}
        />
        <DocumentComponent
          document={findDocumentByType("license")}
          type='license'
          isAdding={isAdding}
          setUser={updateUser}
          setIsAdding={setIsAdding}
          setShowAlert={setShowAlert}
        />
        <DocumentComponent
          document={findDocumentByType("cma")}
          type='cma'
          isAdding={isAdding}
          setUser={updateUser}
          setIsAdding={setIsAdding}
          setShowAlert={setShowAlert}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 18,
    marginVertical: 20,
    textAlign: "center",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    color: "gray",
  },
});
