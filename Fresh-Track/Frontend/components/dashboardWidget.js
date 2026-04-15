import { View, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function DashboardWidget({ count, title }){
    return(
        <View style={{ backgroundColor: "#50863F",  paddingTop: 20, paddingBottom: 20, paddingLeft: 23, paddingRight: 35, borderRadius: 13}}>
            <Text style={{ fontSize: RFValue(24), fontFamily: "Inter_700Bold", color: "white", marginBottom: 10 }}>{count}</Text>
            <Text style={{ fontSize: RFValue(12), fontFamily: "Inter_600SemiBold", color: "white" }}>{title}</Text>
        </View>
    )
}