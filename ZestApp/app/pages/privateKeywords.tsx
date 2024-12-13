import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {TextInput, Button, Text, useTheme, Switch} from 'react-native-paper';
import {ScrollView, View} from "react-native";
import {generateMnemonic} from "@/app/wallet-import";

export default function PrivateKeywords() {
    const [mnemonicPhrase, setMnemonicPhrase] = useState<string[]>(new Array(12).fill(''));
    const [key, setKey] = useState('');
    const [inputType, setInputType] = useState(true);
    const {network} = useLocalSearchParams<{ network: string }>();
    const router = useRouter();
    const theme = useTheme();


    const validateKeysAndNavigate = () => {
        let m = inputType ? mnemonicPhrase.join(' ') : "";
        let k = inputType ? "" : key
        router.navigate({
            pathname: './addWallet',
            params: {mnemonic: m, key: k}
        })
    }

    useEffect(() => {
        console.log(network)
        let test_mnemonic = "praise valley time inject leg vintage burst bottom unfair luggage mixed level"
        setMnemonicPhrase(test_mnemonic.split(' '))
    }, []);

    const toggleSwitch = () => setInputType(previousState => !previousState);
    return (
        <SafeAreaView style={{flex: 1, padding: 16, gap: 5, backgroundColor: theme.colors.background}}>
            <Stack.Screen
                options={{
                    title: 'Add private key info',
                    headerStyle: {backgroundColor: theme.colors.primary},
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <View style={{marginBottom:15}}>
                <Text variant="titleMedium">{inputType ? 'Mnemonic Phrase' : 'Private Key'}</Text>
                <Switch onValueChange={toggleSwitch} value={inputType}/>
            </View>

            <Text variant="titleMedium" style={{marginBottom:5}}>Enter your {inputType ? 'Mnemonic Phrase' : 'Private Key'}</Text>
            <View style={{flex: 1}}>
                {inputType ? <View>
                        {mnemonicPhrase.map((keyword, index) => (
                            index % 2 === 0 && (
                                <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <TextInput
                                        style={{flex: 1, marginRight: 8}}
                                        value={mnemonicPhrase[index]}
                                        onChangeText={(text) => {
                                            const newKeywords = [...mnemonicPhrase];
                                            newKeywords[index] = text;
                                            setMnemonicPhrase(newKeywords);
                                        }}
                                        placeholder={`Enter keyword ${index + 1}`}
                                    />
                                    {index + 1 < mnemonicPhrase.length && (
                                        <TextInput
                                            style={{flex: 1, marginLeft: 8}}
                                            value={mnemonicPhrase[index + 1]}
                                            onChangeText={(text) => {
                                                const newKeywords = [...mnemonicPhrase];
                                                newKeywords[index + 1] = text;
                                                setMnemonicPhrase(newKeywords);
                                            }}
                                            placeholder={`Enter keyword ${index + 2}`}
                                        />
                                    )}
                                </View>
                            )
                        ))}

                        <Button
                            mode="contained"
                            style={{marginTop: 16}}
                            onPress={()=>setMnemonicPhrase(generateMnemonic().split(' '))}>
                            <Text>Generate Mnemonic Key</Text>
                        </Button>
                    </View>
                    :
                    <TextInput
                        value={key}
                        onChangeText={setKey}
                        placeholder="Enter your private key"/>}
            </View>
            <Button
                mode="contained"
                onPress={validateKeysAndNavigate}>
                <Text>Done</Text>
            </Button>
        </SafeAreaView>
    );
}