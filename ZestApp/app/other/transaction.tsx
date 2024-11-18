import {View} from "react-native";
import React from "react";
import {Stack} from "expo-router";

export default function Transaction() {
    return (
        <View>
            <Stack.Screen
                options={{
                    title: 'Transaction',
                    headerStyle: { backgroundColor: 'blue' },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            Transaction
        </View>);
}