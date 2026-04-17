import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import RecipesWidget from "../components/RecipesWidget";

export default function Recipes(){
    const dummyDishes = [
        { dishEmoji: "🍝", name: "Spaghetti Bolognese", time: "45 mins", serves: 4, ingredients: 2 },
        { dishEmoji: "🍗", name: "Lemon Herb Chicken", time: "30 mins", serves: 2, ingredients: 4 },
        { dishEmoji: "🥗", name: "Caesar Salad", time: "15 mins", serves: 3, ingredients: 5 },
    ];

    return(
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={styles.h1}>Recipes</Text>
                        <TouchableOpacity
                            style={{ backgroundColor: "#50863F", padding: 10, width: "23%", 
                                borderRadius: 20, marginBottom: 20 
                            }}
                        ><Text style={{ color: "white", textAlign: "center", fontWeight: "Inter_600SemiBold", fontSize: RFValue(14) }}>Saved</Text></TouchableOpacity>
                    </View>

                    <View style={{ alignItems: "center"}}>
                        {dummyDishes.map((item) => (
                            <RecipesWidget
                                key={item.name}
                                dishEmoji={item.dishEmoji}
                                dishName={item.name}
                                dishTime={item.time}
                                pplServed={item.serves}
                                numIngredients={item.ingredients}
                            />
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EC",
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
  },
  h1: {
    fontSize: RFValue(24),
    fontFamily: "Inter_600SemiBold",
    marginTop: 5
  },
})