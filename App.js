import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './screens/WelcomeScreen';
import Page1 from './screens/Page1';
import Page2 from './screens/Page2';
import Page3 from './screens/Page3';
import Loading from './screens/Loading';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Process from './screens/Process';
import SetUpCourse from './screens/SetUpCourse';
import MyCourse from './screens/MyCourse';
import Enroll from './screens/Enroll';
import Payment from './screens/Payment';
import PaymentSuccess from './screens/PaymentSuccess';
import Player from './screens/Player';

import TabsNavigator from './TabsNavigator';       // Tabs1
import Tabs2Navigator from './Tabs2Navigator';     // Tabs2 <-- Add this

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">

        {/* Tab Navigators */}
        <Stack.Screen name="Tabs" component={TabsNavigator} />
        <Stack.Screen name="Tabs2" component={Tabs2Navigator} />

        {/* Other screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Page1" component={Page1} />
        <Stack.Screen name="Page2" component={Page2} />
        <Stack.Screen name="Page3" component={Page3} />
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Process" component={Process} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="SetUpCourse" component={SetUpCourse} />
        <Stack.Screen name="MyCourse" component={MyCourse} />
        <Stack.Screen name="Enroll" component={Enroll} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        <Stack.Screen name="Player" component={Player} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
