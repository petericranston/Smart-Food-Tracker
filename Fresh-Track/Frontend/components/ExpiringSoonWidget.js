import { View, Text, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function ExpiringWidget({ image, name, expireMessage, expiringIn, dateStyling }){
    return(
        <View style={{ 
            flexDirection: "row", marginBottom: 20, 
            borderColor: "#B5B5B540", borderWidth: 2, paddingBottom: 20, paddingTop: 20, 
            paddingLeft: 10, paddingRight: 10,
            borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "space-evenly" 
        }}>
            <Image source={image} style={{ width: 60, height: 60 }}></Image>
            <View style={{ flexDirection: "column" }}>
                <Text style={{fontSize: RFValue(16), marginBottom: 5, fontFamily: 'Inter_500Medium'}}>{name}</Text>
                <Text style={{ fontSize: RFValue(9), width: "70%", color: "#8E8E8E"}}>{expireMessage}</Text>
            </View>
            <View style={dateStyling}>
                <Text style={{ color: "white" }}>{expiringIn}</Text>
            </View>
        </View>
    )
}