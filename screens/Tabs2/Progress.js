import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../../config'; // one folder up

const Progress = () => {
  const [courses, setCourses] = useState({});
  const [username, setUsername] = useState('');
  const navigation = useNavigation();  // Hook to navigate to Player.js

  // Dynamically get the username from AsyncStorage (localStorage alternative in React Native)
  useEffect(() => {
    const getUsername = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setUsername(parsedData.username);  // Set the username after fetching from AsyncStorage
      }
    };

    getUsername();
  }, []); // Run once when the component mounts

  useEffect(() => {
    if (!username) return; // If no username, do not make the request

    // Fetch courses when username is available
    const fetchCourses = async () => {
      try {
        // POST request with username in the body
        const res = await fetch(`${API_BASE_URL}/user/enrolled-courses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }), // Send username in the request body
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCourses(data.enrolledCourses);  // Update the state with the fetched courses
        } else {
          console.log('Failed to fetch courses:', data.message);
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };

    fetchCourses(); // Call the fetch function when the username is available
  }, [username]); // Re-run this effect if the username changes

  const handleCourseClick = async (course) => {
    // Save the selected course data to AsyncStorage
    await AsyncStorage.setItem('selectedCourse', JSON.stringify(course));
    // Navigate to the Player screen
    navigation.navigate('Player');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Learning Progress</Text>
      <Text style={styles.subtext}>Track how far you've come!</Text>

      {Object.entries(courses).map(([key, course]) => (
        <TouchableOpacity key={key} style={styles.card} onPress={() => handleCourseClick(course)}>
          <Image source={{ uri: course.imageURL }} style={styles.image} />
          <Text style={styles.courseTitle}>{course.courseTitle}</Text>
          <Text style={styles.instructor}>Instructor: {course.instructorName}</Text>
          <Text style={styles.category}>Category: {course.category}</Text>
          <Text style={styles.progress}>Progress: {course.progress.percentage}%</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');  // Get screen width for responsive layout

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  subtext: {
    fontSize: 16,
    color: '#388E3C',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: width * 0.9,  // Make the card 90% of screen width
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
  },
  instructor: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
    textAlign: 'center',
  },
  category: {
    fontSize: 14,
    color: '#66BB6A',
    marginTop: 2,
    textAlign: 'center',
  },
  progress: {
    fontSize: 14,
    color: '#2E7D32',
    marginTop: 6,
    textAlign: 'center',
  },
});

export default Progress;
