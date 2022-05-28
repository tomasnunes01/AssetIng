import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { ThemeProvider } from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FormButton, FormButtonView } from '../components/login-form.component';
import { theme } from '../theme';
import userService from '../services/UserService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.container.header,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.title,
  },
  text_footer: {
    color: '#000',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -5,
    paddingLeft: 10,
    color: '#000000',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  cpyrgtview: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});

export default function SignInScreen({ navigation }) {
  SignInScreen.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    navigation: PropTypes.object.isRequired,
  };

  const { colors } = useTheme();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const entrar = () => {
    const data = {
      username,
      password,
    };
    setLoading(true);

    userService
      .login(data)
      .then(() => {
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Drawer' }],
        });
      })
      .catch(() => {
        Alert.alert(
          'As credenciais são inválidas',
          'Valide as credenciais e tente novamente',
        );
        setLoading(false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <StatusBar
          backgroundColor={theme.colors.container.header}
          barStyle="light-content"
        />
        <View style={styles.header}>
          <Text style={styles.text_header}>Bem-vindo!</Text>
        </View>
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <Text style={[styles.text_footer]}>Username</Text>
          <View style={styles.action}>
            <MaterialCommunityIcons
              name="account-outline"
              color={colors.text}
              size={20}
              style={{ paddingBottom: 5 }}
            />
            <TextInput
              placeholder="Introduza o username"
              placeholderTextColor="#686868"
              onChangeText={(value) => setUsername(value)}
              maxLength={16}
              style={[styles.textInput]}
              autoCapitalize="none"
            />
          </View>

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}
          >
            Palavra-Passe
          </Text>
          <View style={styles.action}>
            <MaterialCommunityIcons
              name="lock-outline"
              color={colors.text}
              size={20}
              style={{ paddingBottom: 10 }}
            />
            <TextInput
              placeholder="Introduza a palavra-passe"
              placeholderTextColor="#686868"
              onChangeText={(value) => setPassword(value)}
              secureTextEntry
              style={[styles.textInput]}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Por favor contacte um Administrador',
                'Por questões de segurança, deve pedir a um Administrador para efetuar a operação',
              )
            }
          >
            <Text
              style={{ color: theme.colors.button.background, marginTop: 15 }}
            >
              Esqueceu-se da palavra-passe?
            </Text>
          </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {isLoading && (
              <ActivityIndicator
                color={theme.colors.button.background}
                size="large"
              />
            )}
            {!isLoading && (
              <TouchableOpacity
                style={{ width: '65%', marginBottom: '3%' }}
                onPress={() => entrar()}
              >
                <FormButtonView>
                  <FormButton>Entrar</FormButton>
                </FormButtonView>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.cpyrgtview}>
            <MaterialCommunityIcons
              name="copyright"
              size={15}
              style={{ marginHorizontal: 5, paddingTop: 1.5 }}
            />
            <Text>2022 Tomás Nunes</Text>
          </View>
        </Animatable.View>
      </View>
    </ThemeProvider>
  );
}
