import {Text, View} from "react-native";
import {Stack} from "expo-router";

export default function AtomicSwap() {

    return (
        <View>
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
            <Text>Add wallet</Text>
        </View>
    );
}