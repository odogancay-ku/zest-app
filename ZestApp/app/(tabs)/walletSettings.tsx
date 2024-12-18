import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Stack, useNavigation, useRouter} from 'expo-router';
import {Provider as PaperProvider, Button, Appbar, useTheme} from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

export default function WalletSettings() {
    const router = useRouter();
    const navigation = useNavigation();

    function deleteWallet() {

    }

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
                    onPress={() => router.push("/pages/privateKeywords")}
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
                    onPress={() =>{
                        SecureStore.deleteItemAsync('wallets').then(() => console.log('Wallets deleted'));
                        router.back();
                    }}
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
