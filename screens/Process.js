import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config'; // one folder up

const Process = ({ route, navigation }) => {
  const { username, role } = route.params; // Get username and role from navigation params
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const folder = role === 'Student' ? 'students' : 'instructors';
        const url = `${API_BASE_URL}/user/${folder}/${username}`;

        const response = await axios.get(url);
        const fetchedData = response.data;
        
        // Store fetched data in AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(fetchedData));

        // Set user data to state
        setUserData(fetchedData);

        console.log(fetchedData.role);
        console.log("Boolean for Role: ", Boolean(fetchedData.role === 'Student'));

        // After storing, check role and navigate
        if (fetchedData.role === 'Student') {
          navigation.replace('Tabs2', { fullname: fetchedData.fullname });
        } else {
          navigation.replace('Tabs', { fullname: fetchedData.fullname });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Alert.alert('Error', error.message || 'Something went wrong');
        // Alert.alert('Error', 'Failed to fetch user data!');
      }
    };

    fetchUserData();
  }, [username, role]); // Fetch data when username or role changes

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, {userData.fullname}!</Text>
      <Text style={styles.text}>Email: {userData.email}</Text>
      <Text style={styles.text}>Role: {userData.role}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
});

export default Process;
