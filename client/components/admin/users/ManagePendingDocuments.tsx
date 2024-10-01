import LoadingSpinner from "@/components/loading/LoadingSpinner";
import { useEffect, useState } from "react";
import DocumentComponent from "./DocumentComponent";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

interface Document {
  _id: string;
  type: string;
  files_url: [string];
  created_at: Date;
  status: string;
}

interface DocumentsArray {
  _id: string;
  document: Document;
}

interface Props {
  apiUrl: string | undefined;
  setShowAlert: (value: any) => void;
}

export default function ManagePendingDocuments({
  apiUrl,
  setShowAlert,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [pendingDocuments, setPendingDocuments] = useState<DocumentsArray[]>(
    []
  );

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/get-pending-documents`);
      const data = await response.json();
      setPendingDocuments(data);
      setLoading(false);
    } catch (error) {
      setShowAlert({
        message: "Error al obtener los documentos pendientes",
      });
    }
  };

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  if (loading) {
    <LoadingSpinner fullScreen text='Cargando documentos' />;
  }

  return (
    <ThemedView>
      {pendingDocuments.length > 0 ? (
        pendingDocuments.map((el, index) => (
          <DocumentComponent
            key={index}
            userId={el._id}
            document={el.document}
            apiUrl={apiUrl}
            setDocuments={setPendingDocuments}
            setShowAlert={setShowAlert}
            faster
            documents={pendingDocuments}
          />
        ))
      ) : (
        <ThemedText
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: "600",
            color: "#2B63AA",
          }}
        >
          ¡Estás al día! No hay documentos pendientes.
        </ThemedText>
      )}
    </ThemedView>
  );
}
