import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  body: {
    fontFamily: 'Roboto',
    color: 'white',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 20,
  },

  sponsoredTransactions: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  largeText: {
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 21,
  },

  centerLargeText: {
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 21,
    textAlign: 'center',
  },

  loadingText: {
    color: '#979797',
    flexWrap: 'wrap', // React Native equivalent for overflow-wrap
  },

  text: {
    margin: 6,
  },

  buttonInvisible: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontSize: 0,
  },

  header: {
    color: 'white',
  },

  input: {
    width: '100%',
  },

  switch: {
    backgroundColor: '#308274',
    borderRadius: 5,
  },

  link: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    color: '#308274',
    textDecorationLine: 'underline',
    flexWrap: 'wrap', // React Native equivalent for overflow-wrap
  },

  containerSpaceBetween: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  containerSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});