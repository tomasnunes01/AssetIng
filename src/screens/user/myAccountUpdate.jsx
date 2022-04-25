import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Input, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { ThemeProvider } from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FormButton,
  FormButtonView,
} from '../../components/login-form.component';
import { theme } from '../../theme';
import userService from '../../services/UserService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#28a745',
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
    color: '#05375a',
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
  input: {
    paddingLeft: 1,
    color: '#000000',
    borderBottomWidth: 1,
  },
  inputNome: {
    paddingLeft: 1,
    color: '#000000',
    borderBottomWidth: 1,
    width: '45%',
  },
  inputApelido: {
    paddingLeft: 1,
    color: '#000000',
    borderBottomWidth: 1,
    width: '45%',
    marginLeft: '-50%',
  },
  errorStyle: {
    marginLeft: 0,
  },
  erroApelido: {
    marginLeft: '-50%',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
});

export function MyAccountUpdate({ navigation }) {
  MyAccountUpdate.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    navigation: PropTypes.object.isRequired,
  };
  const { colors } = useTheme();

  const [id, setID] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [nome, setNome] = useState(null);
  const [apelido, setApelido] = useState(null);
  const [username, setUsername] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorNome, setErrorNome] = useState(null);
  const [errorApelido, setErrorApelido] = useState(null);
  const [errorUsername, setErrorUsername] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const emailInput = React.createRef();
  const nomeInput = React.createRef();
  const apelidoInput = React.createRef();
  const passwordInput = React.createRef();
  const usernameInput = React.createRef();

  const reEmail =
    /^(?=.{3,30}$)(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const reNome =
    /^(?=.{3,30}$)[a-zA-Z]+((['-ç`´~^][a-zA-Z ])+[ a-zA-Z ]?[a-zA-Z ]*\b)*$/;
  const reUsername =
    /^(?=.{3,16}$)[a-zA-Z]+((['-ç`´~^][a-zA-Z ])+[ a-zA-Z ]?[a-zA-Z ]*\b)*$/;
  const rePass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,255}$/;

  useEffect(() => {
    AsyncStorage.getItem('EMAIL').then((fromAsyncEmail) => {
      setEmail(fromAsyncEmail);
    });
    AsyncStorage.getItem('NOME').then((fromAsyncNome) => {
      setNome(fromAsyncNome);
    });
    AsyncStorage.getItem('APELIDO').then((fromAsyncApelido) => {
      setApelido(fromAsyncApelido);
    });
    AsyncStorage.getItem('USERNAME').then((fromAsyncUsername) => {
      setUsername(fromAsyncUsername);
    });
    AsyncStorage.getItem('ID').then((fromAsyncId) => {
      setID(fromAsyncId);
    });
  }, []);

  const validar = () => {
    let erro = false;
    setErrorEmail(null);
    setErrorNome(null);
    setErrorApelido(null);
    setErrorUsername(null);
    setErrorPassword(null);

    if (!reEmail.test(String(email).toLowerCase())) {
      setErrorEmail('Preencha o campo de email corretamente');
      erro = true;
      emailInput.current.shake();
      emailInput.current.focus();
    }
    if (!reNome.test(String(nome)) || nome == null) {
      setErrorNome('O campo deve conter o nome');
      erro = true;
      nomeInput.current.shake();
      nomeInput.current.focus();
    }
    if (!reNome.test(String(apelido)) || apelido == null) {
      setErrorApelido('O campo deve conter o apelido');
      erro = true;
      apelidoInput.current.shake();
      apelidoInput.current.focus();
    }
    if (!reUsername.test(String(username))) {
      setErrorUsername('O username não é válido');
      erro = true;
      usernameInput.current.shake();
      usernameInput.current.focus();
    }
    if (!rePass.test(String(password))) {
      if (password != null) {
        setErrorPassword(
          'Insira uma palavra-passe com pelo menos 8 caracteres, que inclua maiusculas, minusculas e números.',
        );
        erro = true;
        passwordInput.current.shake();
        passwordInput.current.focus();
      }
    }
    return !erro;
  };

  const guardar = () => {
    if (validar()) {
      setLoading(true);

      const data = {
        id,
        email,
        nome,
        apelido,
        username,
        pass: password,
      };

      userService
        .atualizar(data)
        .then((response) => {
          setLoading(false);
          const titulo = response.data.status ? 'Sucesso' : 'Erro';
          Alert.alert(titulo, response.data.mensagem);
        })
        .catch(() => {
          setLoading(false);
          Alert.alert(
            'Erro',
            'Ocorreu um erro, por favor tente novamente mais tarde',
          );
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <KeyboardAvoidingView
        behaviour={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar backgroundColor="#28a745" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Alteração da conta</Text>
        </View>
        <Animatable.View
          animation="fadeInUpBig"
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <View
            style={{
              flex: 2,
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Input
              placeholder="Email"
              placeholderTextColor="#686868"
              onChangeText={(value) => {
                setEmail(value);
                setErrorEmail(null);
              }}
              keyboardType="email-address"
              inputContainerStyle={styles.input}
              autoCapitalize="none"
              errorMessage={errorEmail}
              errorStyle={styles.errorStyle}
              ref={emailInput}
              maxLength={45}
              defaultValue={email}
            />
            <View style={{ flexDirection: 'row' }}>
              <Input
                placeholder="Nome"
                placeholderTextColor="#686868"
                onChangeText={(value) => {
                  setNome(value);
                  setErrorNome(null);
                }}
                inputContainerStyle={styles.inputNome}
                autoCapitalize="words"
                errorMessage={errorNome}
                errorStyle={styles.errorStyle}
                ref={nomeInput}
                maxLength={45}
                defaultValue={nome}
              />
              <Input
                placeholder="Apelido"
                placeholderTextColor="#686868"
                onChangeText={(value) => {
                  setApelido(value);
                  setErrorApelido();
                }}
                inputContainerStyle={styles.inputApelido}
                autoCapitalize="words"
                errorMessage={errorApelido}
                errorStyle={styles.erroApelido}
                ref={apelidoInput}
                maxLength={45}
                defaultValue={apelido}
              />
            </View>
            <Input
              placeholder="Username"
              placeholderTextColor="#686868"
              onChangeText={(value) => {
                setUsername(value);
                setErrorUsername(null);
              }}
              inputContainerStyle={styles.input}
              autoCapitalize="none"
              errorMessage={errorUsername}
              errorStyle={styles.errorStyle}
              ref={usernameInput}
              maxLength={16}
              defaultValue={username}
            />
            <Input
              placeholder="Palavra-passe"
              placeholderTextColor="#686868"
              onChangeText={(value) => {
                setPassword(value);
                setErrorPassword(null);
              }}
              secureTextEntry
              inputContainerStyle={styles.input}
              autoCapitalize="none"
              errorMessage={errorPassword}
              errorStyle={styles.errorStyle}
              ref={passwordInput}
              maxLength={255}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              flex: 2,
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
                onPress={() => guardar()}
              >
                <FormButtonView>
                  <FormButton>Guardar</FormButton>
                </FormButtonView>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: '35%',
                alignItems: 'center',
              }}
            >
              <Text>Voltar</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </KeyboardAvoidingView>
    </ThemeProvider>
  );
}

export default MyAccountUpdate;
