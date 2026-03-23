import { SafeAreaView } from "react-native-safe-area-context"
import { Text, StyleSheet } from "react-native"
import { RFValue } from 'react-native-responsive-fontsize';

export default function Home(){
    return(
        <>
            <SafeAreaView style={styles.container}>
                <Text style={styles.h2} >Good day</Text>
                <Text style={styles.h1} >Your Kitchen</Text>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F5EC",
        padding: "30"
    },
    h2: {
        fontSize: RFValue(14),
        color: "#707070",
        fontFamily: 'Inter_500Medium',
        marginBottom: 20
    },
    h1: {
        fontSize: RFValue(24),
        fontFamily: 'Inter_600SemiBold'
    }
})