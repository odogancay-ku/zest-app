import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Stack, useNavigation, useRouter} from 'expo-router';
import {Provider as PaperProvider, Button, Appbar} from 'react-native-paper';

export default function WalletSettings() {
    const router = useRouter();
    const navigation = useNavigation();

    return (
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Wallet Settings" />
                </Appbar.Header>
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={() => router.push('../other/privateKeySettings')}
                        style={styles.button}
                    >
                        Private Key Settings
                    </Button>
                    <View style={styles.spacer} />
                    <Button
                        mode="contained"
                        onPress={() => router.push('../other/addWallet')}
                        style={styles.button}
                    >
                        Add New Wallet
                    </Button>
                    <View style={styles.spacer} />
                    <Button
                        mode="contained"
                        color="red"
                        onPress={() => navigation.goBack()}
                        style={styles.button}
                    >
                        Delete This Wallet
                    </Button>
                </View>
            </SafeAreaView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacer: {
        height: 20, // Space between buttons
    },
    button: {
        width: '80%',
    },
});
