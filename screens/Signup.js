import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios'; // ✅ Import Axios for API calls
import { API_BASE_URL } from '../config'; // one folder up

const Signup = ({ navigation }) => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [role, setRole] = useState('');

  const handleSignup = async () => {
    if (!fullname || !username || !email || !password || !gender || !dateOfBirth || !role) {
      alert('Error', 'All fields are required!');
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    const userData = { fullname, username, email, password, gender, dateOfBirth, role };

    try {
      // Inside handleSignup function in Signup.js
      axios.post(`${API_BASE_URL}/signup`, userData)
      .then(response => {
        console.log(response.data);
        navigation.navigate('Login', { username, role }); // Navigate to Process.js
      })
      .catch(error => {
        console.error('Signup Error:', error);
      });
    } catch (error) {
      console.error(error);
      // alert('Error', error.response?.data?.error || 'Signup failed. Try again.');
      // Alert.alert('Error', error.response?.data?.error || 'Signup failed. Try again.');
    }
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>📚 Learnify</Text>

      {role !== '' ? <Text style={styles.roleText}>Signing up as: {role}</Text> : null}

      <Text style={styles.title}>Create an Account</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Full Name"
        placeholderTextColor="#888"
        value={fullname}
        onChangeText={setFullname}
      />

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Email Address"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Gender"
        placeholderTextColor="#888"
        value={gender}
        onChangeText={setGender}
      />

      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#888"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />

      <View style={styles.roleButtonContainer}>
        <TouchableOpacity style={styles.roleButton} onPress={() => setRole('Instructor')}>
          <Text style={styles.roleButtonText}>Instructor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roleButton} onPress={() => setRole('Student')}>
          <Text style={styles.roleButtonText}>Student</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Already have an Account? <Text style={styles.loginBold}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    alignItems: "center",
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    height: "100dvh"
    // Removed the border and overflow styles
  },
  ScrollView:{
    overflow: "scroll"
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f40000',
    marginBottom: 20,
  },
  roleText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  roleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#f40000',
    paddingVertical: 12,
    width: '48%',
    borderRadius: 10,
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#f40000',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  signupButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 16,
    color: '#333',
  },
  loginBold: {
    fontWeight: 'bold',
    color: '#f40000',
  },
});

export default Signup;
