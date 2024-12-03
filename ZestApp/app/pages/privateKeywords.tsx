import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {TextInput, Button, Text, useTheme, Switch} from 'react-native-paper';
import {ScrollView, View} from "react-native";

export default function PrivateKeywords() {
    const [privateKeywords, setPrivateKeywords] = useState<string[]>(new Array(12).fill(''));
    const [privateKey, setPrivateKey] = useState('');
    const [inputType, setInputType] = useState(true);
    const {network} = useLocalSearchParams<{network:string}>();
    const router = useRouter();
    const theme = useTheme();

    const validateKeysAndNavigate = () => {
        router.navigate({
            pathname: './addWallet',
            params: {privateKey: privateKey}
        })
    }


    const toggleSwitch = () => setInputType(previousState => !previousState);
    return (
        <SafeAreaView style={{flex: 1, padding: 16, gap: 20, backgroundColor: theme.colors.background}}>
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

            <Switch onValueChange={toggleSwitch} value={inputType}/>

            <Text variant="titleMedium">Enter your mnemonic key keywords</Text>
            <View style={{flex:1}}>
            {inputType ? <ScrollView>
                    {privateKeywords.map((keyword, index) => (
                        index % 2 === 0 && (
                            <View key={index}>
                                <TextInput
                                    value={privateKeywords[index]}
                                    onChangeText={(text) => {
                                        const newKeywords = [...privateKeywords];
                                        newKeywords[index] = text;
                                        setPrivateKeywords(newKeywords);
                                    }}
                                    placeholder={`Enter keyword ${index + 1}`}
                                />
                                {index + 1 < privateKeywords.length && (
                                    <TextInput
                                        value={privateKeywords[index + 1]}
                                        onChangeText={(text) => {
                                            const newKeywords = [...privateKeywords];
                                            newKeywords[index + 1] = text;
                                            setPrivateKeywords(newKeywords);
                                        }}
                                        placeholder={`Enter keyword ${index + 2}`}
                                    />
                                )}
                            </View>
                        )
                    ))}
                </ScrollView> :
                <TextInput
                    value={privateKey}
                    onChangeText={setPrivateKey}
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