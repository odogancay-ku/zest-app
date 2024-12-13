import React, {useEffect} from 'react';
import {
    Provider as PaperProvider,
    MD3DarkTheme, MD3LightTheme
} from 'react-native-paper';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useColorScheme} from '@/hooks/useColorScheme';
import './shims';

SplashScreen.preventAutoHideAsync();

const DarkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#dbac34',
        primaryContainer: '#b68200',
    }
}

const LightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#dbac34',
        primaryContainer: '#b68200',
    }
}

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

    const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

    return (
        <PaperProvider theme={theme}>
            <Stack screenOptions={{
                headerShown: true,
                }}
            >
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="+not-found"/>
            </Stack>
        </PaperProvider>
    );
}
