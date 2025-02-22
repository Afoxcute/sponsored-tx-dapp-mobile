import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Alert,
    ScrollView,
} from 'react-native';
import {
    toBuffer,
    serializeTypeValue,
    deserializeTypeValue,
    AccountAddress,
    ConcordiumGRPCClient,
    AccountTransactionSignature,
} from '@concordium/web-sdk';
import {
    useGrpcClient,
    WalletConnectionProps,
    useConnection,
    useConnect,
    TESTNET,
    WalletConnection,
} from '@concordium/react-components';
import { version } from '../package.json';
import { submitUpdateOperator, submitTransfer, mint } from './utils.ts';
import { Switch } from './components/Switch';
import { WalletConnectionTypeButton } from './components/WalletConnectionTypeButton';
import { colors } from '../src/components/styles/color';
import {
    SPONSORED_TX_CONTRACT_NAME,
    NONCE_OF_PARAMETER_SCHEMA,
    NONCE_OF_RETURN_VALUE_SCHEMA,
    CONTRACT_SUB_INDEX,
    BROWSER_WALLET,
    WALLET_CONNECT,
    UPDATE_OPERATOR_SCHEMA,
    TRANSFER_SCHEMA,
    REFRESH_INTERVAL,
    VERIFIER_URL,
} from '../src/constants.ts';

const generateTransferPayload = (nonce: string, tokenID: string, from: string, to: string) => {
    if (nonce === '') {
        Alert.alert('Error', 'Insert a nonce.');
        return '';
    }

    if (isNaN(Number(nonce))) {
        Alert.alert('Error', 'Your nonce needs to be a number.');
        return '';
    }

    if (tokenID === '') {
        Alert.alert('Error', 'Insert a tokenID.');
        return '';
    }

    if (tokenID.length !== 8) {
        Alert.alert('Error', 'TokenID needs to have 8 digits.');
        return '';
    }

    if (from === '') {
        Alert.alert('Error', 'Insert a `from` address.');
        return '';
    }

    if (from.length !== 50) {
        Alert.alert('Error', '`From` address needs to have 50 digits.');
        return '';
    }

    if (to === '') {
        Alert.alert('Error', 'Insert a `to` address.');
        return '';
    }

    if (to.length !== 50) {
        Alert.alert('Error', '`To` address needs to have 50 digits.');
        return '';
    }

    const transfer = [
        {
            amount: '1',
            data: [],
            from: {
                Account: [from],
            },
            to: {
                Account: [to],
            },
            token_id: tokenID,
        },
    ];

    const payload = serializeTypeValue(transfer, toBuffer(TRANSFER_SCHEMA, 'base64')).toString('hex');
    return payload;
};

const generateUpdateOperatorPayload = (nonce: string, operator: string, addOperator: boolean) => {
    if (nonce === '') {
        Alert.alert('Error', 'Insert a nonce.');
        return '';
    }

    if (isNaN(Number(nonce))) {
        Alert.alert('Error', 'Your nonce needs to be a number.');
        return '';
    }

    if (operator === '') {
        Alert.alert('Error', 'Insert an operator address.');
        return '';
    }

    if (operator.length !== 50) {
        Alert.alert('Error', 'Operator address needs to have 50 digits.');
        return '';
    }

    const operatorAction = addOperator
        ? {
              Add: [],
          }
        : {
              Remove: [],
          };

    const updateOperator = [
        {
            operator: {
                Account: [operator],
            },
            update: operatorAction,
        },
    ];

    const payload = serializeTypeValue(updateOperator, toBuffer(UPDATE_OPERATOR_SCHEMA, 'base64')).toString('hex');
    return payload;
};

async function signCIS3Message(
    connection: WalletConnection,
    isUpdateOperatorTab: boolean,
    nonce: string,
    expiryTimeSignature: string,
    account: string,
    payload: string,
): Promise<AccountTransactionSignature> {
    const contractAddress = { index: Number(process.env.SMART_CONTRACT_INDEX), subindex: 0 };
    const contractName = { value: SPONSORED_TX_CONTRACT_NAME };
    const entrypointName = { value: isUpdateOperatorTab ? 'updateOperator' : 'transfer' };
    const _nonce = Number(nonce);
    const payloadMessage = { data: payload, schema: isUpdateOperatorTab ? UPDATE_OPERATOR_SCHEMA : TRANSFER_SCHEMA };
    
    return connection.client.signCIS3Message(
        contractAddress,
        contractName,
        entrypointName,
        _nonce,
        expiryTimeSignature,
        account,
        payloadMessage,
    );
}

async function getPublicKey(rpcClient: ConcordiumGRPCClient, account: string) {
    const res = await rpcClient.getAccountInfo(new AccountAddress(account));
    return res?.accountCredentials[0].value.contents.credentialPublicKeys.keys[0].verifyKey;
}

async function getNonceOf(rpcClient: ConcordiumGRPCClient, account: string) {
    const param = serializeTypeValue(
        {
            queries: [
                {
                    account,
                },
            ],
        },
        toBuffer(NONCE_OF_PARAMETER_SCHEMA, 'base64'),
    );

    const res = await rpcClient.invokeContract({
        method: `${SPONSORED_TX_CONTRACT_NAME}.nonceOf`,
        contract: { index: BigInt(Number(process.env.SMART_CONTRACT_INDEX)), subindex: CONTRACT_SUB_INDEX },
        parameter: param,
    });

    if (!res || res.tag === 'failure' || !res.returnValue) {
        throw new Error(
            `RPC call 'invokeContract' on method '${SPONSORED_TX_CONTRACT_NAME}.nonceOf' of contract SMART_CONTRACT_INDEX failed`,
        );
    }

    const returnValues: number[][] | undefined = deserializeTypeValue(
        toBuffer(res.returnValue, 'hex'),
        toBuffer(NONCE_OF_RETURN_VALUE_SCHEMA, 'base64'),
    );

    if (returnValues === undefined) {
        throw new Error(
            `Deserializing the returnValue from the '${SPONSORED_TX_CONTRACT_NAME}.nonceOf' method of contract SMART_CONTRACT_INDEX failed`,
        );
    }
    
    return returnValues[0][0];
}

const SponsoredTransactions: React.FC<WalletConnectionProps> = (props) => {

    return (
        <ScrollView style={styles.container}>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        padding: 16,
    },
    // ... rest of the styles
});

export default SponsoredTransactions;