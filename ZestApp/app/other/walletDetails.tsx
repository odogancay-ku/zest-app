import {View} from "react-native";
import {Stack} from "expo-router";
import React from "react";

export default function WalletDetails() {
    return (
        <View>
            <Stack.Screen
                options={{
                    title: 'Wallet Details',
                    headerStyle: { backgroundColor: 'red' },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            WalletDetails
        </View>
    );
}