import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View, TextInput, ScrollView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DashboardWidget from "../components/dashboardWidget";
import ExpiringWidget from "../components/ExpiringSoonWidget";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Modal } from "react-native";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [password, setPassword] = useState("");
  const API_URL = "http://localhost:3001";
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) setUsername(savedUsername);
    };
    loadUser();
  }, []);
  const dummyItems = [
    "chicken",
    "beef",
    "yogurt",
    "milk",
    "eggs",
    "broccoli",
    "apples",
    "mango",
    "cake",
    "cream",
    "protein shake",
    "mayo",
    "bread",
  ];
  const dummyExpiring = [
    { id: 1, name: "chicken", expiryDate: "2026-04-05" },
    { id: 2, name: "milk", expiryDate: "2026-04-06" },
    { id: 3, name: "eggs", expiryDate: "2026-04-20" },
  ];

  const navigation = useNavigation();

  async function register() {
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) return;
      await AsyncStorage.setItem("username", username);
      setIsRegistering(false);
      setPassword("");
    } catch (error) {
      console.log("Failed to register", error);
    }
  }

  async function login() {
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formUsername,
          password: formPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) return;
      await AsyncStorage.setItem("username", data.username);
      setIsRegistering(false);
      setPassword("");
      setUsername(data.username);
    } catch (error) {
      console.log("Failed to login", error);
    }
  }

  async function logout() {
    await AsyncStorage.removeItem("username");
    setUsername("");
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#F8F5EC" }}
      >
        <SafeAreaView style={styles.container}>
          <Text style={styles.h2}>Good Day {username}</Text>
          <Text style={styles.h1}>Your Kitchen</Text>
          {username ? (
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => setIsRegistering(true)}
            >
              <Text style={styles.registerBtnText}>Register / Login</Text>
            </TouchableOpacity>
          )}

          <View style={styles.mainContent}>
            {/* search bar */}
            <View style={styles.searchBar}>
              <Feather name="search" size={18} color="#697665" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search items..."
                placeholderTextColor="#697665"
              />
            </View>

            <View style={styles.dashWidgetContainer}>
              <DashboardWidget
                count={dummyItems.length}
                title="Items Tracked"
              />
              <DashboardWidget
                count={dummyExpiring.length}
                title="Expiring Soon"
              />
            </View>

            <View style={{ marginTop: 50 }}>
              {dummyExpiring.length > 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingRight: 2,
                      marginBottom: 50,
                    }}
                  >
                    <Text style={styles.h3}>Needs Attention</Text>
                    <Text
                      style={{
                        color: "#50863F",
                        textDecorationLine: "underline",
                      }}
                      onPress={() => dummyExpiring}
                    >
                      See All
                    </Text>
                  </View>
                  <View>
                    {dummyExpiring.map((item) => {
                      const today = new Date();
                      const expiry = new Date(item.expiryDate);

                      const diffTime = expiry - today;
                      const daysLeft = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24),
                      ); // convert ms to days
                      const getExpiryColor = (daysLeft) => {
                        if (daysLeft <= 2) return "#ff1717"; // red - expires in a couple days
                        if (daysLeft <= 6) return "#ff7723"; // orange - very soon
                        return "#50863F"; // green - plenty of time
                      };
                      return (
                        <ExpiringWidget
                          key={item.id}
                          image={require("../assets/foodplaceholders/mschicken.png")}
                          name={item.name}
                          expireMessage={`This item is expiring in ${daysLeft} days!`}
                          expiringIn={`${daysLeft} days`}
                          dateStyling={{
                            backgroundColor: getExpiryColor(daysLeft),
                            justifyContent: "center",
                            paddingLeft: 10,
                            paddingRight: 10,
                            height: 33,
                            marginTop: 5,
                            borderRadius: 10,
                          }}
                        />
                      );
                    })}
                  </View>
                </>
              ) : dummyItems.length > 0 && dummyExpiring.length <= 0 ? (
                <View>
                  <Text>What how is this possible?</Text>
                </View>
              ) : (
                <View>
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      fontSize: RFValue(20),
                      fontFamily: "Inter_600SemiBold",
                    }}
                    onPress={() => navigation.navigate("AddItemsPage")}
                  >
                    Add items to get started!
                  </Text>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <Modal
        visible={isRegistering}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setIsRegistering(false)} // Android back button
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={register}>
              <Text style={styles.primaryBtnText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsRegistering(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Log in</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#666"
              value={formUsername}
              onChangeText={setFormUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={formPassword}
              onChangeText={setFormPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={login}>
              <Text style={styles.primaryBtnText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsRegistering(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EC",
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
  },
  mainContent: {
    paddingLeft: 9,
    maxWidth: "97%",
  },
  h2: {
    fontSize: RFValue(14),
    color: "#707070",
    fontFamily: "Inter_500Medium",
    marginBottom: 20,
  },
  h1: {
    fontSize: RFValue(24),
    fontFamily: "Inter_600SemiBold",
  },
  h3: {
    fontSize: RFValue(20),
    fontFamily: "Inter_600SemiBold",
  },
  dashWidgetContainer: {
    marginTop: 50,
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
    shadowColor: "#000",
    shadowOffset: { width: -5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // Android
    elevation: 4,
  },
  searchBar: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7E9E7450",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingTop: 1,
    fontSize: RFValue(12),
    color: "#000",
  },
  registerBtn: {
    backgroundColor: "#4ade80",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  registerBtnText: {
    color: "#0f1117",
    fontWeight: "700",
    fontSize: 13,
  },
  input: {
    backgroundColor: "#0f1117",
    borderWidth: 1,
    borderColor: "#2a2d3a",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#ffffff",
    marginBottom: 12,
    fontSize: 15,
  },
  card: {
    margin: 16,
    backgroundColor: "#1a1d27",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2a2d3a",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: "#4ade80",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryBtnText: {
    color: "#0f1117",
    fontWeight: "700",
    fontSize: 15,
  },

  cancelText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
  },
  logoutText: {
    color: "#ff4444",
    fontWeight: "600",
    fontSize: 13,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8F5EC",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  logoutBtn: {
    backgroundColor: "#2a1a1a",
    borderWidth: 1,
    borderColor: "#ff4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
