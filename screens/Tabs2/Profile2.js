import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../../config'; // one folder up

const Profile2 = () => {
  const [userData, setUserData] = useState(null);
  const [editable, setEditable] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    setEditable(false); // disable editing
  
    // Filter out enrolledCourses before sending
    const { enrolledCourses, ...userDataToSend } = userData;
  
    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDataToSend),
      });
  
      if (response.ok) {
        console.log('User data sent:', userDataToSend);
        Alert.alert("Saved", "Your changes have been saved.");
      } else {
        Alert.alert("Error", "Failed to save your changes.");
      }
    } catch (error) {
      console.error('Save Error:', error);
      Alert.alert("Error", "An error occurred while saving.");
    }
  };
  
  
  const handleDelete = async () => {
    
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (!storedData) return;
  
      const { username } = JSON.parse(storedData);
  
      const response = await fetch(`${API_BASE_URL}/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        console.log('✅', result.message);
        await AsyncStorage.clear(); // Clear all user data
        Alert.alert("Deleted", "Your account has been deleted.");
        navigation.replace('Login'); // Assuming you're using React Navigation
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert("Error", "Something went wrong.");
    }
  };
  
  

  const handleEditToggle = () => {
    setEditable(!editable);
  };

  const handleInputChange = (key, value) => {
    setUserData({ ...userData, [key]: value });
  };

  if (!userData) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity onPress={handleEditToggle}>
          <Icon name="edit" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {Object.entries(userData)
        .filter(([key]) => key !== 'enrolledCourses') // 👈 filter out the enrolledCourses field
        .map(([key, value]) => (
          <View key={key} style={styles.inputGroup}>
            <Text style={styles.label}>{key.toUpperCase()}</Text>
            <TextInput
              style={styles.input}
              value={value}
              editable={editable}
              onChangeText={(text) => handleInputChange(key, text)}
            />
          </View>
      ))}


      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={async () => {
          await AsyncStorage.clear();
          navigation.replace('Login');
        }}
      >
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete My Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loading: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    borderColor: 'red',
    borderWidth: 1.5,
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  deleteButtonText: {
    color: 'red',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export default Profile2;
