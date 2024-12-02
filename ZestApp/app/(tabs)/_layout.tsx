import {Tabs} from 'expo-router';
import React from 'react';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useTheme} from "react-native-paper";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.onSurface,
                tabBarActiveBackgroundColor: theme.colors.surface,
                tabBarInactiveBackgroundColor: theme.colors.surfaceVariant,
                tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="walletSettings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color}/>
                    ),
                }}
            />
        </Tabs>
    );
}
