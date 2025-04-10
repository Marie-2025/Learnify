import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config'; // one folder up

const Explore = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All'); // State for filter option
  const navigation = useNavigation();

  // Fetch courses data on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        const data = await response.json();
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on category
  const filteredCourses = courses.filter(course => 
    (filter === 'All' || course.category === filter) &&
    course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle course click and navigate to Enroll screen
  const handleCourseClick = async (course) => {
    try {
      await AsyncStorage.setItem("selectedCourse", JSON.stringify(course)); // Store course in AsyncStorage
      navigation.navigate('Enroll'); // Navigate to Enroll screen
    } catch (error) {
      console.error('Error storing course:', error); // Handle any errors that may occur
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Explore Courses</Text>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for courses"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => console.log('Search clicked')} // Placeholder for search action
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Filter options */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('All')}>
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('Programming')}>
          <Text style={styles.filterButtonText}>Programming</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilter('Engineer')}>
          <Text style={styles.filterButtonText}>Engineer</Text>
        </TouchableOpacity>
        {/* More filters can be added here in the future */}
      </View>

      {/* Courses Title */}
      <Text style={styles.coursesTitle}>Courses</Text>

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.courseName}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCourseClick(item)} // On card click, store course and navigate
          >
            <View style={styles.cardContent}>
              {/* Left side (image) */}
              <Image source={{ uri: item.imageURL }} style={styles.courseImage} />
              {/* Right side (course details) */}
              <View style={styles.courseDetails}>
                <View style={styles.category}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.courseTitle}>{item.courseTitle}</Text>
                <Text style={styles.coursePrice}>Price: <Text style={styles.price}>${item.price}</Text></Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    marginRight: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  coursesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
  },
  courseImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  courseDetails: {
    flex: 1,
  },
  category: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
  },
  courseTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  coursePrice: {
    fontSize: 14,
  },
  price: {
    fontWeight: 'bold',
  },
});

export default Explore;
