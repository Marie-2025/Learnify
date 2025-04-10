import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { API_BASE_URL } from '../../config'; // one folder up

const Chat = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load students when dropdown is clicked
    if (showDropdown && students.length === 0) {
      fetch(`${API_BASE_URL}/get/students`)
        .then(res => res.json())
        .then(data => {
          setStudents(data);
          console.log('Fetched Students:', data);
        })
        .catch(err => console.error('Error:', err));
    }
  }, [showDropdown]);

  const handleSendEmail = async () => {
    const trimmedFrom = fromEmail.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!selectedStudent || !trimmedFrom || !trimmedSubject || !trimmedMessage) {
      alert('All fields must be filled!');
      return;
    }

    const payload = {
      from: trimmedFrom,
      to: selectedStudent.email,
      subject: trimmedSubject,
      message: trimmedMessage
    };

    try {
      const res = await fetch(`${API_BASE_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      console.log('Email sent:', result);
      Alert.alert('Email sent successfully!');
    } catch (err) {
      console.error('Sending failed:', err);
      alert('Error sending email.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Send me an email</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.buttonText}>Students</Text>
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdown}>
          {students.map((student, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedStudent(student);
                setShowDropdown(false);
              }}
            >
              <Text style={styles.dropdownText}>{student.fullname}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedStudent && (
        <View style={styles.form}>
          <Text style={styles.label}>Student Name</Text>
          <TextInput
            value={selectedStudent.fullname}
            editable={false}
            style={styles.readOnlyInput}
          />

          <Text style={styles.label}>Student Email</Text>
          <TextInput
            value={selectedStudent.email}
            editable={false}
            style={styles.readOnlyInput}
          />

          <Text style={styles.label}>Your Email</Text>
          <TextInput
            value={fromEmail}
            onChangeText={setFromEmail}
            style={styles.input}
            placeholder="Enter your email"
          />

          <Text style={styles.label}>Subject</Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
            placeholder="Enter subject"
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            style={styles.textarea}
            placeholder="Write your message"
            multiline
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSendEmail}>
            <Text style={styles.sendButtonText}>Send Email</Text>
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


export default Chat;
