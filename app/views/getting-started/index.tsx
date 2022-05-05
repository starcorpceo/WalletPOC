import React from 'react';
import {StyleProp, Text, TextStyle, useColorScheme, View} from 'react-native';

const GettingStarted = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const textStyle: StyleProp<TextStyle> = {
    color: isDarkMode ? '#fff' : '#000',
    fontWeight: '700',
    textAlign: 'center',
  };

  return (
    <View>
      <Text style={textStyle}>Welcome to Secure Wallet</Text>
    </View>
  );
};

export default GettingStarted;
