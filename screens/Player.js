import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '../config'; // one folder up
import { WebView } from 'react-native-webview';


const Player = () => {
  const navigation = useNavigation();
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState({
    lessonsCompleted: [],
    quizzesCompleted: [],
    progress: 0,
  });
  const [quizAnswers, setQuizAnswers] = useState({});
  const [certificateAvailable, setCertificateAvailable] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({}); // Store selected quiz options with colors

  useEffect(() => {
    const getCourseData = async () => {
      const courseData = await AsyncStorage.getItem('selectedCourse');
      if (courseData) {
        setCourse(JSON.parse(courseData));
        const storedProgress = await AsyncStorage.getItem('userProgress');
        if (storedProgress) {
          setUserProgress(JSON.parse(storedProgress));
        }
      }
    };
    getCourseData();
  }, []);

  const handleLessonComplete = (lessonId) => {
    const updatedLessons = [...userProgress.lessonsCompleted];
    if (!updatedLessons.includes(lessonId)) {
      updatedLessons.push(lessonId);
    }
    const updatedProgress = Math.floor((updatedLessons.length / course.lessons.length) * 100);
    setUserProgress({
      ...userProgress,
      lessonsCompleted: updatedLessons,
      progress: updatedProgress,
    });
  };

  const handleQuizAnswer = (quizId, answer) => {
    const updatedAnswers = { ...quizAnswers, [quizId]: answer };
    setQuizAnswers(updatedAnswers);

    const quiz = course.quiz.find((q) => q.quizId === quizId);
    const isCorrect = quiz.correctAnswer === answer;

    const updatedQuizzes = [...userProgress.quizzesCompleted];
    if (isCorrect && !updatedQuizzes.includes(quizId)) {
      updatedQuizzes.push(quizId);
    }

    setUserProgress({
      ...userProgress,
      quizzesCompleted: updatedQuizzes,
    });

    // Change the color of the selected quiz option
    setSelectedOptions((prevState) => ({
      ...prevState,
      [quizId]: answer,
    }));
  };

  const handleSave = async () => {
    await AsyncStorage.setItem('userProgress', JSON.stringify(userProgress));
  };

  const handleSubmit = async () => {
    const savedData = await AsyncStorage.getItem('selectedCourse');
    const userData = await AsyncStorage.getItem('userData'); // Assuming username is stored in localStorage
    
    // Convert the string to an object
    const userObject = userData ? JSON.parse(userData) : null; // Ensure userData exists before parsing

    let username = userObject.username;
  
    if (savedData) {
      const postData = {
        course: JSON.parse(savedData),
        progress: userProgress,
        courseAttempted: true, // Adding courseAttempted flag
        username: username || 'Anonymous', // Using 'Anonymous' if username is not found
      };
  
      try {
        const res = await fetch(`${API_BASE_URL}/user/save-course`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
  
        const response = await res.json();
        if (response.success) {
          console.log('Data successfully submitted');
        } else {
          console.error('Submission failed');
        }
      } catch (error) {
        console.error('Error during submission:', error);
      }
    }
  };
  
  const handleClearProgress = async () => {
    // Clear user progress from local storage when the back button is clicked
    await AsyncStorage.removeItem('userProgress');
    setUserProgress({
      lessonsCompleted: [],
      quizzesCompleted: [],
      progress: 0,
    });
    navigation.goBack(); // Go back to the previous screen
  };

  const checkCertificateEligibility = () => {
    const lessonProgress = userProgress.progress >= 100;
    const quizScore = userProgress.quizzesCompleted.length === course.quiz.length && userProgress.quizzesCompleted.length / course.quiz.length >= 0.8;
    setCertificateAvailable(lessonProgress && quizScore);
  };

  useEffect(() => {
    if (course) {
      checkCertificateEligibility();
    }
  }, [userProgress, course]);

  if (!course) {
    return <Text>Loading course data...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleClearProgress} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{course.courseTitle}</Text>
      <Text style={styles.instructor}>Instructor: {course.instructorName}</Text>
      <Text style={styles.category}>Category: {course.category}</Text>
      <Image source={{ uri: course.imageURL }} style={styles.courseImage} />
      <Text style={styles.progressText}>Progress: {userProgress.progress}%</Text>

      {course.lessons.map((lesson) => (
        <View key={lesson.lessonId} style={styles.lessonCard}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <View style={styles.lessonEmbed}>
            {Platform.OS === 'web' ? (
              <iframe src={lesson.embedLink} style={styles.iframe} />
            ) : (
            <WebView
              source={{ uri: lesson.embedLink }}
              style={styles.iframe}
              javaScriptEnabled
              domStorageEnabled
          />
          )}
          </View>
          <Button title="Mark as Completed" onPress={() => handleLessonComplete(lesson.lessonId)} />
        </View>
      ))}

      {course.quiz.map((quiz) => (
        <View key={quiz.quizId} style={styles.quizCard}>
          <Text style={styles.quizQuestion}>{quiz.question}</Text>
          {quiz.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOptions[quiz.quizId] === option && styles.selectedOption, // Change color when clicked
              ]}
              onPress={() => handleQuizAnswer(quiz.quizId, option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <Button title="Save Progress" onPress={handleSave} />
      <Button title="Submit Progress" onPress={handleSubmit} />

      {certificateAvailable && (
        <Button title="Earn Certificate" onPress={() => console.log('Certificate earned!')} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    height: "100dvh",
    flexGrow: 1
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: 'red',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  instructor: {
    fontSize: 18,
    marginBottom: 5,
  },
  category: {
    fontSize: 18,
    marginBottom: 10,
  },
  courseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 20,
    color: 'red',
  },
  lessonCard: {
    marginBottom: 20,
  },
  lessonTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  lessonEmbed: {
    marginBottom: 10,
  },
  iframe: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  iframeText: {
    color: 'red',
  },
  quizCard: {
    marginBottom: 20,
  },
  quizQuestion: {
    fontSize: 18,
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    backgroundColor: 'lightgray',
    marginBottom: 5,
  },
  optionText: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: 'red', // Change color when clicked
  },
});

export default Player;
