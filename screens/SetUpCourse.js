import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { API_BASE_URL } from '../config'; // one folder up

const SetUpCourse = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [lessons, setLessons] = useState([{ title: '', embedLink: '' }]);
  const [quiz, setQuiz] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const [price, setPrice] = useState('');
  const [state, setState] = useState('');
  const [discount, setDiscount] = useState('');
  const [publish, setPublish] = useState(true);
  const [visibility, setVisibility] = useState('Public');
  const [instructorName, setInstructorName] = useState(''); // New state for Instructor Name

  const navigation = useNavigation(); // Initialize navigation

  const addLesson = () => {
    setLessons([...lessons, { title: '', embedLink: '' }]);
  };

  const addQuiz = () => {
    setQuiz([...quiz, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleSubmit = async () => {
    if (!courseTitle || !description || !category || quiz.length === 0 || !instructorName) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const courseData = {
      courseTitle,
      description,
      category,
      imageURL,
      lessons,
      quiz,
      price,
      state,
      discount,
      publish,
      visibility,
      instructorName, // Adding Instructor Name to the course data
    };

    try {
      await axios.post(`${API_BASE_URL}/course`, courseData);
      Alert.alert('Success', '✅ Course saved successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', '❌ Failed to save course.');
    }
  };

  const handleCancel = () => {
    // Navigate back to the Course page when the Cancel button is clicked
    navigation.goBack(); // This will take the user back to the previous screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Set Up Your Course</Text>

      <TextInput style={styles.input} placeholder="Course Title" value={courseTitle} onChangeText={setCourseTitle} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      
      <TextInput
        style={styles.input}
        placeholder="Instructor Name"
        value={instructorName}
        onChangeText={setInstructorName}
      />

      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput style={styles.input} placeholder="Image URL" value={imageURL} onChangeText={setImageURL} />

      <Text style={styles.subheading}>Lessons</Text>
      {lessons.map((lesson, index) => (
        <View key={index} style={styles.section}>
          <TextInput style={styles.input} placeholder="Lesson Title" value={lesson.title} onChangeText={(text) => {
            const updated = [...lessons];
            updated[index].title = text;
            setLessons(updated);
          }} />
          <TextInput style={styles.input} placeholder="Embed Link" value={lesson.embedLink} onChangeText={(text) => {
            const updated = [...lessons];
            updated[index].embedLink = text;
            setLessons(updated);
          }} />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={addLesson}>
        <Text style={styles.buttonText}>+ Add Lesson</Text>
      </TouchableOpacity>

      <Text style={styles.subheading}>Quiz</Text>
      {quiz.map((q, i) => (
        <View key={i} style={styles.section}>
          <TextInput style={styles.input} placeholder="Question" value={q.question} onChangeText={(text) => {
            const updated = [...quiz];
            updated[i].question = text;
            setQuiz(updated);
          }} />
          {q.options.map((opt, j) => (
            <TextInput key={j} style={styles.input} placeholder={`Option ${j + 1}`} value={opt} onChangeText={(text) => {
              const updated = [...quiz];
              updated[i].options[j] = text;
              setQuiz(updated);
            }} />
          ))}
          <TextInput style={styles.input} placeholder="Correct Answer" value={q.correctAnswer} onChangeText={(text) => {
            const updated = [...quiz];
            updated[i].correctAnswer = text;
            setQuiz(updated);
          }} />
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={addQuiz}>
        <Text style={styles.buttonText}>+ Add Question</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Price (USD)" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="State (Sale/Free)" value={state} onChangeText={setState} />
      <TextInput style={styles.input} placeholder="Discount (USD)" value={discount} onChangeText={setDiscount} keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Course</Text>

      </TouchableOpacity>
            {/* Cancel Button to Navigate Back to Course Screen */}
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#f9f9f9',
    height: '100vh'
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  section: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    backgroundColor: '#dc3545', // Red color for Cancel
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SetUpCourse;
