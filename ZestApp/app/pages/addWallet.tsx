import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Stack, useLocalSearchParams, useNavigation, useRouter} from 'expo-router';
import {TextInput, Button, Text, useTheme, Surface} from 'react-native-paper';
import {Picker} from "@react-native-picker/picker";
import * as Clipboard from 'expo-clipboard';
import * as SecureStore from 'expo-secure-store';
import {getWalletInfoMnemonic} from "@/app/wallet-import";
import {Wallet, WalletInfo} from "@/models/models";
import {View, Alert} from "react-native";

const generateBitcoinAddress = (): string => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = '1';
    for (let i = 0; i < 25; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
};

export default function AddWallet() {
    const [walletName, setWalletName] = useState('');
    const [walletNetwork, setWalletNetwork] = useState('');
    const router = useRouter();
    const navigation = useNavigation();
    const theme = useTheme();
    const [selectedCurrency, setSelectedCurrency] = useState<string>("BTC");
    const {mnemonic='Insert mnemonic key'} = useLocalSearchParams<{ mnemonic?: string }>();

    const saveWallet = async () => {
        let storedWallets = await SecureStore.getItemAsync('wallets');
        const wallets = storedWallets ? JSON.parse(storedWallets) : [];
        let walletInfo: WalletInfo = await getWalletInfoMnemonic(mnemonic)
        let newWallet: Wallet = {
            id: (wallets.length + 1).toString(),
            name: walletName,
            network: walletNetwork,
            privateKey: walletInfo.privateKey,
            address: walletInfo.address,
            publicKey: walletInfo.publicKey
        }
        console.log(newWallet)
        wallets.push(newWallet);
        await SecureStore.setItemAsync('wallets', JSON.stringify(wallets));
        router.replace('/');
    };

    return (
        <SafeAreaView style={{flex: 1, padding: 16, gap: 20, backgroundColor: theme.colors.background}}>
            {/* Header */}
            <Stack.Screen
                options={{
                    title: 'Add New Wallet',
                    headerStyle: {backgroundColor: theme.colors.primary},
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />

            {/* Wallet Name Input */}
            <Text variant="titleMedium">Wallet Name</Text>
            <TextInput
                mode="outlined"
                label="Enter wallet name"
                value={walletName}
                onChangeText={setWalletName}
            />

            {/* Wallet Network Input */}
            {/* Currency Picker */}
            <Surface style={{padding: 16, elevation: 2}}>
                <Text variant="headlineSmall">Choose Currency</Text>
                <Picker
                    selectedValue={selectedCurrency}
                    onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
                >
                    <Picker.Item label="BTC - Bitcoin" value="BTC"/>
                    <Picker.Item label="ETH - Ethereum" value="ETH"/>
                </Picker>
                <Text>Selected Currency: {selectedCurrency}</Text>
            </Surface>
            <View>
                <Text variant="titleMedium">Mnemonic Key is: </Text>
                <Text variant="titleMedium" onPress={() => {
                    Clipboard.setStringAsync(mnemonic);
                    Alert.alert(
                        'Success',
                        'Mnemonic copied to clipboard!',
                        [{text: 'OK'}]
                    );
                }}>{mnemonic}</Text>
            </View>


            {/* Private Key Keywords Button */}
            <Button
                mode="contained"
                onPress={() => {
                    router.push(
                        {
                            pathname: './privateKeywords',
                            params: {network: walletNetwork},
                        });
                }}
            >
                Insert Private Key Keywords
            </Button>

            {/* Save Wallet Button */}
            <Button mode="contained" onPress={saveWallet}>
                Save Wallet
            </Button>
        </SafeAreaView>
    );
}
