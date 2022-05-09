import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './src/screens/Login';
import { HomeScreen } from './src/screens/Home';
import AddUser from './src/screens/user/AddUser';
import { MyAccountUpdate } from './src/screens/user/myAccountUpdate';
import ListUsers from './src/screens/user/ListUsers';
import AccountDetails from './src/screens/user/AccountDetails';
import ChangeAccount from './src/screens/user/ChangeAccount';
import ListEscritorio from './src/screens/escritorio/ListEscritorio';
import { theme } from './src/theme';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: theme.colors.button.background,
        drawerActiveTintColor: '#fff',
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen name="Utilizadores" component={HomeScreen} />
      <Drawer.Screen name="Escritórios" component={ListEscritorio} />
    </Drawer.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Drawer" component={MyDrawer} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddUser" component={AddUser} />
      <Stack.Screen name="ChangeAccount" component={MyAccountUpdate} />
      <Stack.Screen name="ListUsers" component={ListUsers} />
      <Stack.Screen name="AccountDetails" component={AccountDetails} />
      <Stack.Screen name="ChangeUserAccount" component={ChangeAccount} />
      <Stack.Screen name="ListPlaces" component={ListEscritorio} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
