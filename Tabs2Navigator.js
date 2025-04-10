import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens from Tabs2 folder
import Explore from './screens/Tabs2/Explore';
import Chat2 from './screens/Tabs2/Chat2';
import Progress from './screens/Tabs2/Progress';
import Profile2 from './screens/Tabs2/Profile2';

const Tab = createBottomTabNavigator();

const Tabs2Navigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Chat2') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Profile2') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Chat2" component={Chat2} />
      <Tab.Screen name="Progress" component={Progress} />
      <Tab.Screen name="Profile2" component={Profile2} />
    </Tab.Navigator>
  );
};

export default Tabs2Navigator;
