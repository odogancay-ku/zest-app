import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {TextInput, Button, Text, useTheme, Switch} from 'react-native-paper';
import {ScrollView, View} from "react-native";

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
        let test_mnemonic = "praise you muffin lion enable neck grocery crumble super myself license ghost"
        setMnemonicPhrase(test_mnemonic.split(' '))
    }, []);

    const toggleSwitch = () => setInputType(previousState => !previousState);
    return (
        <SafeAreaView style={{flex: 1, padding: 16, gap: 20, backgroundColor: theme.colors.background}}>
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

            <Switch onValueChange={toggleSwitch} value={inputType}/>

            <Text variant="titleMedium">Enter your mnemonic key keywords</Text>
            <View style={{flex: 1}}>
                {inputType ? <ScrollView>
                        {mnemonicPhrase.map((keyword, index) => (
                            index % 2 === 0 && (
                                <View key={index}>
                                    <TextInput
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
                    </ScrollView> :
                    <TextInput
                        value={key}
                        onChangeText={setKey}
                        placeholder="Enter your mnemonic key"/>}
            </View>
            <Button
                mode="contained"
                onPress={validateKeysAndNavigate}>
                <Text>Done</Text>
            </Button>
        </SafeAreaView>
    );
}