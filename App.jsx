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
import AddComputador from './src/screens/computador/AddComputador';
import { ComputadorScreen } from './src/screens/computador/Computadores';
import ListComputador from './src/screens/computador/ListComputador';
import ChangeComputador from './src/screens/computador/ChangeComputador';
import ComputadorDetails from './src/screens/computador/ComputadorDetails';
import RelatorioScreen from './src/screens/relatorio/Relatorio';
import { SoftwareScreen } from './src/screens/software/Softwares';
import ListSoftware from './src/screens/software/ListSoftware';
import ChangeSoftware from './src/screens/software/ChangeSoftware';
import AddSoftware from './src/screens/software/AddSoftware';
import SoftwareDetails from './src/screens/software/SoftwareDetails';

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
      <Drawer.Screen name="Software" component={SoftwareScreen} />
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
      <Stack.Screen name="AddSoftware" component={AddSoftware} />
      <Stack.Screen name="ListSoftware" component={ListSoftware} />
      <Stack.Screen name="ChangeSoftware" component={ChangeSoftware} />
      <Stack.Screen name="SoftwareDetails" component={SoftwareDetails} />
      <Stack.Screen name="RelatorioScreen" component={RelatorioScreen} />
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
