import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import {TextInput, Button, Text, useTheme, Surface} from 'react-native-paper';
import {Picker} from "@react-native-picker/picker";
import * as Clipboard from 'expo-clipboard';
import * as SecureStore from 'expo-secure-store';
import {getWalletInfoMnemonic, getEthWalletInfoFromPrivateKey} from "@/app/wallet-import";
import {Wallet, WalletInfo} from "@/models/models";
import {View, Alert} from "react-native";
import LoadingOverlay from "@/app/widgets/LoadingOverlay";
import {WalletNetwork} from "@/constants/Enums"; // Adjust the import path as needed



export default function AddWallet() {


    const [walletName, setWalletName] = useState('');
    const [loading, setLoading] = useState(false); // State for loading
    const router = useRouter();
    const theme = useTheme();
    const [walletNetwork, setSelectedCurrency] = useState<WalletNetwork>(WalletNetwork.Bitcoin);
    const {mnemonic = 'Insert mnemonic key'} = useLocalSearchParams<{ mnemonic?: string }>();
    const {key = 'Insert private key'} = useLocalSearchParams<{ key?: string }>();

    const saveWallet = async () => {
        setLoading(true); // Show loading spinner
        try {
            let storedWallets = await SecureStore.getItemAsync('wallets');
            const wallets = storedWallets ? JSON.parse(storedWallets) : [];
            if (mnemonic) {
                let walletInfo: WalletInfo = await getWalletInfoMnemonic(mnemonic);
                let newWallet: Wallet = {
                    id: (wallets.length + 1).toString(),
                    name: walletName,
                    network: walletNetwork,
                    privateKey: walletInfo.privateKey,
                    address: walletInfo.address,
                    publicKey: walletInfo.publicKey,
                    balance: 0
                };
                wallets.push(newWallet);
                await SecureStore.setItemAsync('wallets', JSON.stringify(wallets));
                router.replace('/');
            } else if (key) {
                let walletInfo: WalletInfo = await getEthWalletInfoFromPrivateKey(key);
                let newWallet: Wallet = {
                    id: (wallets.length + 1).toString(),
                    name: walletName,
                    network: walletNetwork,
                    privateKey: walletInfo.privateKey,
                    address: walletInfo.address,
                    publicKey: walletInfo.publicKey,
                    balance: 0
                };
                wallets.push(newWallet);
                await SecureStore.setItemAsync('wallets', JSON.stringify(wallets));
                router.replace('/');
            }
        } catch (error) {
            console.log("error", error);
            Alert.alert('Error', 'Failed to save wallet. Please try again.');
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    return (
        <SafeAreaView style={{flex: 1, padding: 16, gap: 20, backgroundColor: theme.colors.background}}>
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

            {/* Show Loading Overlay if loading */}
            {loading && <LoadingOverlay message="Saving wallet, please wait..." />}

            <Text variant="titleMedium">Wallet Name</Text>
            <TextInput
                mode="outlined"
                label="Enter wallet name"
                value={walletName}
                onChangeText={setWalletName}
            />

            <Surface style={{padding: 16, elevation: 2}}>
                <Text variant="headlineSmall">Choose Currency</Text>
                <Picker
                    selectedValue={walletNetwork}
                    onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
                >
                    <Picker.Item label="Bitcoin" value={WalletNetwork.Bitcoin} />
                    <Picker.Item label="Citrea" value={WalletNetwork.Citrea} />
                </Picker>
                <Text>Selected Currency: {walletNetwork}</Text>
            </Surface>

            <View>
                <Text variant="titleMedium">Mnemonic Key is: </Text>
                <Text
                    variant="titleMedium"
                    onPress={() => {
                        Clipboard.setStringAsync(mnemonic);
                        Alert.alert('Success', 'Mnemonic copied to clipboard!', [{ text: 'OK' }]);
                    }}
                >
                    {mnemonic}
                </Text>
            </View>

            <Button
                mode="contained"
                onPress={() => {
                    router.push({
                        pathname: './privateKeywords',
                        params: {network: walletNetwork},
                    });
                }}
            >
                Insert Private Key Keywords
            </Button>

            <Button mode="contained" onPress={saveWallet}>
                Save Wallet
            </Button>
        </SafeAreaView>
    );
}
