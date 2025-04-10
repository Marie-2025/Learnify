import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const Page2 = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.replace('Page3')} // Navigate to Page2.js when clicked
    >
      {/* Container for Image */}
      <View style={styles.imageContainer}>
        <Image source={require('../assets/page2_image.jpg')} style={styles.image} />
      </View>

      {/* Circles at the Bottom */}
      <View style={styles.circlesContainer}>
        <View style={[styles.circle, { opacity: 0.5 }]} />
        <View style={[styles.circle, { opacity: 1 }]} />
        <View style={[styles.circle, { opacity: 0.5 }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f40000', // Background color red
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: '70%', // Image container width
    height: 525, // Height greater than width
    backgroundColor: '#fff', // Container background color
    borderRadius: 20, // Rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30, // Spacing below the container
  },
  image: {
    width: '100%', // Make image fill the container width
    height: 525, // Make image fill the container height
    borderRadius: 20, // Rounded corners for the image
  },
  circlesContainer: {
    flexDirection: 'row', // Align circles horizontally
    justifyContent: 'center', // Center circles
    alignItems: 'center',
    width: '100%',
  },
  circle: {
    marginTop: 50,
    width: 10,
    height: 10,
    borderRadius: 10, // Make it circular
    marginHorizontal: 15, // Space between circles
    backgroundColor: '#fff'
  },
});

export default Page2;
