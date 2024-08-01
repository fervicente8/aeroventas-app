import { ScrollView, StyleSheet } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

interface Document {
  type: string;
  document_id: string;
  expiration_date: Date;
  file_url: string;
  created_at: Date;
  status: string;
}

interface Props {
  documents: [Document | object];
}

export default function ProfileDocuments({ documents }: Props) {
  return (
    <ScrollView style={styles.container}>
      <ThemedText>Documentos</ThemedText>
      <ThemedView>
        <ThemedText>Documento Nacional de Identidad (DNI)</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
