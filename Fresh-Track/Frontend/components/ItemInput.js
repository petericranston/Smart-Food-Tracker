import { Text, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function ItemInput({ children, inputChoice, onPressFunction }){
    return(
        <TouchableOpacity onPress={onPressFunction} style={{ backgroundColor: "#50863F", width: "45%", padding: 15, borderRadius: 13}}>
            {children}
            <Text style={{ color: "white", marginTop: 15, fontFamily: "Inter_600SemiBold"}}>{inputChoice}</Text>
        </TouchableOpacity>
    )
}