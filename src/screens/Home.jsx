import 'react-native-gesture-handler';
import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import AddUser from './user/AddUser';
import ListUsers from './user/ListUsers';
import { theme } from '../theme';
import MenuButton from '../components/button.component';

const logo = require('../../assets/logo2.png');

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
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 85 : 60,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
});

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
  Home.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    navigation: PropTypes.object.isRequired,
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* <TouchableOpacity
        style={{
          marginTop: Platform.OS === 'ios' ? 85 : 60,
          borderWidth: 1,
          marginLeft: 15,
          flex: 1,
        }}
        onPress={() => navigation.openDrawer()}
      >
        <MenuButton />
      </TouchableOpacity> */}

      <View style={styles.header}>
        <TouchableOpacity
          style={{
            flex: 1,
          }}
          onPress={() => navigation.openDrawer()}
        >
          <MenuButton />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 5,
          marginTop: -170,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image source={logo} style={{ marginBottom: 20 }} />
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
    </View>
  );
}

const Tab = createBottomTabNavigator();

const tabBarIconHome = ({ color, size }) => (
  <MaterialCommunityIcons name="home" color={color} size={size} />
);
const tabBarIconAdd = ({ color, size }) => (
  <MaterialCommunityIcons name="account-plus" color={color} size={size} />
);
const tabBarIconEdit = ({ color, size }) => (
  <MaterialCommunityIcons name="account-edit" color={color} size={size} />
);

export function HomeScreen() {
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
      initialRouteName="Feed"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.button.background,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Home}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: tabBarIconHome,
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Adicionar Conta"
          component={AddUser}
          options={{
            tabBarLabel: 'Adicionar Conta',
            tabBarIcon: tabBarIconAdd,
          }}
        />
      )}
      <Tab.Screen
        name="Contas"
        component={ListUsers}
        options={{
          tabBarLabel: 'contas',
          tabBarIcon: tabBarIconEdit,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>
  );
}
