import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { Input, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator, useTheme } from 'react-native-paper';
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
    backgroundColor: theme.colors.container.background,
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

export default function AccountDetails({ navigation }) {
  AccountDetails.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    navigation: PropTypes.object.isRequired,
  };
  const { colors } = useTheme();

  const [email, setEmail] = useState(null);
  const [nome, setNome] = useState(null);
  const [apelido, setApelido] = useState(null);
  const [username, setUsername] = useState(null);
  const [morada, setMorada] = useState(null);
  const [isRendering, setRendering] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('ID').then((fromAsyncId) => {
      userService.findByID(fromAsyncId).then((response) => {
        EscritorioService.findByID(response.cod_escritorio).then((data) => {
          setMorada(data.morada);
        });
        setEmail(response.email);
        setNome(response.nome);
        setApelido(response.apelido);
        setUsername(response.username);
        setRendering(false);
      });
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <KeyboardAvoidingView
        behaviour={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar backgroundColor="#28a745" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Dados da conta</Text>
        </View>
        {isRendering && <ActivityIndicator color="#28a745" size="large" />}
        {!isRendering && (
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
                label="Email"
                keyboardType="email-address"
                inputContainerStyle={styles.input}
                value={email}
                disabled
              />
              <View style={{ flexDirection: 'row' }}>
                <Input
                  label="Nome"
                  labelTextColor="#000000"
                  inputContainerStyle={styles.inputNome}
                  disabled
                  value={nome}
                />
                <Input
                  label="Apelido"
                  labelStyle={{ marginLeft: '-50%' }}
                  labelTextColor="#000000"
                  disabled
                  inputContainerStyle={styles.inputApelido}
                  value={apelido}
                />
              </View>
              <Input
                label="Username"
                labelTextColor="#000000"
                inputContainerStyle={styles.input}
                disabled
                value={username}
              />
              <Input
                label="Morada"
                labelTextColor="#000000"
                inputContainerStyle={styles.input}
                value={morada}
                disabled
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
              <TouchableOpacity
                style={{ width: '65%', marginBottom: '-20%' }}
                onPress={() => navigation.goBack()}
              >
                <FormButtonView>
                  <FormButton>Voltar</FormButton>
                </FormButtonView>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
      </KeyboardAvoidingView>
    </ThemeProvider>
  );
}
