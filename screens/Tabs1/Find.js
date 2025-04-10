import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, Dimensions, Alert } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../config'; // one folder up

const screenWidth = Dimensions.get('window').width;

const Find = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch courses based on the searchQuery (instructor's name)
  const fetchCourses = async () => {
    if (!searchQuery) {
      return; // If searchQuery is empty, do not make the API call
    }
    setLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/courses?instructorName=${encodeURIComponent(searchQuery)}`);
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load courses.');
    }
  };

  // Trigger fetch whenever the searchQuery changes
  useEffect(() => {
    fetchCourses();
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Find my Course</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for my course"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#888"
      />

      {/* Display Loading Indicator */}
      {loading && <Text>Loading...</Text>}

      {/* Courses */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <View key={index} style={styles.courseCard}>
              <Image source={{ uri: course.imageURL }} style={styles.courseImage} />
              <View style={styles.courseDetails}>
                <Text style={[styles.category, styles.redBackground]}>{course.category}</Text>
                <Text style={styles.courseName}>{course.courseTitle}</Text>
                <Text style={styles.stateText}>
                  State: <Text style={[styles.saleText, styles.greenBackground]}>{course.state}</Text>
                </Text>
              </View>
            </View>
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
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  searchBar: {
    width: screenWidth - 40,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    elevation: 2,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    alignSelf: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 4,
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

export default Find;
