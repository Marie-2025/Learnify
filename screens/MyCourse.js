import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config'; // one folder up

const MyCourse = () => {
  const [course, setCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();

  // Load the selected course from AsyncStorage
  useEffect(() => {
    const loadCourse = async () => {
      const storedCourse = await AsyncStorage.getItem('selectedCourse');
      const parsedCourse = storedCourse ? JSON.parse(storedCourse) : null;
      setCourse(parsedCourse);
    };
    loadCourse();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (key, value) => {
    setCourse((prevCourse) => ({ ...prevCourse, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('selectedCourse', JSON.stringify(course));
      setIsEditing(false);
      alert('Course updated successfully!');
      // Optionally, send a request to the server to update the course
      await axios.post(`${API_BASE_URL}/courses/update`, course); // Update server with course data
    } catch (error) {
      console.error(error);
      alert('Failed to update course.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/courses/delete`, {
        data: { courseTitle: course.courseTitle }
      });
      alert('Course deleted successfully!');
      navigation.goBack(); // Navigate back to the previous screen after deletion
    } catch (error) {
      console.error(error);
      alert('Failed to delete course.');
    }
  };

  const handleCancel = () => {
    navigation.goBack(); // Navigate back to Course.js
  };

  if (!course) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Course Details</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Course Title</Text>
        <TextInput
          style={styles.input}
          value={course.courseTitle}
          editable={isEditing}
          onChangeText={(text) => handleChange('courseTitle', text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Description</Text>
        <TextInput
          style={styles.input}
          value={course.description}
          editable={isEditing}
          onChangeText={(text) => handleChange('description', text)}
          multiline
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Category</Text>
        <TextInput
          style={styles.input}
          value={course.category}
          editable={isEditing}
          onChangeText={(text) => handleChange('category', text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={course.imageURL}
          editable={isEditing}
          onChangeText={(text) => handleChange('imageURL', text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Lessons</Text>
        {course.lessons && course.lessons.map((lesson, index) => (
          <View key={index} style={styles.lessonContainer}>
            <Text style={styles.fieldTitle}>Lesson {index + 1}</Text>
            <TextInput
              style={styles.input}
              value={lesson.title}
              editable={isEditing}
              onChangeText={(text) => {
                const updatedLessons = [...course.lessons];
                updatedLessons[index].title = text;
                setCourse({ ...course, lessons: updatedLessons });
              }}
            />
            <TextInput
              style={styles.input}
              value={lesson.embedLink}
              editable={isEditing}
              onChangeText={(text) => {
                const updatedLessons = [...course.lessons];
                updatedLessons[index].embedLink = text;
                setCourse({ ...course, lessons: updatedLessons });
              }}
            />
          </View>
        ))}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Quiz</Text>
        {course.quiz && course.quiz.map((q, index) => (
          <View key={index} style={styles.quizContainer}>
            <Text style={styles.fieldTitle}>Question {index + 1}</Text>
            <TextInput
              style={styles.input}
              value={q.question}
              editable={isEditing}
              onChangeText={(text) => {
                const updatedQuiz = [...course.quiz];
                updatedQuiz[index].question = text;
                setCourse({ ...course, quiz: updatedQuiz });
              }}
            />
            {q.options && q.options.map((option, idx) => (
              <TextInput
                key={idx}
                style={styles.input}
                value={option}
                editable={isEditing}
                onChangeText={(text) => {
                  const updatedQuiz = [...course.quiz];
                  updatedQuiz[index].options[idx] = text;
                  setCourse({ ...course, quiz: updatedQuiz });
                }}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Price</Text>
        <TextInput
          style={styles.input}
          value={course.price}
          editable={isEditing}
          onChangeText={(text) => handleChange('price', text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>State</Text>
        <TextInput
          style={styles.input}
          value={course.state}
          editable={isEditing}
          onChangeText={(text) => handleChange('state', text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Discount</Text>
        <TextInput
          style={styles.input}
          value={course.discount}
          editable={isEditing}
          onChangeText={(text) => handleChange('discount', text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Publish</Text>
        <TextInput
          style={styles.input}
          value={String(course.publish)}
          editable={isEditing}
          onChangeText={(text) => handleChange('publish', text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.fieldTitle}>Instructor Name</Text>
        <TextInput
          style={styles.input}
          value={course.instructorName}
          editable={false} // Read-only
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={isEditing ? handleSave : handleEdit}
      >
        <Text style={styles.saveButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6',
    flexGrow: 1,
    height: "100dvh"
  },
  backButton: {
    marginBottom: 20,
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
  input: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#111827',
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  lessonContainer: {
    marginBottom: 10,
  },
  quizContainer: {
    marginBottom: 10,
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
  cancelButton: {
    backgroundColor: '#F87171',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyCourse;
