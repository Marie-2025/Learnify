import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Loading = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login'); // Navigate to Client.js after 3 seconds
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>LOADING...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // White background
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f40000',
  },
});

export default Loading;
