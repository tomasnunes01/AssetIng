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
import { useTheme } from 'react-native-paper';
import { ThemeProvider } from 'styled-components/native';
import PropTypes from 'prop-types';
import {
  FormButton,
  FormButtonView,
} from '../../components/login-form.component';
import { theme } from '../../theme';
import EscritorioService from '../../services/EscritorioService';
import MenuButton from '../../components/button.component';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.container.header,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 85 : 60,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  footer: {
    flex: 15,
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
    flex: 6,
    marginTop: -2,
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

export default function AddEscritorio({ navigation }) {
  AddEscritorio.propTypes = {
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

  const moradaInput = React.createRef();
  const tipoInput = React.createRef();
  const helpdeskInput = React.createRef();

  const reMorada = /.{3,100}/;
  const reTipo = /.{3,45}/;
  const reHelpdesk =
    /^(?=.{3,30}$)(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useEffect(async () => {
    setRendering(false);
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
        tipo,
        morada,
        helpdesk,
      };

      EscritorioService.registar(data)
        .then((response) => {
          setLoading(false);
          const titulo = response.data.status ? 'Sucesso' : 'Erro';
          Alert.alert(titulo, response.data.mensagem);
          setMorada(null);
          setTipo(null);
          setHelpdesk(null);
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert('Erro:', error.message);
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <KeyboardAvoidingView
        behaviour={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.container.header}
        />
        <View style={styles.header}>
          <TouchableOpacity
            style={{
              flex: 1,
            }}
            onPress={() => navigation.openDrawer()}
          >
            <MenuButton />
          </TouchableOpacity>
          <Text style={styles.text_header}>Adicionar Escritório</Text>
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
            <ActivityIndicator
              color={theme.colors.button.background}
              size="large"
            />
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
                  placeholder="Morada"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setMorada(value);
                    setErrorMorada(null);
                  }}
                  value={morada}
                  inputContainerStyle={styles.input}
                  errorMessage={errorMorada}
                  errorStyle={styles.errorStyle}
                  ref={moradaInput}
                  maxLength={100}
                />
                <Input
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
                  ref={tipoInput}
                  maxLength={45}
                />
                <Input
                  placeholder="Contacto Helpdesk"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setHelpdesk(value);
                    setErrorHelpdesk(null);
                  }}
                  value={helpdesk}
                  inputContainerStyle={styles.input}
                  errorMessage={errorHelpdesk}
                  errorStyle={styles.errorStyle}
                  ref={helpdeskInput}
                  maxLength={45}
                />
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
                  <ActivityIndicator
                    color={theme.colors.button.background}
                    size="large"
                  />
                )}
                {!isLoading && (
                  <TouchableOpacity
                    style={{ width: '65%', marginBottom: '-5%' }}
                    onPress={() => guardar()}
                  >
                    <FormButtonView>
                      <FormButton>Guardar</FormButton>
                    </FormButtonView>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </Animatable.View>
      </KeyboardAvoidingView>
    </ThemeProvider>
  );
}
