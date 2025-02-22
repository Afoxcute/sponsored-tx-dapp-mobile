import React from 'react';
import { Switch as RNSwitch, StyleSheet } from 'react-native';
import { colors } from '../../src/components/styles/color';

interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ value, onValueChange }) => {
    return (
        <RNSwitch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: colors.primary, true: colors.primary }}
            thumbColor={colors.primaryDark}
        />
    );
};