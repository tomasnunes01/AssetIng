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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { theme } from '../../theme';
import {
  FormButton,
  FormButtonView,
} from '../../components/login-form.component';
import ComputadorService from '../../services/ComputadorService';
import MenuButton from '../../components/button.component';
import EscritorioService from '../../services/EscritorioService';
import UserService from '../../services/UserService';

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

export default function ComputadorDetails({ navigation }) {
  ComputadorDetails.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    navigation: PropTypes.object.isRequired,
  };
  const { colors } = useTheme();

  const [nrSerie, setNrSerie] = useState(null);
  const [username, setUsername] = useState(null);
  const [codEscritorio, setCodEscritorio] = useState(null);
  const [codTipo, setCodTipo] = useState(null);
  const [marca, setMarca] = useState(null);
  const [modelo, setModelo] = useState(null);
  const [descricao, setDescricao] = useState(null);
  const [sistemaOperativo, setSistemaOperativo] = useState(null);
  const [cpu, setCpu] = useState(null);
  const [ram, setRam] = useState(null);
  const [hdd, setHdd] = useState(null);
  const [garantia, setGarantia] = useState(new Date());
  const [dataInstalacao, setDataInstalacao] = useState(new Date());
  const [fimEmprestimo, setFimEmprestimo] = useState(new Date());
  const [isRendering, setRendering] = useState(true);

  useEffect(async () => {
    AsyncStorage.getItem('ID').then((fromAsyncId) => {
      ComputadorService.findByID(fromAsyncId).then((response) => {
        setNrSerie(response.nr_serie);
        EscritorioService.findByID(response.cod_escritorio).then((data) => {
          setCodEscritorio(data.morada);
        });
        ComputadorService.findTypeByID(response.cod_tipo).then((data) => {
          setCodTipo(data.tipo);
        });
        UserService.findByID(response.cod_utilizador).then((data) => {
          setUsername(data.username);
        });
        setMarca(response.marca);
        setModelo(response.modelo);
        setDescricao(response.descricao);
        setSistemaOperativo(response.so);
        setCpu(response.cpu);
        setRam(response.ram.toString());
        setHdd(response.hdd.toString());
        setGarantia(response.garantia);
        setDataInstalacao(response.data_instalacao);
        setFimEmprestimo(response.fim_emprestimo);
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
          <Text style={styles.text_header}>Dados do Computador</Text>
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
              <ScrollView
                style={{
                  flex: 3,
                  flexDirection: 'column',
                }}
              >
                <Input
                  label="Número de série"
                  labelStyle={{ marginTop: 20 }}
                  value={nrSerie}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Marca"
                  value={marca}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Modelo"
                  value={modelo}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Descrição"
                  value={descricao}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Sistema Operativo"
                  value={sistemaOperativo}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Processador"
                  value={cpu}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="RAM (GB)"
                  keyboardType="number-pad"
                  value={ram}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Capacidade de disco (GB)"
                  value={hdd}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Escritório"
                  value={codEscritorio}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Username"
                  value={username}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Tipo de Computador"
                  value={codTipo}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <TouchableOpacity style={{ flexDirection: 'row' }}>
                  <Input
                    label="Fim de garantia:"
                    value={moment(garantia).format('DD/MM/YYYY')}
                    inputContainerStyle={styles.inputMedio}
                    disabled
                  />
                  <MaterialCommunityIcons
                    name="calendar"
                    size={30}
                    style={styles.logoInputMedio}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row' }}>
                  <Input
                    label="Data de instalação:"
                    value={moment(dataInstalacao).format('DD/MM/YYYY')}
                    inputContainerStyle={styles.inputMedio}
                    disabled
                  />
                  <MaterialCommunityIcons
                    name="calendar"
                    size={30}
                    style={styles.logoInputMedio}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row' }}>
                  <Input
                    label="Fim de Empréstimo:"
                    value={moment(fimEmprestimo).format('DD/MM/YYYY')}
                    inputContainerStyle={styles.inputMedio}
                    disabled
                  />
                  <MaterialCommunityIcons
                    name="calendar"
                    size={30}
                    style={styles.logoInputMedio}
                  />
                </TouchableOpacity>
              </ScrollView>
              <View
                style={{
                  alignItems: 'center',
                  flex: 0.5,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <TouchableOpacity
                  style={{ width: '65%', marginBottom: '-5%' }}
                  onPress={() => navigation.goBack()}
                >
                  <FormButtonView>
                    <FormButton>Voltar</FormButton>
                  </FormButtonView>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animatable.View>
      </KeyboardAvoidingView>
    </ThemeProvider>
  );
}
