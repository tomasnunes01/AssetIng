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
import { theme } from '../../theme';
import userService from '../../services/UserService';
import EscritorioService from '../../services/EscritorioService';

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

  const [id, setID] = useState(null);
  const [email, setEmail] = useState(null);
  const [nome, setNome] = useState(null);
  const [apelido, setApelido] = useState(null);
  const [username, setUsername] = useState(null);
  const [morada, setMorada] = useState(null);
  const [isRendering, setRendering] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('ID').then((fromAsyncId) => {
      setID(fromAsyncId);
    });
    try {
      const response = userService.findByID('id', id);
      const escritorio = EscritorioService.findOne(response.cod_escritorio);
      setMorada(escritorio.morada);
      setEmail(response.email);
      setNome(response.nome);
      setApelido(response.apelido);
      setUsername(response.username);
      setRendering(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

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
                placeholder="Email"
                placeholderTextColor="#686868"
                keyboardType="email-address"
                inputContainerStyle={styles.input}
                defaultValue={email}
                disabled
              />
              <View style={{ flexDirection: 'row' }}>
                <Input
                  placeholder="Nome"
                  placeholderTextColor="#686868"
                  inputContainerStyle={styles.inputNome}
                  disabled
                  defaultValue={nome}
                />
                <Input
                  placeholder="Apelido"
                  placeholderTextColor="#686868"
                  inputContainerStyle={styles.inputApelido}
                  defaultValue={apelido}
                />
              </View>
              <Input
                placeholder="Username"
                placeholderTextColor="#686868"
                inputContainerStyle={styles.input}
                disabled
                defaultValue={username}
              />
              <Input
                placeholder="Morada"
                placeholderTextColor="#686868"
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
        )}
      </KeyboardAvoidingView>
    </ThemeProvider>
  );
}
