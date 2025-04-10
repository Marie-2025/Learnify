import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { API_BASE_URL } from '../../config'; // one folder up

const Chat2 = () => {
  const [instructors, setInstructors] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [error, setError] = useState('');

  const fetchInstructors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get/instructors`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setInstructors(data);
        setDropdownVisible(!dropdownVisible);
      } else {
        setError(data.message || 'No instructors found');
      }
    } catch (err) {
      console.error('Error fetching instructors:', err);
      setError('Server error');
    }
  };

  const handleSelectInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setDropdownVisible(false);
    setError('');
  };

  const handleSubmit = async () => {
    const trimmedFrom = fromEmail.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!selectedInstructor || !trimmedFrom || !trimmedSubject || !trimmedMessage) {
      setError('Please fill all the fields correctly.');
      return;
    }

    const payload = {
      from: trimmedFrom,
      to: selectedInstructor.email,
      subject: trimmedSubject,
      message: trimmedMessage,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      console.log('Server response:', result);
      console.log('Message sent successfully!');
      Alert.alert('Message sent successfully!');

      // Reset fields
      setFromEmail('');
      setSubject('');
      setMessage('');
      setSelectedInstructor(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Send me an email</Text>

      <TouchableOpacity style={styles.button} onPress={fetchInstructors}>
        <Text style={styles.buttonText}>Instructors</Text>
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          {instructors.map((inst, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.dropdownItem}
              onPress={() => handleSelectInstructor(inst)}
            >
              <Text style={styles.dropdownText}>{inst.fullname}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedInstructor && (
        <View style={styles.form}>
          <Text style={styles.label}>Instructor Name:</Text>
          <TextInput
            value={selectedInstructor.fullname}
            editable={false}
            style={styles.inputDisabled}
          />

          <Text style={styles.label}>Instructor Email:</Text>
          <TextInput
            value={selectedInstructor.email}
            editable={false}
            style={styles.inputDisabled}
          />

          <Text style={styles.label}>Your Email:</Text>
          <TextInput
            style={styles.input}
            value={fromEmail}
            onChangeText={setFromEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Subject:</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Subject"
          />

          <Text style={styles.label}>Message:</Text>
          <TextInput
            style={styles.textarea}
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message here"
            multiline
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 1000,
    alignSelf: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    color: '#c00',
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#c00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 16,
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
  },
  inputDisabled: {
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  textarea: {
    height: 100,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    textAlignVertical: 'top', // for Android
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: '#c00',
    padding: 12,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: '#c00',
    fontSize: 14,
    marginBottom: 10,
  },
});


export default Chat2;
