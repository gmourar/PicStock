import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';


import HomeScreen from './src/screens/HomeScreen.js';
import ScannerScreen from './src/screens/ScannerScreen.js';
import ItemsScreen from './src/screens/ItemsScreen';
import UsersScreen from './src/screens/UsersScreen.js';
import AdminScreen from './src/screens/AdminScreen.js';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Items') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0000',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{ title: 'Scanner' }}
      />
      <Tab.Screen 
        name="Items" 
        component={ItemsScreen}
        options={{ title: 'Itens' }}
      />
      <Tab.Screen 
        name="Users" 
        component={UsersScreen}
        options={{ title: 'Usuários' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <TabNavigator />
    </NavigationContainer>
  );
}