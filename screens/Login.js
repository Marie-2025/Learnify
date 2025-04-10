import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { API_BASE_URL } from '../config'; // one folder up
import axios from 'axios';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleLogin = () => {
    if (!username || !password || !role) {
      alert('Error', 'Please enter all fields!');
      Alert.alert('Error', 'Please enter all fields!');
      return;
    }

    const url = `${API_BASE_URL}/login/${role}/${username}/${password}`;

    axios
      .get(url)
      .then((response) => {
        console.log('Login Success:', response.data);
        // alert('Login Success:', response.data);
        // Alert.alert('Login Success:', response.data);
        navigation.navigate('Process', { ...response.data }); // Pass user data to Process
      })
      .catch((error) => {
        console.error('Login Error:', error);
        // alert('Login Failed', error.response?.data?.error || 'Something went wrong!');
        // Alert.alert('Login Failed', error.response?.data?.error || 'Something went wrong!');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>📚 Learnify</Text>

      {role !== '' && <Text style={styles.roleText}>You are logging in as: {role}</Text>}

      <Text style={styles.title}>Login to Learnify</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
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

      <View style={styles.roleButtonContainer}>
        <TouchableOpacity style={styles.roleButton} onPress={() => setRole('Instructor')}>
          <Text style={styles.roleButtonText}>Instructor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roleButton} onPress={() => setRole('Student')}>
          <Text style={styles.roleButtonText}>Student</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Contact the Dev')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>
          Don’t have an Account? <Text style={styles.signupBold}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
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
  forgotText: {
    alignSelf: 'flex-end',
    color: '#f40000',
    fontSize: 14,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#f40000',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  signupText: {
    fontSize: 16,
    color: '#333',
  },
  signupBold: {
    fontWeight: 'bold',
    color: '#f40000',
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
});

export default Login;
