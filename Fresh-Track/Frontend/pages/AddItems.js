import { Text, StyleSheet, View, TextInput, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RFValue } from 'react-native-responsive-fontsize';
import ItemInput from "../components/ItemInput";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

export default function AddItems(){
    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.h1} >Add items</Text>
            <Text style={styles.h2} >Choose how to add your food</Text>

            <View style={{alignItems: "center", marginTop: 15}}>
                <View style={{ flexDirection: "row", gap: 20, marginBottom: 23}}>
                    <ItemInput inputChoice={"Scan receipt"}>
                        <Ionicons name="receipt-outline" color="white" size={40}/>
                    </ItemInput>
                    <ItemInput inputChoice={"Scan barcode"}>
                        <Ionicons name="barcode-outline" size={40} color="white" />
                    </ItemInput>
                </View>
                
                <ItemInput inputChoice={"Search item"}>
                    <Feather name="search" size={40} color="white" />
                </ItemInput>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F5EC",
        paddingTop: 25,
        paddingLeft: 25,
        paddingRight: 25
    },
    h2: {
        fontSize: RFValue(14),
        color: "#707070",
        fontFamily: 'Inter_500Medium',
        marginBottom: 20,
        textAlign: "center"
    },
    h1: {
        fontSize: RFValue(24),
        fontFamily: 'Inter_600SemiBold',
        textAlign: "center",
        marginBottom: 5
    }
})