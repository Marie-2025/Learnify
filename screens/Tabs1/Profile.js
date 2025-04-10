import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Add this at the top
import { API_BASE_URL } from '../../config'; // one folder up

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [formValues, setFormValues] = useState({});
  const navigation = useNavigation(); // Inside the component

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const storedData = await AsyncStorage.getItem('userData');
      const parsedData = storedData ? JSON.parse(storedData) : {};
      setUserData(parsedData);
      setFormValues(parsedData);
    };
    loadUserData();
  }, []);

  const handleEdit = (key) => setEditingField(key);

  const handleChange = (key, value) => {
    setFormValues({ ...formValues, [key]: value });
  };

  const handleSave = async () => {
    try {
      // Update localStorage
      await AsyncStorage.setItem('userData', JSON.stringify(formValues));
      setUserData(formValues);
      setEditingField(null);

      // Send update to server
      await axios.post(`${API_BASE_URL}/profile`, formValues);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile.');
    }
  };
  
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData'); // Clear session
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {Object.entries(formValues).map(([key, value]) => {
      if (key === 'fullname') {
        return (
          <View key={key} style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={String(value)}
                editable={false}
                placeholder="Full Name"
              />
            </View>
          </View>
        );
      }

      return (
        <View key={key} style={styles.fieldContainer}>
          <Text style={styles.fieldTitle}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          <View style={styles.inputWrapper}>
            {key !== 'password' && (
              <TouchableOpacity onPress={() => handleEdit(key)}>
                <MaterialIcons name="edit" size={24} color="#555" style={styles.icon} />
              </TouchableOpacity>
            )}
            <TextInput
              style={styles.input}
              value={String(value)}
              editable={key === 'password' || editingField === key}
              secureTextEntry={key === 'password'}
              onChangeText={(text) => handleChange(key, text)}
              placeholder={`Enter ${key}`}
            />
          </View>
        </View>
      );
    })}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#111827',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#374151',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
