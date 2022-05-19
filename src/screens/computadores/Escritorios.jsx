import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import ListEscritorio from './ListEscritorio';
import AddEscritorio from './AddComputador';

const Tab = createBottomTabNavigator();

const tabBarIconAdd = ({ color, size }) => (
  <MaterialCommunityIcons name="home-plus" color={color} size={size} />
);
const tabBarIconEdit = ({ color, size }) => (
  <MaterialCommunityIcons name="home-group" color={color} size={size} />
);

export function EscritorioScreen() {
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
      initialRouteName="Escritorios"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.button.background,
        headerShown: false,
      }}
    >
      {isAdmin && (
        <Tab.Screen
          name="Adicionar Escritorio"
          component={AddEscritorio}
          options={{
            tabBarLabel: 'Adicionar Escritorio',
            tabBarIcon: tabBarIconAdd,
          }}
        />
      )}
      <Tab.Screen
        name="Escritorios"
        component={ListEscritorio}
        options={{
          tabBarLabel: 'Escritórios',
          tabBarIcon: tabBarIconEdit,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Escritorio() {
  return (
    <NavigationContainer>
      <EscritorioScreen />
    </NavigationContainer>
  );
}
