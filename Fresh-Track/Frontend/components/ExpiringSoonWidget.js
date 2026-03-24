import { View, Text, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function ExpiringWidget({ image, name, expireMessage, expiringIn, dateStyling }){
    return(
        <View style={{ flexDirection: "row" }}>
            <Image source={image} style={{ width: 50, height: 50 }}></Image>
            <View style={{ flexDirection: "column" }}>
                <Text>{name}</Text>
                <Text>{expireMessage}</Text>
            </View>
            <View style={dateStyling}>
                <Text>{expiringIn}</Text>
            </View>
        </View>
    )
}