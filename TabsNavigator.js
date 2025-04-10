import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Or use 'react-native-vector-icons/Ionicons' for non-Expo users
import Course from './screens/Tabs1/Course';
import Chat from './screens/Tabs1/Chat';
import Find from './screens/Tabs1/Find';
import Profile from './screens/Tabs1/Profile';

const Tab = createBottomTabNavigator();

const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Course') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Find') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'red',
        inactiveTintColor: 'black',
      }}
    >
      <Tab.Screen name="Course" component={Course} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Find" component={Find} />
      <Tab.Screen name="Profile" component={Profile} />

    </Tab.Navigator>
  );
};

export default TabsNavigator;
