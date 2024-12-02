import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">This screen doesn't exist.</Text>
            <Link href="/" style={styles.link}>
                <Button mode="contained">Go to home screen</Button>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
