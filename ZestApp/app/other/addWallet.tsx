import React, {useState} from 'react';
import {Button, Text, TextInput, View, StyleSheet} from "react-native";
import {Stack, useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

export default function AddWallet() {
    const [walletName, setWalletName] = useState('');
    const [walletNetwork, setWalletNetwork] = useState('');
    const router = useRouter();
    const navigation = useNavigation();

    const saveWallet = () => {
        const newWallet = {
            id: Math.random(), // Generate a unique ID for the new wallet
            name: walletName,
            balance: 0, // Initial balance
            network: walletNetwork,
        };
        //use shared variable
        navigation.goBack()
    };

    return (
        <SafeAreaView style={{
            padding: 20,
            flex: 1,
            justifyContent: 'space-evenly',
        }}>
            <Stack.Screen
                options={{
                    title: 'Add New Wallet',
                    headerStyle: {backgroundColor: '#f4511e'},
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <View>
                <Text style={styles.label}>Wallet Name</Text>
                <TextInput
                    style={styles.input}
                    value={walletName}
                    onChangeText={setWalletName}
                    placeholder="Enter wallet name"
                />
            </View>

            <View>
                <Text style={styles.label}>Wallet Network</Text>
                <TextInput
                    style={styles.input}
                    value={walletNetwork}
                    onChangeText={setWalletNetwork}
                    placeholder="Enter wallet network"
                />
            </View>

            <Button
                title="Insert Private Key Keywords"
                onPress={() => {
                    router.push('../other/privateKeywords')
                }}
            />

            <Button title="Save Wallet" onPress={saveWallet}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
    },
});