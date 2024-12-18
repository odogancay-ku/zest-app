import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Picker} from "@react-native-picker/picker";
import {Button, Text, TextInput, useTheme, Surface} from "react-native-paper";
import {ScrollView} from "react-native";
import {Stack} from "expo-router";

interface Wallet {
    id: number;
    name: string;
    balance: number;
}

const mockCards: Wallet[] = [
    {id: 1, name: "Wallet 1", balance: 1000},
    {id: 2, name: "Wallet 2", balance: 2000},
    {id: 3, name: "Wallet 3", balance: 3000},
];

export default function AtomicSwap() {
    const theme = useTheme();
    const [selectedWalletId, setSelectedWalletId] = useState<number>(mockCards[0]?.id || 0);
    const [selectedCurrency, setSelectedCurrency] = useState<string>("BTC");
    const [value, setValue] = useState<string>("");

    const confirmSelection = () => {
        const selectedWallet = mockCards.find(wallet => wallet.id === selectedWalletId);
        alert(`You selected: ${selectedWallet?.name}\nBalance: $${selectedWallet?.balance}`);
    };

    const handleChange = (input: string) => {
        if (/^\d*$/.test(input)) {
            setValue(input); // Only update if input is numeric
        }
    };

    const handleSubmit = () => {
        alert(`You entered: ${value}`);
    };

    return (
        <ScrollView style={{backgroundColor: theme.colors.background}}>
            <Stack.Screen
                options={{
                    title: 'Atomic Swap',
                    headerStyle: {backgroundColor: theme.colors.primaryContainer},
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackButtonDisplayMode: 'minimal'
                }}
            />
            <SafeAreaView style={{flex: 1, paddingHorizontal: 16, gap: 10}}>
                {/* Wallet Picker */}
                <Surface style={{padding: 16, elevation: 2}}>
                    <Text variant="headlineSmall">Choose Wallet</Text>
                    <Picker
                        selectedValue={selectedWalletId}
                        onValueChange={(itemValue) => setSelectedWalletId(itemValue)}
                    >
                        {mockCards.map((card) => (
                            <Picker.Item key={card.id} label={card.name} value={card.id.toString()}/>
                        ))}
                    </Picker>
                    <Text>Selected Wallet: {"Wallet " + selectedWalletId}</Text>
                </Surface>

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

                {/* Amount Input and Submit */}
                <Surface style={{padding: 16, elevation: 2}}>
                    <Text variant="headlineSmall">Enter the Amount</Text>
                    <TextInput
                        mode="outlined"
                        value={value}
                        onChangeText={handleChange}
                        keyboardType="numeric"
                        placeholder="0"
                    />
                    <Button mode="contained" onPress={handleSubmit} style={{marginTop: 16}}>
                        Swap
                    </Button>
                </Surface>

            </SafeAreaView>
        </ScrollView>
    );
}
