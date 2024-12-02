import React from 'react';
import {View} from 'react-native';
import {Appbar, Text, Surface, useTheme} from 'react-native-paper';
import {SafeAreaView} from "react-native-safe-area-context";

export default function AtomicSwap() {
    return (
        <SafeAreaView style={{flex: 1, padding: 10, backgroundColor: useTheme().colors.background}}>
            <Text variant="headlineLarge">Atomic Swap</Text>
            <Text variant="bodyMedium">
                This page uses only react-native-paper components and adheres to its theme defaults.
            </Text>
        </SafeAreaView>
    );
}
