import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import pages
import Home from "./pages/Home";

export default function App() {
  const API_URL = "http://192.168.0.229:3001";
  const [data, setData] = useState(null);

  useEffect(() => {
    //Getting data from the backend
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/api/data`);
      const data = await response.json();
      setData(data.message);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Text: {data}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
