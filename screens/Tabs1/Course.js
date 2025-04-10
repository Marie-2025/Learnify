import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config'; // one folder up


const screenWidth = Dimensions.get('window').width;

const Course = () => {
  const [courses, setCourses] = useState([]);
  const navigation = useNavigation(); // Initialize the useNavigation hook

  const handleAddCourseClick = () => {
    navigation.navigate('SetUpCourse'); // Navigate to the SetUpCourse screen
  };

  const handleCardPress = async (course) => {
    try {
      await AsyncStorage.setItem('selectedCourse', JSON.stringify(course));
      navigation.navigate('MyCourse');
    } catch (error) {
      console.error("Error storing course:", error);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (!userDataString) return;
  
        const userData = JSON.parse(userDataString);
        const fullname = userData.fullname;
  
        const response = await axios.get(`${API_BASE_URL}/courses?instructorName=${encodeURIComponent(fullname)}`);
        setCourses(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', '❌ Failed to load courses.');
      }
    };
  
    fetchCourses();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Courses</Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddCourseClick}>
        <Text style={styles.addButtonText}>+ Add Course</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Courses</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(course)} style={styles.courseCard}>
              <Image source={{ uri: course.imageURL }} style={styles.courseImage} />
              <View style={styles.courseDetails}>
                <Text style={[styles.category, styles.redBackground]}>{course.category}</Text>
                <Text style={styles.courseName}>{course.courseTitle}</Text>
                <Text style={styles.stateText}>
                  State: <Text style={[styles.saleText, styles.greenBackground]}>{course.state}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No courses available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  addButton: {
    backgroundColor: '#4B5563',
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '40%',
    alignSelf: 'flex-end',
    marginBottom: 20,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#111827',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 4, // Sharper edges
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: screenWidth - 40,
    alignSelf: 'center',
  },
  courseImage: {
    width: 90,
    height: 90,
    borderRadius: 6,
    marginRight: 15,
  },
  courseDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  category: {
    color: 'white',
    fontWeight: '600',
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  redBackground: {
    backgroundColor: '#EF4444',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  stateText: {
    fontSize: 14,
    color: '#374151',
  },
  saleText: {
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  greenBackground: {
    backgroundColor: '#10B981',
  },
});

export default Course;
