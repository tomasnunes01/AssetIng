import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import AddComputador from './AddComputador';
import ListComputador from './ListComputador';

const Tab = createBottomTabNavigator();

const tabBarIconAdd = ({ color, size }) => (
  <MaterialCommunityIcons name="plus" color={color} size={size} />
);
const tabBarIconEdit = ({ color, size }) => (
  <MaterialCommunityIcons name="laptop" color={color} size={size} />
);

export function SoftwareScreen() {
  const [isAdmin, setAdmin] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem('MYGRUPO').then((grupo) => {
      if (grupo === 'Administrador') {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Softwares"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.button.background,
        headerShown: false,
      }}
    >
      {isAdmin && (
        <Tab.Screen
          name="Adicionar Software"
          component={AddComputador}
          options={{
            tabBarLabel: 'Adicionar Software',
            tabBarIcon: tabBarIconAdd,
          }}
        />
      )}
      <Tab.Screen
        name="Software"
        component={ListComputador}
        options={{
          tabBarLabel: 'Software',
          tabBarIcon: tabBarIconEdit,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Software() {
  return (
    <NavigationContainer>
      <SoftwareScreen />
    </NavigationContainer>
  );
}
