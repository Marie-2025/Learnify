import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Enroll = () => {
  const [course, setCourse] = useState(null);
  const navigation = useNavigation();

  // Get the course data from localStorage (or AsyncStorage for React Native)
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseData = await AsyncStorage.getItem('selectedCourse'); // Retrieve the stored course data
        if (courseData) {
          setCourse(JSON.parse(courseData)); // Set the course data if found
        } else {
          console.log('No course data found');
          navigation.goBack(); // If no course found, go back to Explore screen
        }
      } catch (error) {
        console.error('Error fetching course data:', error); // Handle any errors
      }
    };

    fetchCourseData(); // Call the async function inside useEffect
  }, [navigation]); // Ensure the navigation prop is included in the dependency array

  // Convert price and discount to numbers with up to 2 decimal places
  const formatCurrency = (value) => {
    return parseFloat(value).toFixed(2); // Convert string to number and format to 2 decimal places
  };

  // Calculate total discounted price
  const totalDiscountedPrice = course
    ? (parseFloat(course.price) - parseFloat(course.discount)).toFixed(2)
    : '0.00';

  // Handle enroll button click
  const handleEnroll = () => {
    console.log('Enrolled');
    navigation.navigate('Payment'); // Navigate to Payment screen
  };

  // Handle cancel button click
  const handleCancel = () => {
    AsyncStorage.removeItem('selectedCourse'); // Clear the selected course from AsyncStorage
    navigation.goBack(); // Navigate back to Explore screen
  };
  
  if (!course) {
    return <Text>Loading course details...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Displaying course details */}
      <Text style={styles.title}>{course.courseTitle}</Text>
      <Text style={styles.courseName}>{course.courseName}</Text>

      <Image source={{ uri: course.imageURL }} style={styles.courseImage} />

      <Text style={styles.category}>Category: {course.category}</Text>
      <Text style={styles.description}>Description: {course.description}</Text>
      <Text style={styles.instructor}>Instructor: {course.instructorName}</Text>

      <Text style={styles.price}>Price: ${formatCurrency(course.price)}</Text>
      <Text style={styles.discount}>Discount: ${formatCurrency(course.discount)}</Text>
      <Text style={styles.discountedPrice}>Total Discounted Price: ${totalDiscountedPrice}</Text>

      {/* Enroll and Cancel buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
          <Text style={styles.buttonText}>Enroll</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    height: "100dvh"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  category: {
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  instructor: {
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    marginBottom: 10,
  },
  discount: {
    fontSize: 16,
    marginBottom: 10,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  enrollButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Enroll;
