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

export default function ChangeEscritorio({ navigation }) {
  ChangeEscritorio.propTypes = {
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
  const [ID, setID] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isRendering, setRendering] = useState(true);

  const moradaInput = React.createRef();
  const tipoInput = React.createRef();
  const helpdeskInput = React.createRef();

  const reMorada = /.{3,100}/;
  const reTipo = /.{3,45}/;
  const reHelpdesk =
    /^(?=.{3,30}$)(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(async () => {
    AsyncStorage.getItem('ID').then((fromAsyncId) => {
      setID(fromAsyncId);
      EscritorioService.findByID(fromAsyncId).then((response) => {
        setMorada(response.morada);
        setTipo(response.tipo);
        setHelpdesk(response.helpdesk);
        setRendering(false);
      });
    });
  }, []);

  const validar = () => {
    let erro = false;
    setErrorMorada(null);
    setErrorTipo(null);
    setErrorHelpdesk(null);

    if (!reMorada.test(String(morada))) {
      setErrorMorada('Preencha o campo morada corretamente');
      erro = true;
      moradaInput.current.shake();
      moradaInput.current.focus();
    }
    if (!reTipo.test(String(tipo))) {
      setErrorTipo('Preencha o campo tipo corretamente');
      erro = true;
      tipoInput.current.shake();
      tipoInput.current.focus();
    }
    if (!reHelpdesk.test(String(helpdesk))) {
      setErrorHelpdesk('Introduza um email de contacto');
      erro = true;
      helpdeskInput.current.shake();
      helpdeskInput.current.focus();
    }
    return !erro;
  };

  const guardar = () => {
    if (validar()) {
      setLoading(true);

      const data = {
        cod_escritorio: ID,
        tipo,
        morada,
        helpdesk,
      };

      EscritorioService.atualizar(data)
        .then((response) => {
          setLoading(false);
          const titulo = response.data.status ? 'Sucesso' : 'Erro';
          Alert.alert(titulo, response.data.mensagem);
          setMorada(null);
          setTipo(null);
          setHelpdesk(null);
          navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert('Erro:', error.message);
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
            <Text style={styles.text_header}>Alterar Escritório</Text>
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
                label="Morada"
                placeholder="Morada"
                placeholderTextColor="#686868"
                onChangeText={(value) => {
                  setMorada(value);
                  setErrorMorada(null);
                }}
                value={morada}
                inputContainerStyle={styles.input}
                autoCapitalize="words"
                errorMessage={errorMorada}
                errorStyle={styles.errorStyle}
                ref={moradaInput}
                maxLength={100}
              />
              <Input
                label="Tipo"
                placeholder="Tipo"
                placeholderTextColor="#686868"
                onChangeText={(value) => {
                  setTipo(value);
                  setErrorTipo(null);
                }}
                value={tipo}
                inputContainerStyle={styles.input}
                errorMessage={errorTipo}
                errorStyle={styles.errorStyle}
                autoCapitalize="none"
                ref={tipoInput}
                maxLength={45}
              />
              <Input
                label="Contacto Helpdesk"
                placeholder="Contacto Helpdesk"
                placeholderTextColor="#686868"
                onChangeText={(value) => {
                  setHelpdesk(value);
                  setErrorHelpdesk(null);
                }}
                value={helpdesk}
                inputContainerStyle={styles.input}
                autoCapitalize="none"
                errorMessage={errorHelpdesk}
                errorStyle={styles.errorStyle}
                ref={helpdeskInput}
                maxLength={30}
              />
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
