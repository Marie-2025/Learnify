import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { API_BASE_URL } from '../config'; // one folder up

const Payment = () => {
  const navigation = useNavigation();

  const [course, setCourse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null); // To track the selected payment method
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [creditCardName, setCreditCardName] = useState('');
  const [creditCardExpiry, setCreditCardExpiry] = useState('');
  const [creditCardSecurityCode, setCreditCardSecurityCode] = useState('');
  const [mtnNumber, setMtnNumber] = useState('');
  const [mtnName, setMtnName] = useState('');
  const [airtelNumber, setAirtelNumber] = useState('');
  const [airtelName, setAirtelName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getCourseData = async () => {
      const courseData = await AsyncStorage.getItem('selectedCourse');
      if (courseData) {
        setCourse(JSON.parse(courseData));
      } else {
        navigation.goBack(); // If no course, go back to Explore screen
      }
    };

    getCourseData();
  }, [navigation]);

  const totalDiscountedPrice = course
    ? (parseFloat(course.price) - parseFloat(course.discount)).toFixed(2)
    : '0.00';


    const handlePayment = async () => {
      try {
        Alert.alert('You have successfully purchased the course.');
        
        const paymentId = uuid.v4(); // ✅ Use this instead
    
        let paymentDetails = {
          id: paymentId,
          method: paymentMethod,
          course: course?.courseTitle,
          amount: parseFloat(paymentAmount).toFixed(2),
        };
      
        // Attach payer info based on method
        if (paymentMethod === 'creditCard') {
          paymentDetails = {
            ...paymentDetails,
            payerName: creditCardName,
            payerNumber: creditCardNumber,
            expiry: creditCardExpiry,
            securityCode: creditCardSecurityCode,
          };
        } else if (paymentMethod === 'mtn') {
          paymentDetails = {
            ...paymentDetails,
            payerName: mtnName,
            payerNumber: mtnNumber,
          };
        } else if (paymentMethod === 'airtel') {
          paymentDetails = {
            ...paymentDetails,
            payerName: airtelName,
            payerNumber: airtelNumber,
          };
        }
      
        try {
          const response = await fetch(`${API_BASE_URL}/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentDetails),
          });
      
          const data = await response.json();
      
          if (response.ok && data.success) {
            navigation.navigate('PaymentSuccess');
          } else {
            setErrorMessage(data.message || 'Payment failed. Try again.');
          }
        } catch (error) {
          console.error('Network Error:', error);
          setErrorMessage('Network error. Try again later.');
        }
        
      } catch (err) {
        console.error('Payment Error:', err);
      }

    };
    
  if (!course) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment for {course.courseTitle}</Text>

      {/* Payment Method Buttons */}
      <View style={styles.paymentMethodContainer}>
        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === 'creditCard' && styles.selectedButton]}
          onPress={() => setPaymentMethod('creditCard')}
        >
          <Text style={styles.paymentButtonText}>Credit Card</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === 'mtn' && styles.selectedButton]}
          onPress={() => setPaymentMethod('mtn')}
        >
          <Text style={styles.paymentButtonText}>MTN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === 'airtel' && styles.selectedButton]}
          onPress={() => setPaymentMethod('airtel')}
        >
          <Text style={styles.paymentButtonText}>Airtel</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Form Based on Payment Method */}
      {paymentMethod === 'creditCard' && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Credit Card Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your credit card number"
            value={creditCardNumber}
            onChangeText={setCreditCardNumber}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Name on Card:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name on card"
            value={creditCardName}
            onChangeText={setCreditCardName}
          />

          <Text style={styles.label}>Expiry Date:</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            value={creditCardExpiry}
            onChangeText={setCreditCardExpiry}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Security Code:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter security code"
            value={creditCardSecurityCode}
            onChangeText={setCreditCardSecurityCode}
            keyboardType="numeric"
          />
          
        <Text style={styles.label}>Amount to Pay:</Text>
        <TextInput
            style={styles.input}
            placeholder={`$${totalDiscountedPrice}`}
            value={paymentAmount}
            onChangeText={setPaymentAmount}
            keyboardType="numeric"
        />
        </View>
      )}

      {paymentMethod === 'mtn' && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>MTN Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your MTN number"
            value={mtnNumber}
            onChangeText={setMtnNumber}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={mtnName}
            onChangeText={setMtnName}
          />
            
        <Text style={styles.label}>Amount to Pay:</Text>
        <TextInput
            style={styles.input}
            placeholder={`$${totalDiscountedPrice}`}
            value={paymentAmount}
            onChangeText={setPaymentAmount}
            keyboardType="numeric"
        />
        </View>
      )}

      {paymentMethod === 'airtel' && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Airtel Number:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Airtel number"
            value={airtelNumber}
            onChangeText={setAirtelNumber}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={airtelName}
            onChangeText={setAirtelName}
          />
          
        <Text style={styles.label}>Amount to Pay:</Text>
        <TextInput
            style={styles.input}
            placeholder={`$${totalDiscountedPrice}`}
            value={paymentAmount}
            onChangeText={setPaymentAmount}
            keyboardType="numeric"
        />
        </View>
      )}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
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
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  paymentButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    margin: 5,
  },
  selectedButton: {
    backgroundColor: '#007BFF',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  payButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Payment;
