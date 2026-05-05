import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DashboardWidget from "../components/dashboardWidget";
import ExpiringWidget from "../components/ExpiringSoonWidget";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";
import InvDropdown from "../components/InvDropdown";

export default function Home() {
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [password, setPassword] = useState("");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");

  const [viewingInv, setViewingInv] = useState(false);

  const [AllIngredients, setAllIngredients] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function init() {
        const savedUsername = await AsyncStorage.getItem("username");
        if (!savedUsername) return;
        setUsername(savedUsername);

        const response = await fetch(`${API_URL}/api/getIngredients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: savedUsername }),
        });
        const data = await response.json();
        if (response.ok) setAllIngredients(data);
      }
      init();
    }, []),
  );

  // for the inventory dropdown
  const [category, setCategory] = useState("All items");
  const dropCategories = ["All items", "Expiry date"];
  const foodCategories = [
    "meat",
    "dairy",
    "fruit",
    "vegetable",
    "beverage",
    "bakery",
    "frozen",
    "pantry",
    "snack",
    "prepared food",
    "seafood",
  ];
  const sortedItems = [...AllIngredients].sort(
    (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
  );

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

      const ingredientsResponse = await fetch(`${API_URL}/api/getIngredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.username }),
      });
      const ingredientsData = await ingredientsResponse.json();
      if (ingredientsResponse.ok) setAllIngredients(ingredientsData);
    } catch (error) {
      console.log("Failed to login", error);
    }
  }

  async function logout() {
    await AsyncStorage.removeItem("username");
    setUsername("");
    setAllIngredients([]);
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#F8F5EC" }}
      >
        <SafeAreaView style={styles.container}>
          {username ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.h2}>Good Day {username}</Text>
              <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.h2}>Good Day {username}</Text>
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => setIsRegistering(true)}
              >
                <Text style={styles.registerBtnText}>Login</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.h1}>Your Kitchen</Text>

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
              <TouchableOpacity onPress={() => setViewingInv(true)}>
                <DashboardWidget
                  count={AllIngredients.length}
                  title="Items Tracked"
                />
              </TouchableOpacity>
              <DashboardWidget
                count={AllIngredients.length}
                title="Expiring Soon"
              />
            </View>

            <View style={{ marginTop: 50 }}>
              {AllIngredients.length > 0 ? (
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
                      onPress={() => AllIngredients}
                    >
                      See All
                    </Text>
                  </View>
                  <View>
                    {AllIngredients.map((item) => {
                      const today = new Date();
                      const expiry = new Date(item.ExpiryDate);

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
                          key={item._id}
                          image={require("../assets/foodplaceholders/mschicken.png")}
                          name={item.IngredientName}
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
              ) : AllIngredients.length > 0 && AllIngredients.length <= 0 ? (
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

      {/* login/register modal */}

      <Modal
        visible={isRegistering}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setIsRegistering(false)} // Android back button
      >
        {/* insets stop the modal going to the top when first running 
        the app for some reason safearea view doesn't work properly with modals */}
        <View style={[styles.modalContainer, { paddingTop: insets.top + 15 }]}>
          {/* this moves the input field above the keyboard */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView>
              <TouchableOpacity
                onPress={() => setIsRegistering(false)}
                style={{ alignSelf: "flex-end" }}
              >
                <Text style={{ fontSize: 24, marginRight: 20 }}>✕</Text>
              </TouchableOpacity>
              <View style={{ marginTop: 50 }}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Register</Text>
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
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={register}
                  >
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
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* full inventory modal */}
      <Modal
        visible={viewingInv}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setViewingInv(false)} // Android back button
      >
        <View
          style={[
            styles.modalContainer,
            { paddingTop: insets.top + 25, paddingLeft: 25 },
          ]}
        >
          <ScrollView>
            <TouchableOpacity
              onPress={() => setViewingInv(false)}
              style={{
                backgroundColor: "#50863F",
                padding: 10,
                width: "20%",
                borderRadius: 20,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "Inter_600SemiBold",
                  fontSize: RFValue(14),
                }}
              >
                Close
              </Text>
            </TouchableOpacity>

            <Text style={[styles.h1, { marginBottom: 5 }]}>Full Inventory</Text>
            {/* this will change depending on the filter chosen */}
            <Text style={styles.h2}>All items in your kitchen</Text>

            {/* dropdown */}
            <InvDropdown
              options={dropCategories}
              onSelect={(value) => setCategory(value)}
            />
            {/* this next bit will need to be change to use conditional rendering once we have data setup and dropdown added */}
            <View>
              {category === "All items" ? (
                foodCategories.map((item) => {
                  const itemsInCategory = AllIngredients.filter(
                    (i) => i.FoodGroup === item,
                  );
                  if (itemsInCategory.length === 0) return null; // skip empty categories

                  return (
                    <View key={item}>
                      <Text style={[styles.h4, { marginBottom: 20 }]}>
                        {item}
                      </Text>
                      {itemsInCategory.map((item) => {
                        const today = new Date();
                        const expiry = new Date(item.ExpiryDate);

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
                            name={item.IngredientName}
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
                  );
                })
              ) : category === "Expiry date" ? (
                sortedItems.map((item) => {
                  const today = new Date();
                  const expiry = new Date(item.ExpiryDate);

                  const diffTime = expiry - today;
                  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  return (
                    <ExpiringWidget
                      key={item._id}
                      image={require("../assets/foodplaceholders/mschicken.png")}
                      name={item.IngredientName}
                      expireMessage={`This item is expiring in ${daysLeft} days!`}
                      expiringIn={`${daysLeft} days`}
                      dateStyling={{
                        backgroundColor:
                          daysLeft <= 2
                            ? "#ff1717"
                            : daysLeft <= 6
                              ? "#ff7723"
                              : "#50863F",
                        justifyContent: "center",
                        paddingLeft: 10,
                        paddingRight: 10,
                        height: 33,
                        marginTop: 5,
                        borderRadius: 10,
                      }}
                    />
                  );
                })
              ) : (
                <Text>Please add items to get started</Text>
              )}
            </View>
          </ScrollView>
        </View>
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
  h4: {
    fontSize: RFValue(18),
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
    backgroundColor: "#50863F",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    // width: "40%"
    marginRight: 10,
  },

  registerBtnText: {
    color: "#F8F5EC",
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(14),
  },
  input: {
    backgroundColor: "#F8F5EC",
    borderWidth: 1,
    borderColor: "#B5B5B534",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#000000",
    marginBottom: 12,
    fontSize: RFValue(13),
  },
  card: {
    margin: 16,
    backgroundColor: "#50863F",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: -5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // Android
    elevation: 4,
  },

  cardTitle: {
    fontSize: RFValue(20),
    fontWeight: "Inter_400Regular",
    color: "#ffffff",
    marginBottom: 16,
    textAlign: "center",
  },
  primaryBtn: {
    backgroundColor: "#F8F5EC",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryBtnText: {
    color: "#0f1117",
    fontWeight: "Inter_700Bold",
    fontSize: RFValue(14),
  },

  cancelText: {
    textAlign: "center",
    color: "#F8F5EC",
    fontSize: RFValue(12),
  },
  logoutText: {
    color: "#ff4444",
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(14),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8F5EC",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  logoutBtn: {
    backgroundColor: "#F8F5EC",
    borderWidth: 1,
    borderColor: "#ff4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
