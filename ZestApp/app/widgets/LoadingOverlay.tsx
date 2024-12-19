import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';

interface LoadingOverlayProps {
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({message = 'Loading, please wait...'}) => {
    const theme = useTheme();
    return (
        <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{marginTop: 10, color: theme.colors.onSurface}}>{message}</Text>
        </View>
    );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});
