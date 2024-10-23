import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ManageUserById from "./ManageUserById";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

interface User {
  _id: string;
  name: string;
  last_name: string;
  email: string;
  profile_picture: {
    public_id: string;
    secure_url: string;
  };
  flight_hours: number;
  buyed_planes: any;
  rented_planes: any;
  reviews_given: any;
  reviews_received: any;
  documents: any;
  created_at: Date;
  type: string;
  status: string;
}

interface Props {
  apiUrl: string | undefined;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  setShowAlert: (value: any) => void;
}

export default function UsersList({
  apiUrl,
  selectedTab,
  setSelectedTab,
  setShowAlert,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [userToManage, setUserToManage] = useState<User | null>(null);
  const [searcher, setSearcher] = useState("");

  useEffect(() => {
    const searchUsers = async () => {
      setLoading(true);
      const response = await fetch(`${apiUrl}/search-user-by-term`, {
        method: "PUT",
        body: JSON.stringify({
          search: searcher,
          currentLength: (currentPage - 1) * 15,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setCurrentUsers(data.users);
      setTotalPages(data.totalPages);

      setLoading(false);
    };
    searchUsers();
  }, [searcher || currentPage]);

  useEffect(() => {
    const getNumberOfPages = async () => {
      setLoading(true);
      const response = await fetch(`${apiUrl}/search-user-by-term`, {
        method: "PUT",
        body: JSON.stringify({
          search: searcher,
          currentLength: (currentPage - 1) * 15,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setTotalPages(data.totalPages);

      setLoading(false);
    };

    getNumberOfPages();
  }, [userToManage]);

  const uppercaseFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  if (selectedTab === "users-list") {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.searcher_container}>
          <TextInput
            style={styles.searcher}
            placeholder='Buscar...'
            value={searcher}
            onChangeText={(text) => setSearcher(text)}
          />
          <MaterialCommunityIcons name='magnify' size={24} color='#2B63AA' />
        </ThemedView>
        {loading ? (
          <LoadingSpinner
            fullScreen={true}
            size='large'
            text='Cargando lista de usuarios'
          />
        ) : currentUsers.length > 0 ? (
          <ScrollView>
            {currentUsers.map((user) => (
              <ThemedView key={user._id} style={styles.card_container}>
                <ThemedView style={styles.row_container}>
                  <Image
                    source={
                      user.profile_picture?.secure_url
                        ? { uri: user.profile_picture.secure_url }
                        : require("@/assets/images/default_profile_picture.png")
                    }
                    style={{
                      width: 80,
                      height: 80,
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                    }}
                  />
                  <ThemedView
                    style={{ backgroundColor: "transparent", maxWidth: "85%" }}
                  >
                    <ThemedText
                      style={styles.text_title}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {uppercaseFirstLetter(user.name)}{" "}
                      {uppercaseFirstLetter(user.last_name)}
                    </ThemedText>
                    <ThemedText
                      style={styles.text_subtitle}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {user.email}
                    </ThemedText>
                    <ThemedText
                      style={styles.text_subtitle}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {uppercaseFirstLetter(user.type)}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.buttons_container}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setUserToManage(user);
                      setSelectedTab("users-list-manage-user");
                    }}
                  >
                    <MaterialCommunityIcons
                      name='cog'
                      size={24}
                      color='#2B63AA'
                    />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            ))}

            <ThemedView>
              <ThemedView
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  marginTop: 10,
                }}
              >
                {currentPage > 1 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentPage(currentPage - 1);
                    }}
                  >
                    <MaterialCommunityIcons
                      name='chevron-left'
                      size={30}
                      color='#2B63AA'
                    />
                  </TouchableOpacity>
                ) : (
                  <MaterialCommunityIcons
                    name='chevron-left'
                    size={30}
                    color='#EBEBE4'
                  />
                )}

                <ThemedText
                  style={{
                    color: "#2B63AA",
                    fontWeight: "bold",
                  }}
                >
                  Página {currentPage} de {totalPages}
                </ThemedText>

                {currentPage < totalPages ? (
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentPage(currentPage + 1);
                    }}
                  >
                    <MaterialCommunityIcons
                      name='chevron-right'
                      size={30}
                      color='#2B63AA'
                    />
                  </TouchableOpacity>
                ) : (
                  <MaterialCommunityIcons
                    name='chevron-right'
                    size={30}
                    color='#EBEBE4'
                  />
                )}
              </ThemedView>
            </ThemedView>
          </ScrollView>
        ) : (
          <ThemedText style={styles.not_users_text}>
            No se encontraron resultados
          </ThemedText>
        )}
      </ThemedView>
    );
  } else if (
    selectedTab === "users-list-manage-user" ||
    selectedTab === "users-list-manage-user-documents"
  ) {
    return (
      <ManageUserById
        apiUrl={apiUrl}
        user={userToManage}
        setUser={setUserToManage}
        currentUsersInList={currentUsers}
        setCurrentUsersinList={setCurrentUsers}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        setShowAlert={setShowAlert}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searcher_container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderRadius: 10,
    borderColor: "#333333",
    borderWidth: 1,
    marginTop: -10,
    marginBottom: 20,
  },
  searcher: {
    backgroundColor: "transparent",
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  card_container: {
    maxHeight: 102,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "transparent",
    borderColor: "#2B63AA",
    borderWidth: 1,
    marginBottom: 10,
  },
  row_container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: "55%",
  },
  text_title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#2B63AA",
    overflow: "hidden",
  },
  text_subtitle: {
    fontSize: 14,
    color: "black",
  },
  buttons_container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  button: {
    backgroundColor: "#2B63AA20",
    padding: 15,
    height: "100%",
    justifyContent: "center",
  },
  not_users_text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#2B63AA",
  },
});
