import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Stack, useNavigation, useRouter} from 'expo-router';
import {TextInput, Button, Text, useTheme, Surface} from 'react-native-paper';
import {Picker} from "@react-native-picker/picker";

export default function AddWallet() {
    const [walletName, setWalletName] = useState('');
    const [walletNetwork, setWalletNetwork] = useState('');
    const router = useRouter();
    const navigation = useNavigation();
    const theme = useTheme();
    const [selectedCurrency, setSelectedCurrency] = useState<string>("BTC");
    const saveWallet = () => {
        const newWallet = {
            id: Math.random(), // Generate a unique ID for the new wallet
            name: walletName,
            balance: 0, // Initial balance
            network: walletNetwork,
        };
        // use shared variable
        navigation.goBack();
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
