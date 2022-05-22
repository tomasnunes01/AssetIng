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
import { EscritorioScreen } from './src/screens/escritorio/Escritorios';
import AddEscritorio from './src/screens/escritorio/AddEscritorio';
import EscritorioDetails from './src/screens/escritorio/EscritorioDetails';
import ChangeEscritorio from './src/screens/escritorio/ChangeEscritorio';
import AddComputador from './src/screens/computadores/AddComputador';
import { ComputadorScreen } from './src/screens/computadores/Computadores';
import ListComputador from './src/screens/computadores/ListComputador';
import ChangeComputador from './src/screens/computadores/ChangeComputador';
import ComputadorDetails from './src/screens/computadores/ComputadorDetails';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Utilizadores"
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: theme.colors.button.background,
        drawerActiveTintColor: '#fff',
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen name="Conta" component={HomeScreen} />
      <Drawer.Screen name="Computador" component={ComputadorScreen} />
      <Drawer.Screen name="Escritório" component={EscritorioScreen} />
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
      <Stack.Screen name="AddEscritorio" component={AddEscritorio} />
      <Stack.Screen name="EscritorioDetails" component={EscritorioDetails} />
      <Stack.Screen name="ChangeEscritorio" component={ChangeEscritorio} />
      <Stack.Screen name="AddComputador" component={AddComputador} />
      <Stack.Screen name="ListComputers" component={ListComputador} />
      <Stack.Screen name="ChangeComputador" component={ChangeComputador} />
      <Stack.Screen name="ComputadorDetails" component={ComputadorDetails} />
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
