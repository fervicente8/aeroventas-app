import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import DocumentComponent from "./DocumentComponent";

interface Document {
  _id: string;
  type: string;
  files_url: [string];
  created_at: Date;
  status: string;
}

interface Props {
  userId: string;
  apiUrl: string | undefined;
  setShowAlert: (value: any) => void;
}

export default function ManageUserDocuments({
  userId,
  apiUrl,
  setShowAlert,
}: Props) {
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
  const [acceptedDocuments, setAcceptedDocuments] = useState<Document[]>([]);
  const [rejectedDocuments, setRejectedDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const getUserDocuments = async () => {
      setLoadingDocuments(true);
      try {
        const response = await fetch(`${apiUrl}/get-user-by-id/${userId}`);
        const data = await response.json();

        setDocuments(data.documents);
        setLoadingDocuments(false);
      } catch (error) {
        setShowAlert({
          message: "Error al obtener los documentos del usuario",
        });
        setLoadingDocuments(false);
      }
    };

    getUserDocuments();
  }, []);

  const setDocumentsByStatus = () => {
    if (documents.length < 0) return;
    setAcceptedDocuments(
      documents.filter((document) => document.status === "accepted")
    );
    setRejectedDocuments(
      documents.filter((document) => document.status === "rejected")
    );
    setPendingDocuments(
      documents.filter((document) => document.status === "pending")
    );
  };

  useEffect(() => {
    setDocumentsByStatus();
  }, [documents]);

  if (loadingDocuments) {
    return (
      <LoadingSpinner fullScreen text='Cargando documentos' size='large' />
    );
  } else if (documents.length > 0) {
    return (
      <ScrollView>
        <ThemedView style={styles.container}>
          <ThemedView style={styles.documents_container}>
            <ThemedText style={styles.documents_title}>
              Documentos pendientes
            </ThemedText>
            {pendingDocuments.length === 0 ? (
              <ThemedText style={styles.no_documents_type_text}>
                No hay documentos pendientes
              </ThemedText>
            ) : null}
            {pendingDocuments.map((document, index) => (
              <DocumentComponent
                key={index}
                userId={userId}
                apiUrl={apiUrl}
                document={document}
                setDocuments={setDocuments}
                setShowAlert={setShowAlert}
              />
            ))}
          </ThemedView>

          <ThemedView style={styles.documents_container}>
            <ThemedText style={styles.documents_title}>
              Documentos aprobados
            </ThemedText>
            {acceptedDocuments.length === 0 ? (
              <ThemedText style={styles.no_documents_type_text}>
                No hay documentos aprobados
              </ThemedText>
            ) : null}
            {acceptedDocuments.map((document, index) => (
              <DocumentComponent
                key={index}
                userId={userId}
                apiUrl={apiUrl}
                document={document}
                setDocuments={setDocuments}
                setShowAlert={setShowAlert}
              />
            ))}
          </ThemedView>

          <ThemedView style={styles.documents_container}>
            <ThemedText style={styles.documents_title}>
              Documentos rechazados
            </ThemedText>
            {rejectedDocuments.length === 0 ? (
              <ThemedText style={styles.no_documents_type_text}>
                No hay documentos rechazados
              </ThemedText>
            ) : null}
            {rejectedDocuments.map((document, index) => (
              <DocumentComponent
                key={index}
                userId={userId}
                apiUrl={apiUrl}
                document={document}
                setDocuments={setDocuments}
                setShowAlert={setShowAlert}
              />
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    );
  } else {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.no_documents_text}>
          No hay documentos
        </ThemedText>
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  no_documents_text: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    color: "#2B63AA",
  },
  documents_container: {
    flex: 1,
    marginBottom: 25,
  },
  documents_title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2B63AA",
    textAlign: "center",
    marginBottom: 25,
  },
  no_documents_type_text: {
    textAlign: "center",
    fontSize: 16,
    color: "#333333",
  },
});
