import React, {useEffect} from 'react';
import {DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme} from '@react-navigation/native';
import {
    Provider as PaperProvider,
    MD3DarkTheme as PaperDarkTheme,
    DefaultTheme as PaperDefaultTheme
} from 'react-native-paper';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useColorScheme} from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    const theme = colorScheme === 'dark' ? PaperDarkTheme : PaperDefaultTheme;
    // TODO: CHANGE THIS BACK TO THE ABOVE LINE
    // const theme = colorScheme === 'dark' ? PaperDarkTheme : PaperDarkTheme;

    return (
        <PaperProvider theme={theme}>
            <Stack screenOptions={{
                headerShown: true,
            }}>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="+not-found"/>
            </Stack>
        </PaperProvider>
    );
}
