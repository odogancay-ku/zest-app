import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface CircleButtonProps {
    size?: number;
    borderColor?: string;
    onPress?: () => void;
    style?: ViewStyle;
    children?: React.ReactNode; // Allows any child component to be passed
}

const CircleButton: React.FC<CircleButtonProps> = React.forwardRef(({
    size = 75,
    borderColor,
    onPress,
    style,
    children,
}, ref) => {
    const theme = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: 1,
                    borderColor: borderColor || theme.colors.onPrimary,
                    backgroundColor: theme.colors.primary,
                    shadowRadius: 4,
                    shadowColor: theme.colors.shadow,
                    shadowOpacity: 0.3,
                },
                style,
            ]}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CircleButton;
