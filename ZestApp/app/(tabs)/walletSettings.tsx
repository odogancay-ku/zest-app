import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Stack, useNavigation, useRouter} from 'expo-router';
import {Provider as PaperProvider, Button, Appbar, useTheme} from 'react-native-paper';

export default function WalletSettings() {
    const router = useRouter();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{flex: 1, padding: 10, backgroundColor: useTheme().colors.background}}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 20,
            }}
            >
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => router.push("/pages/privateKeySettings")}
                >
                    Private Key Settings
                </Button>
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => router.push("/pages/addWallet")}
                >
                    Add New Wallet
                </Button>
                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => navigation.goBack()}
                >
                    Delete This Wallet
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '80%',
        fontWeight: 'bold',
    },
});
