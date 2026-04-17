import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { useState } from "react";

export default function InvDropdown({options, onSelect}) {
    const [selected, setSelected] = useState(options[0]);
    const [visible, setVisible] = useState(false);

    return( 
        <View style={styles.container}>
            <TouchableOpacity style={styles.dropdown} onPress={() => setVisible(true)}>
                <Text>{selected}</Text>
                <Text style={{ fontSize: 15}}>▼</Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
                    <View style={styles.optionsContainer}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                        setSelected(item);
                                        onSelect(item);
                                        setVisible(false)
                                    }}
                                >
                                    <Text>{item}</Text>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={{ height: 1, backgroundColor: "#000000", marginVertical: 8}} />
                            )}
                        >

                        </FlatList>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 13,
        padding: 12,
        backgroundColor: "#50863F34",
        width: "33%",
        marginBottom: 45
    },
    optionsContainer: {
        backgroundColor: "#F8F5EC",
        margin: 20,
        marginTop: 252,
        borderRadius: 12,
        padding: 10,
        borderWidth: 1
    },
    option: {
        padding: 10,
    },
});