import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { Input, Text } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useTheme } from 'react-native-paper';
import { FormButton, FormButtonView } from '../components/login-form.component';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '../theme';
import userService from '../services/UserService';
import { Picker } from '@react-native-picker/picker';
import EscritorioService from '../services/EscritorioService';
import Config from '../../util/Config';
import escritorioService from '../services/EscritorioService';

export const AddUser = ({ navigation }) => {
  const { colors } = useTheme();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [nome, setNome] = useState(null);
  const [apelido, setApelido] = useState(null);
  const [grupo, setGrupo] = useState('Utilizador');
  const [username, setUsername] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorNome, setErrorNome] = useState(null);
  const [errorApelido, setErrorApelido] = useState(null);
  const [errorUsername, setErrorUsername] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isRendering, setRendering] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [pickerValueHolder, setPickerValueHolder] = useState(' ');

  const emailInput = React.createRef();
  const nomeInput = React.createRef();
  const apelidoInput = React.createRef();
  const contactoInput = React.createRef();
  const passwordInput = React.createRef();
  const usernameInput = React.createRef();

  const reEmail =
    /^(?=.{3,30}$)(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const reNome =
    /^(?=.{3,30}$)[a-zA-Z]+((['-ç`´~^][a-zA-Z ])+[ a-zA-Z ]?[a-zA-Z ]*\b)*$/;
  const reUsername =
    /^(?=.{3,16}$)[a-zA-Z]+((['-ç`´~^][a-zA-Z ])+[ a-zA-Z ]?[a-zA-Z ]*\b)*$/;
  const rePass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,255}$/;
  const reContactoPT =
    /^(\+351)?(?:9[1-36][0-9]|2[12][0-9]|2[35][1-689]|24[1-59]|26[1-35689]|27[1-9]|28[1-69]|29[1256])[0-9]{6}$/;
  const reContactoUK =
    /^\s*((0044[ ]?|0)[ ]?20[ ]?[7,8]{1}?[ ]?[1-9]{1}[0-9]{2}[ ]?[0-9]{4})|((0044[ ]?|0[1-8]{1})[0-9]{1,2}[ ]?[1-9]{1}[0-9]{2}[ ]?([0-9]{6}|[0-9]{5}|[0-9]{4}))|(0[1-8]{1}[0-9]{3}[ ]?[1-9]{1}[0-9]{2}[ ]?[0-9]{2,3})|(0800[ ]?([1-9]{3}[ ]?[1-9]{4}|[1-9]{6}|[1-9]{4}))|(09[0-9]{1}[ ]?[0-9]{1}[ ]?([1-9]{4}|[1-9]{6}|[1-9]{3}[ ]?[1-9]{4}))\s*$/;
  const reContactoBR =
    /(?:^\([0]?[1-9]{2}\)|^[0]?[1-9]{2}[\.-\s]?)[9]?[1-9]\d{3}[\.-\s]?\d{4}$/;

  useEffect(async () => {
    try {
      const response = await EscritorioService.findAll();
      setRendering(false);
      setDataSource(response);
    } catch (error) {
      console.err(error);
    }
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
      setErrorPassword(
        'Insira uma palavra-passe com pelo menos 8 caracteres, que inclua maiusculas, minusculas e números.',
      );
      erro = true;
      passwordInput.current.shake();
      passwordInput.current.focus();
    }
    return !erro;
  };

  const guardar = () => {
    if (validar()) {
      setLoading(true);
      const cod_escritorio = escritorioService.findOne(pickerValueHolder);

      let data = {
        email: email,
        nome: nome,
        apelido: apelido,
        grupo: grupo,
        username: username,
        pass: password,
        cod_escritorio: cod_escritorio,
      };

      userService
        .registar(data)
        .then((response) => {
          setLoading(false);
          const titulo = response.data.status ? 'Sucesso' : 'Erro';
          Alert.alert(titulo, response.data.mensagem);
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert('Erro:', 'error');
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <KeyboardAvoidingView
        behaviour={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar backgroundColor="#28a745" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Adicionar utilizador</Text>
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
          {isRendering && (
            <ActivityIndicator color={'#28a745'} size={'large'} />
          )}
          {!isRendering && (
            <>
              <View
                style={{
                  flex: 3,
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
                />
                <Input
                  placeholder="Palavra-passe"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setPassword(value);
                    setErrorPassword(null);
                  }}
                  secureTextEntry={true}
                  inputContainerStyle={styles.input}
                  autoCapitalize="none"
                  errorMessage={errorPassword}
                  errorStyle={styles.errorStyle}
                  ref={passwordInput}
                  maxLength={255}
                />
                <View style={{ flexDirection: 'row' }}>
                  <Picker
                    selectedValue={pickerValueHolder}
                    onValueChange={(itemValue, itemIndex) =>
                      setPickerValueHolder(itemValue)
                    }
                    mode={'dropdown'}
                    style={styles.picker}
                  >
                    {dataSource.map((item, key) => (
                      <Picker.Item
                        label={item.morada}
                        value={item.cod_escritorio}
                        key={key}
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
                    style={styles.checkbox}
                    iconStyle={{ borderColor: 'black' }}
                    onPress={(isChecked) => {
                      if (isChecked) {
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
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {isLoading && (
                  <ActivityIndicator color={'#28a745'} size={'large'} />
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
                  <Text>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animatable.View>
      </KeyboardAvoidingView>
    </ThemeProvider>
  );
};

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
    fontWeight: 'bold',
    fontSize: 30,
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
