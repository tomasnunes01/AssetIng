import 'react-native-gesture-handler';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AddUser } from './AddUser';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';

const logout = async (navigation) => {
  await AsyncStorage.clear();
  navigation.reset({
    index: 0,
    routes: [{ name: 'Login' }],
  });
};

const changeAccount = async (navigation) => {
  navigation.navigate('ChangeAccount');
};

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('../../assets/logo2.png')}
        style={{ marginBottom: 20 }}
      />
      <TouchableOpacity
        onPress={() => changeAccount(navigation)}
        style={styles.button}
      >
        <Text style={styles.text}>Minha Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => logout(navigation)}
        style={styles.button}
      >
        <Text style={styles.text}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

function Sair({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export const HomeScreen = () => {
  const [isAdmin, setAdmin] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem('GRUPO').then((grupo) => {
      if (grupo == 'Administrador') {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: '#28a745',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Home}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Adicionar Conta"
          component={AddUser}
          options={{
            tabBarLabel: 'Adicionar Conta',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-plus"
                color={color}
                size={size}
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Editar Conta"
        component={Sair}
        options={{
          tabBarLabel: 'Editar conta',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-edit"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.button.background,
    padding: '1.5%',
    borderRadius: 100,
    marginBottom: 7,
    width: '30%',
  },
  text: {
    color: 'ivory',
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>
  );
}
