import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Input, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Picker } from '@react-native-picker/picker';
import { ThemeProvider } from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../theme';
import userService from '../../services/UserService';
import EscritorioService from '../../services/EscritorioService';
import {
  FormButton,
  FormButtonView,
} from '../../components/login-form.component';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.container.header,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: -30,
    paddingBottom: 30,
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
  picker: {
    color: '#000000',
    marginLeft: '1%',
    width: '50%',
  },
  checkbox: {
    marginLeft: '7%',
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

export default function AccountDetails({ navigation }) {
  AccountDetails.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    navigation: PropTypes.object.isRequired,
  };
  const { colors } = useTheme();

  const [morada, setMorada] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [helpdesk, setHelpdesk] = useState(null);
  const [errorMorada, setErrorMorada] = useState(null);
  const [errorTipo, setErrorTipo] = useState(null);
  const [errorHelpdesk, setErrorHelpdesk] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isRendering, setRendering] = useState(true);
  const [isChecked, setChecked] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [pickerValueHolder, setPickerValueHolder] = useState(null);

  const emailInput = React.createRef();
  const nomeInput = React.createRef();
  const apelidoInput = React.createRef();
  const passwordInput = React.createRef();
  const usernameInput = React.createRef();
  const pickerInput = React.createRef();

  const reEmail =
    /^(?=.{3,30}$)(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const reNome =
    /^(?=.{3,30}$)[a-zA-Z]+((['-ç`´~^][a-zA-Z ])+[ a-zA-Z ]?[a-zA-Z ]*\b)*$/;
  const reUsername =
    /^(?=.{3,16}$)[a-zA-Z]+((['-ç`´~^][a-zA-Z ])+[ a-zA-Z ]?[a-zA-Z ]*\b)*$/;
  const rePass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,255}$/;

  useEffect(async () => {
    try {
      const response = await EscritorioService.findAll();
      setDataSource(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    AsyncStorage.getItem('ID').then((fromAsyncId) => {
      setID(fromAsyncId);
      userService.findByID(fromAsyncId).then((response) => {
        setPickerValueHolder(response.cod_escritorio);
        setEmail(response.email);
        setNome(response.nome);
        setApelido(response.apelido);
        setUsername(response.username);
        setGrupo(response.grupo);
        if (response.grupo === 'Administrador') setChecked(true);
        setRendering(false);
      });
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
    if (!pickerValueHolder) {
      if (!erro) {
        pickerInput.current.focus();
      }
      erro = true;
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
        grupo,
        username,
        pass: password,
        cod_escritorio: pickerValueHolder,
      };
      userService
        .atualizarConta(data)
        .then((response) => {
          setLoading(false);
          const titulo = response.data.status ? 'Sucesso' : 'Erro';
          Alert.alert(titulo, response.data.mensagem);
          navigation.goBack();
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
      {isRendering && (
        <ActivityIndicator
          color={theme.colors.button.background}
          size="large"
          style={{ paddingTop: '80%' }}
        />
      )}
      {!isRendering && (
        <KeyboardAvoidingView
          behaviour={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <StatusBar
            backgroundColor={theme.colors.container.header}
            barStyle="light-content"
          />
          <View style={styles.header}>
            <Text style={styles.text_header}>Alterar Conta</Text>
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
                flex: 3,
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <Input
                label="Email"
                placeholder="Email"
                placeholderTextColor="#686868"
                onChangeText={(value) => {
                  setEmail(value);
                  setErrorEmail(null);
                }}
                value={email}
                keyboardType="email-address"
                inputContainerStyle={styles.input}
                autoCapitalize="none"
                errorMessage={errorEmail}
                errorStyle={styles.errorStyle}
                ref={emailInput}
                maxLength={45}
              />
              <View style={{ flexDirection: 'row' }}>
                <Input
                  label="Nome"
                  placeholder="Nome"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setNome(value);
                    setErrorNome(null);
                  }}
                  value={nome}
                  inputContainerStyle={styles.inputNome}
                  autoCapitalize="words"
                  errorMessage={errorNome}
                  errorStyle={styles.errorStyle}
                  ref={nomeInput}
                  maxLength={45}
                />
                <Input
                  label="Apelido"
                  labelStyle={{ marginLeft: '-50%' }}
                  placeholder="Apelido"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setApelido(value);
                    setErrorApelido();
                  }}
                  value={apelido}
                  inputContainerStyle={styles.inputApelido}
                  autoCapitalize="words"
                  errorMessage={errorApelido}
                  errorStyle={styles.erroApelido}
                  ref={apelidoInput}
                  maxLength={45}
                />
              </View>
              <Input
                label="Username"
                placeholder="Username"
                placeholderTextColor="#686868"
                onChangeText={(value) => {
                  setUsername(value);
                  setErrorUsername(null);
                }}
                value={username}
                inputContainerStyle={styles.input}
                autoCapitalize="none"
                errorMessage={errorUsername}
                errorStyle={styles.errorStyle}
                ref={usernameInput}
                maxLength={16}
              />
              <Input
                label="Palavra-passe"
                placeholder="Palavra-passe"
                placeholderTextColor="#686868"
                onChangeText={(value) => {
                  setPassword(value);
                  setErrorPassword(null);
                }}
                value={password}
                secureTextEntry
                inputContainerStyle={styles.input}
                autoCapitalize="none"
                errorMessage={errorPassword}
                errorStyle={styles.errorStyle}
                ref={passwordInput}
                maxLength={255}
              />
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: '-2%',
                  paddingHorizontal: '1%',
                }}
              >
                <Picker
                  selectedValue={pickerValueHolder}
                  onValueChange={(itemValue) => setPickerValueHolder(itemValue)}
                  mode="dropdown"
                  style={styles.picker}
                  ref={pickerInput}
                >
                  {!pickerValueHolder && <Picker.Item label="Selecione" />}
                  {dataSource.map((item) => (
                    <Picker.Item
                      label={item.morada}
                      value={item.cod_escritorio}
                      key={item.cod_escritorio}
                    />
                  ))}
                </Picker>
                <BouncyCheckbox
                  size={25}
                  fillColor={theme.colors.button.background}
                  text="Administrador"
                  textStyle={{
                    textDecorationLine: 'none',
                  }}
                  isChecked={isChecked}
                  style={styles.checkbox}
                  iconStyle={{ borderColor: 'black' }}
                  onPress={(state) => {
                    if (state) {
                      setGrupo('Administrador');
                    } else {
                      setGrupo('Utilizador');
                    }
                  }}
                />
              </View>
            </View>
            <View
              style={{
                alignItems: 'center',
                flex: 0.5,
                marginBottom: 10,
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
            </View>
          </Animatable.View>
        </KeyboardAvoidingView>
      )}
    </ThemeProvider>
  );
}
