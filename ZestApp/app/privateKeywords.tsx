import {Stack, router} from "expo-router";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, View, Text, StyleSheet, TextInput, ScrollView} from "react-native";

export default function PrivateKeywords() {

    const [mnemonicKeywords, setMnemonicKeywords] = useState<string[]>(new Array(12).fill(''));
    
    const handleGoBack = () => {
        router.navigate({
            pathname: './addWallet',
            params: {keywords: mnemonicKeywords}
        })
    }
    //For test set the private key to 'test test test test test test test test test test test junk'
    
    return (
        <SafeAreaView style={{
            padding: 20,
            flex: 1,
            justifyContent: 'center',
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
            <Text style={styles.label}>Enter your private key keywords</Text>
            <ScrollView>
                {mnemonicKeywords.map((keyword, index) => (
                    index % 2 === 0 && (
                        <View key={index} style={styles.row}>
                            <TextInput
                                style={styles.input}
                                value={mnemonicKeywords[index]}
                                onChangeText={(text) => {
                                    const newKeywords = [...mnemonicKeywords];
                                    newKeywords[index] = text;
                                    setMnemonicKeywords(newKeywords);
                                }}
                                placeholder={`Enter keyword ${index + 1}`}
                            />
                            {index + 1 < mnemonicKeywords.length && (
                                <TextInput
                                    style={styles.input}
                                    value={mnemonicKeywords[index + 1]}
                                    onChangeText={(text) => {
                                        const newKeywords = [...mnemonicKeywords];
                                        newKeywords[index + 1] = text;
                                        setMnemonicKeywords(newKeywords);
                                    }}
                                    placeholder={`Enter keyword ${index + 2}`}
                                />
                            )}
                        </View>
                    )
                ))}
            </ScrollView>
            <Button
                title="Save Keys"
                onPress={handleGoBack}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-evenly',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '45%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});