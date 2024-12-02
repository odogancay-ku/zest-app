import {View,StyleSheet,Text} from "react-native";
import {useRouter,Stack} from "expo-router";
import {useEffect} from "react";

export default function AtomicSwap() {

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Swap',
                    headerStyle: { backgroundColor: '#f4511e' },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
                <Text>AtomicSwap</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f0f0f0",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
});