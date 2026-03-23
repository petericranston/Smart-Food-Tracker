import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
// nav icons
import { Ionicons } from "@expo/vector-icons"
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import pages
import Home from './pages/Home'
import Recipes from'./pages/Recipes'
import AddItems from './pages/AddItems'

// setting up a variable for the bottom navtab
const NavTab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <NavTab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size}) => {
            if (route.name === "HomePage") {
              return <Feather name="home" size={26}/>
            } else if (route.name === "AddItemsPage"){
              return <Entypo name="circle-with-plus" size={30} color="green"/>
            } else if (route.name === "RecipesPage"){
              return <AntDesign name="book" size={26}/>
            } else{
              // fallback icon incase of failure
              iconName = "circle"
            }
          },
          tabBarStyle: {
            overflow: 'visible',
            backgroundColor: "#F8F5EC",
            paddingTop: 10,
            paddingRight: 10
          },
          tabBarIconStyle: {
            overflow: 'visible'
          },
          headerShown: false
        })}
      >
        <NavTab.Screen name="HomePage" component={Home} options={{ tabBarLabel: "Home", tabBarIconStyle: { marginTop: 5} }}/>
        <NavTab.Screen name="AddItemsPage" component={AddItems} options={{ tabBarLabel: "" }}/>
        <NavTab.Screen name="RecipesPage" component={Recipes} options={{ tabBarLabel: "Recipes", tabBarIconStyle: { marginTop: 5} }}/>
      </NavTab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
