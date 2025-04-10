import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config'; // one folder up


const PaymentSuccess = ({ route }) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [courseData, Server] = useState(null);

  // Get username from AsyncStorage
  useEffect(() => {
    const getUsernameFromStorage = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUsername(parsedData.username);  // Set username directly in state
          Alert.alert(parsedData.username);
        } else {
          console.log('Error: No userData found in storage.');
        }
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    };

    getUsernameFromStorage();
  }, []);

  // Get latest paymentId from backend
  useEffect(() => {
    const fetchLastPaymentId = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/last-payment-id`);
        const data = await response.json();

        if (response.ok && data.success) {
          setPaymentId(data.paymentId);  // Set paymentId directly in state
        } else {
          console.log('Failed to get payment ID:', data.message);
        }
      } catch (error) {
        console.error('Error fetching payment ID:', error);
      }
    };

    fetchLastPaymentId();
  }, []);

  useEffect(() => {
    const fetchCourseDataFromStorage = async () => {
      try {
        const courseFromStorage = await AsyncStorage.getItem('selectedCourse');
        if (courseFromStorage) {
          const course = JSON.parse(courseFromStorage); // Parse JSON data from AsyncStorage
          Server(course); // Set the course data from AsyncStorage
          console.log(course); // Debugging line
        } else {
          console.log('No course data found');
        }
      } catch (error) {
        console.error('Error fetching course data from AsyncStorage:', error); // Handle any errors
      }
    };

    // Fetch course data from AsyncStorage
    fetchCourseDataFromStorage();
  }, []); // Empty dependency array, runs once when the component mounts

  // Fetch course data from the server if we have courseData with courseTitle
  useEffect(() => {
    if (courseData && courseData.courseTitle) {
      const fetchCourseDataFromServer = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/courses/${courseData.courseTitle}`);
          const data = await response.json();

          if (response.ok && data) {
            // setServerCourseData(data); // Set the server course data
            console.log("Data from server:", data); // Debugging line
          } else {
            console.log('Failed to fetch course data:', data.message);
          }
        } catch (error) {
          console.error('Error fetching course data from server:', error);
        }
      };

      // Fetch data from the server if the course title exists
      fetchCourseDataFromServer();
    }
  }, [courseData]); // Dependency array, fetch from server whenever courseData changes

  // Handle start learning button click
  const handleStartLearning = async () => {
    if (!username || !paymentId || !courseData) {
      console.log('Error: Missing user, payment info, or course data.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          paymentId,
          courseTitle: courseData.courseTitle,
          courseData,
        }),
      });

      const data = await response.json();

      if (response.ok && data.message === 'Enrollment successful and file updated.') {
        navigation.navigate('Tabs2', { screen: 'Progress' });
      } else {
        console.log('Error enrolling user in course:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/confetti.gif')} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Congratulations!</Text>
      <Text style={styles.subtitle}>
        You now own <Text style={styles.highlight}>{courseData?.courseTitle}</Text> forever!
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleStartLearning}>
        <Text style={styles.buttonText}>Start Learning Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: screenWidth * 0.7,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#e67e22',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PaymentSuccess;
