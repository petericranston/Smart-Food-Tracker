import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from "react";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
// nav icons
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import AddItems from "./pages/AddItems";


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

  // setting up a variable for the bottom navtab
  const NavTab = createBottomTabNavigator();
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <NavTab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === "HomePage") {
                return <Feather name="home" size={26} />;
              } else if (route.name === "AddItemsPage") {
                return <Entypo name="circle-with-plus" size={30} color="green" />;
              } else if (route.name === "RecipesPage") {
                return <AntDesign name="book" size={26} />;
              } else {
                // fallback icon incase of failure
                iconName = "circle";
              }
            },
            tabBarStyle: {
              overflow: "visible",
              backgroundColor: "#F8F5EC",
              paddingTop: 10,
              paddingRight: 10,
            },
            tabBarIconStyle: {
              overflow: "visible",
            },
            headerShown: false,
          })}
        >
          <NavTab.Screen
            name="HomePage"
            component={Home}
            options={{ tabBarLabel: "Home", tabBarIconStyle: { marginTop: 5 } }}
          />
          <NavTab.Screen
            name="AddItemsPage"
            component={AddItems}
            options={{ tabBarLabel: "" }}
          />
          <NavTab.Screen
            name="RecipesPage"
            component={Recipes}
            options={{
              tabBarLabel: "Recipes",
              tabBarIconStyle: { marginTop: 5 },
            }}
          />
        </NavTab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
