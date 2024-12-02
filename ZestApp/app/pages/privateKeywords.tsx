import {Stack, useNavigation} from "expo-router";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button, View, Text, StyleSheet, TextInput, ScrollView} from "react-native";

export default function PrivateKeywords() {
    // 12 input fields for the private key keywords

    const [privateKeywords, setPrivateKeywords] = useState<string[]>(new Array(12).fill(''));
    const navigator = useNavigation();
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
                {privateKeywords.map((keyword, index) => (
                    index % 2 === 0 && (
                        <View key={index} style={styles.row}>
                            <TextInput
                                style={styles.input}
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
                                    style={styles.input}
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
            </ScrollView>
            <Button
                title="Save Keys"
                onPress={() => { navigator.goBack()
                }}
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