import { View, Text, Button } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function RecipesWidget({ dishEmoji, dishName, dishTime, pplServed, numIngredients }){
    
    return(
        <View style={{borderWidth: 1, marginTop: 30, width: "95%", borderRadius: 20}}>
            <View style={{ backgroundColor: "#59AA3F", borderTopLeftRadius: 19, borderTopRightRadius: 19, paddingBottom: 30}}>
                <View style={{alignItems: "flex-end", paddingTop: 15, paddingRight: 15, borderRadius: 20}}>
                    <Text style={{ color: "white", backgroundColor: "#D50000", padding: 7, width: 80, fontSize: 8, borderRadius: 20, textAlign: "center"}}>USES EXPIRING</Text>
                </View>
                <View style={{ alignItems: "center"}}>
                    <Text style={{ fontSize: 60 }}>{dishEmoji}</Text>
                </View>
            </View>
            <View style={{padding: 15}}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10}}>
                    <Text style={{fontSize: RFValue(16), fontFamily: "Inter_300Light",}}>{dishName}</Text>
                    <Button title="Saved"></Button>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 3}}>
                    <Text>⌛ {dishTime}</Text>
                    <Text>👨 Serves {pplServed}</Text>
                </View>
                <View style={{ marginTop: 10, alignItems: "center", backgroundColor: "#2E6E1A28", padding: 12, borderRadius: 7}}>
                    <Text style={{ fontSize: RFValue(13), fontFamily: "Inter_600SemiBold" }}>Uses {numIngredients} of your ingredients</Text>
                </View>
            </View>
        </View>
    )
}