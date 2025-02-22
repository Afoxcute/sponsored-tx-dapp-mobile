import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../src/components/styles/color';

interface WalletConnectionTypeButtonProps {
    connectorType: string;
    connectorName: string;
    setWaitingForUser: (waiting: boolean) => void;
    connection: any;
    disabled?: boolean;
}

export const WalletConnectionTypeButton: React.FC<WalletConnectionTypeButtonProps> = ({
    connectorType,
    connectorName,
    setWaitingForUser,
    connection,
    disabled,
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, disabled && styles.buttonDisabled]}
            disabled={disabled}
            onPress={() => {
                // Implement connection logic
            }}
        >
            <Text style={styles.buttonText}>{connectorName}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 10,
        marginVertical: 7,
        borderWidth: 1,
        borderColor: colors.primaryDark,
    },
    buttonDisabled: {
        backgroundColor: colors.gray,
        borderColor: colors.grayDark,
    },
    buttonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '300',
        textAlign: 'center',
    },
});