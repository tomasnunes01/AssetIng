import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import {
  FormButton,
  FormButtonView,
} from '../../components/login-form.component';
import { theme } from '../../theme';
import EscritorioService from '../../services/EscritorioService';
import MenuButton from '../../components/button.component';
import UserService from '../../services/UserService';
import ComputadorService from '../../services/ComputadorService';
import SoftwareService from '../../services/SoftwareService';

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
    paddingTop: 5,
  },
  text_header: {
    color: '#fff',
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.title,
    flex: 6,
    marginTop: -2,
  },
  input: {
    paddingLeft: 1,
    color: '#000000',
    borderBottomWidth: 1,
  },
  picker: {
    color: '#000000',
    width: '50%',
    flex: 2,
  },
  labelPicker: {
    flex: 1,
    fontSize: theme.fontSizes.body,
    alignSelf: 'center',
  },
  pickerView: {
    borderBottomWidth: 0.7,
    marginHorizontal: 10,
    flexDirection: 'row',
    marginBottom: '4%',
  },
  errorStyle: {
    marginLeft: 0,
  },
  inputMedio: {
    paddingLeft: 1,
    color: '#000000',
    borderBottomWidth: 1,
    width: '100%',
  },
  logoInputMedio: {
    paddingLeft: 1,
    color: '#000000',
    width: '20%',
    marginTop: '5%',
    marginLeft: '-11%',
  },
});

export default function AddSoftware({ navigation }) {
  AddSoftware.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    navigation: PropTypes.object.isRequired,
  };
  const { colors } = useTheme();

  const [nrSerie, setNrSerie] = useState(null);
  const [fabricante, setFabricante] = useState(null);
  const [versao, setVersao] = useState(null);
  const [descricao, setDescricao] = useState(null);
  const [chave, setChave] = useState(null);
  const [codTipoSoftware, setCodTipoSoftware] = useState(null);
  const [codLicenca, setCodLicenca] = useState(null);
  const [computador, setComputador] = useState(null);
  const [fimEmprestimo, setValidade] = useState(new Date());
  const [showEmprestimo, setShowEmprestimo] = useState(false);
  const [errorNrSerie, setErrorNrSerie] = useState(null);
  const [errorFabricante, setErrorFabricante] = useState(null);
  const [errorVersao, setErrorVersao] = useState(null);
  const [errorDescricao, setErrorDescricao] = useState(null);
  const [errorChave, setErrorChave] = useState(null);
  const [errorCodTipoSoftware, setErrorCodTipoSoftware] = useState(null);
  const [errorLicenca, setErrorLicenca] = useState(null);
  const [errorComputador, setErrorComputador] = useState(null);
  const [errorFimEmprestimo, setErrorFimEmprestimo] = useState(null);
  const [displaymode, setMode] = useState('date');
  const [isLoading, setLoading] = useState(false);
  const [isRendering, setRendering] = useState(true);
  const [tipoSoftwareList, setTipoSoftwareList] = useState([]);
  const [licencaList, setLicencaList] = useState([]);
  const [tipoList, setTipoList] = useState([]);

  const scrollViewRef = React.createRef();
  const fabricanteInput = React.createRef();
  const versaoInput = React.createRef();
  const chaveInput = React.createRef();
  const codTipoSoftwareInput = React.createRef();
  const licencaInput = React.createRef();
  const computadorInput = React.createRef();
  const descricaoInput = React.createRef();
  const fimEmprestimoInput = React.createRef();

  const reNrSerie = /[a-zA-Z0-9]{1,30}/;
  const reInt = /[0-9]{1,11}/;
  const reVarChar45 = /[\w\s]{1,45}/;
  const reVarChar100 = /[\w\s]{0,100}/;

  useEffect(async () => {
    try {
      const tipoSoftware = await SoftwareService.listarTipos();
      setTipoSoftwareList(tipoSoftware);
      const tipoLicenca = await SoftwareService.listarLicencas();
      setLicencaList(tipoLicenca);
      const tipoComputador = await ComputadorService.listarTipos();
      setTipoList(tipoComputador);
      setRendering(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  const changeGarantiaDate = (event, selectedDate) => {
    const currentDate = selectedDate || garantia;
    setGarantia(currentDate);
    if (Platform.OS === 'android') {
      setShowGarantia(false);
    }
  };
  const showModeGarantia = (currentMode) => {
    if (showGarantia) {
      setShowGarantia(false);
    } else {
      setShowGarantia(true);
    }
    setMode(currentMode);
  };
  const displayGarantiaPicker = () => {
    showModeGarantia('date');
  };
  const displayInstalacaoPicker = () => {
    if (showDataInstalacao) {
      setShowDataInstalacao(false);
    } else {
      setShowDataInstalacao(true);
    }
  };
  const changeInstalacaoDate = (event, selectedDate) => {
    const currentDate = selectedDate || dataInstalacao;
    setDataInstalacao(currentDate);
    if (Platform.OS === 'android') {
      setShowDataInstalacao(false);
    }
  };
  const displayEmprestimoPicker = () => {
    if (showEmprestimo) {
      setShowEmprestimo(false);
    } else {
      setShowEmprestimo(true);
    }
  };
  const changeEmprestimoDate = (event, selectedDate) => {
    const currentDate = selectedDate || fimEmprestimo;
    setValidade(currentDate);
    if (Platform.OS === 'android') {
      setShowEmprestimo(false);
    }
  };

  const validar = () => {
    let erro = false;
    setErrorCodTipoSoftware(null);
    setErrorDataInstalacao(null);
    setErrorDescricao(null);
    setErrorFimEmprestimo(null);
    setErrorGarantia(null);
    setErrorComputador(null);
    setErrorFabricante(null);
    setErrorVersao(null);
    setErrorNrSerie(null);
    setErrorLicenca(null);
    setErrorChave(null);

    if (!reNrSerie.test(String(nrSerie)) || nrSerie == null) {
      setErrorNrSerie('O número de série é obrigatório');
      erro = true;
      fabricanteInput.current.shake();
      fabricanteInput.current.focus();
    }
    if (!reVarChar45.test(String(cpu)) && cpu !== null) {
      setErrorCodTipoSoftware('Caracteres especiais não são aceites');
      erro = true;
      cpuInput.current.shake();
      cpuInput.current.focus();
    }
    if (!reVarChar100.test(String(descricao)) && descricao !== null) {
      setErrorDescricao('Caracteres especiais não são aceites');
      erro = true;
      descricaoInput.current.shake();
      descricaoInput.current.focus();
    }
    if (!reInt.test(String(hdd)) && hdd !== null) {
      setErrorComputador('Caracteres especiais não são aceites');
      erro = true;
      hddInput.current.shake();
      hddInput.current.focus();
    }
    if (!reVarChar45.test(String(marca)) || marca == null) {
      setErrorFabricante('O campo marca é obrigatório');
      erro = true;
      licencaInput.current.shake();
      licencaInput.current.focus();
    }
    if (!reVarChar45.test(String(modelo)) || modelo == null) {
      setErrorVersao('O campo modelo é obrigatório');
      erro = true;
      computadorInput.current.shake();
      computadorInput.current.focus();
    }
    if (!reInt.test(String(ram)) && ram !== null) {
      setErrorFabricante('Introduza um número inteiro, em GB');
      erro = true;
      ramInput.current.shake();
      ramInput.current.focus();
    }
    if (!reVarChar45.test(String(sistemaOperativo))) {
      setErrorChave('Caracteres especiais não são aceites');
      erro = true;
      fimEmprestimoInput t.current.shake();
      fimEmprestimoInput t.current.focus();
    }
    if (!codTipoSoftware && !erro) {
      erro = true;
      codTipoSoftwareInput.current.focus();
    }
    return !erro;
  };

  const guardar = () => {
    if (validar()) {
      setLoading(true);

      const data = {
        nr_serie: nrSerie,
        cod_utilizador: username,
        cod_escritorio: codLicenca,
        cod_tipo: codTipoSoftware,
        marca,
        modelo,
        descricao,
        so: sistemaOperativo,
        cpu,
        ram,
        hdd,
        garantia,
        data_instalacao: dataInstalacao,
        fim_emprestimo: fimEmprestimo,
      };

      ComputadorService.registar(data)
        .then((response) => {
          setLoading(false);
          const titulo = response.data.status ? 'Sucesso' : 'Erro';
          Alert.alert(titulo, response.data.mensagem);
          if (response.data.status) {
            setCodLicenca(null);
            setCodTipoSoftware(null);
            setCpu(null);
            setDataInstalacao(new Date());
            setDescricao(null);
            setValidade(new Date());
            setGarantia(new Date());
            setHdd(null);
            setMarca(null);
            setModelo(null);
            setNrSerie(null);
            setRam(null);
            setSistemaOperativo(null);
            setUsername(null);
          }
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
          <Text style={styles.text_header}>Adicionar Computador</Text>
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
                ref={scrollViewRef}
              >
                <Input
                  placeholder="Número de série"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setNrSerie(value);
                    setErrorNrSerie(null);
                  }}
                  style={{ marginTop: 20 }}
                  value={nrSerie}
                  inputContainerStyle={styles.input}
                  errorMessage={errorNrSerie}
                  errorStyle={styles.errorStyle}
                  ref={fabricanteInput}
                  maxLength={30}
                />
                <Input
                  placeholder="Marca"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setMarca(value);
                    setErrorFabricante(null);
                  }}
                  value={marca}
                  inputContainerStyle={styles.input}
                  errorMessage={errorFabricante}
                  errorStyle={styles.errorStyle}
                  ref={licencaInput}
                  maxLength={20}
                />
                <Input
                  placeholder="Modelo"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setModelo(value);
                    setErrorVersao(null);
                  }}
                  value={modelo}
                  inputContainerStyle={styles.input}
                  errorMessage={errorVersao}
                  errorStyle={styles.errorStyle}
                  ref={computadorInput}
                  maxLength={20}
                />
                <Input
                  placeholder="Descrição"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setDescricao(value);
                    setErrorDescricao(null);
                  }}
                  value={descricao}
                  inputContainerStyle={styles.input}
                  errorMessage={errorDescricao}
                  errorStyle={styles.errorStyle}
                  ref={descricaoInput}
                  maxLength={100}
                />
                <Input
                  placeholder="Sistema Operativo"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setSistemaOperativo(value);
                    setErrorChave(null);
                  }}
                  value={sistemaOperativo}
                  inputContainerStyle={styles.input}
                  errorMessage={errorChave}
                  errorStyle={styles.errorStyle}
                  ref={fimEmprestimoInput t}
                  maxLength={20}
                />
                <Input
                  placeholder="Processador"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setCpu(value);
                    setErrorCodTipoSoftware(null);
                  }}
                  value={cpu}
                  inputContainerStyle={styles.input}
                  errorMessage={errorCodTipoSoftware}
                  errorStyle={styles.errorStyle}
                  ref={cpuInput}
                  maxLength={20}
                />
                <Input
                  placeholder="RAM (GB)"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setRam(value);
                    setErrorLicenca(null);
                  }}
                  keyboardType="number-pad"
                  value={ram}
                  inputContainerStyle={styles.input}
                  errorMessage={errorLicenca}
                  errorStyle={styles.errorStyle}
                  ref={ramInput}
                  maxLength={11}
                />
                <Input
                  placeholder="Capacidade de disco (GB)"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setHdd(value);
                    setErrorComputador(null);
                  }}
                  keyboardType="number-pad"
                  value={hdd}
                  inputContainerStyle={styles.input}
                  errorMessage={errorComputador}
                  errorStyle={styles.errorStyle}
                  ref={hddInput}
                  maxLength={11}
                />
                <View style={styles.pickerView}>
                  <Text style={styles.labelPicker}>Escritório:</Text>
                  <Picker
                    selectedValue={codLicenca}
                    onValueChange={(itemValue) => setCodLicenca(itemValue)}
                    mode="dropdown"
                    style={styles.picker}
                    ref={chaveInput}
                  >
                    {!codLicenca && <Picker.Item label="Selecione ..." />}
                    {tipoSoftwareList.map((item) => (
                      <Picker.Item
                        label={item.morada}
                        value={item.cod_escritorio}
                        key={item.cod_escritorio}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={styles.pickerView}>
                  <Text style={styles.labelPicker}>Utilizador:</Text>
                  <Picker
                    selectedValue={username}
                    onValueChange={(itemValue) => setUsername(itemValue)}
                    mode="dropdown"
                    style={styles.picker}
                    ref={versaoInput}
                  >
                    {!username && <Picker.Item label="Selecione ..." />}
                    {licencaList.map((item) => (
                      <Picker.Item
                        label={item.username}
                        value={item.id}
                        key={item.id}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={styles.pickerView}>
                  <Text style={styles.labelPicker}>Tipo de Computador:</Text>
                  <Picker
                    selectedValue={codTipoSoftware}
                    onValueChange={(itemValue) => setCodTipoSoftware(itemValue)}
                    mode="dropdown"
                    style={styles.picker}
                    ref={codTipoSoftwareInput}
                  >
                    {!codTipoSoftware && <Picker.Item label="Selecione ..." />}
                    {tipoList.map((item) => (
                      <Picker.Item
                        label={item.tipo}
                        value={item.cod_tipo}
                        key={item.cod_tipo}
                      />
                    ))}
                  </Picker>
                </View>
                {showGarantia && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={garantia}
                    mode={displaymode}
                    is24Hour
                    display="spinner"
                    onChange={changeGarantiaDate}
                  />
                )}
                <TouchableOpacity
                  onPress={displayGarantiaPicker}
                  style={{ flexDirection: 'row' }}
                >
                  <Input
                    label="Fim de garantia:"
                    placeholderTextColor="#686868"
                    value={moment(garantia).format('DD/MM/YYYY')}
                    inputContainerStyle={styles.inputMedio}
                    errorMessage={errorGarantia}
                    errorStyle={styles.errorStyle}
                    disabled
                  />
                  <MaterialCommunityIcons
                    name="calendar"
                    size={30}
                    style={styles.logoInputMedio}
                  />
                </TouchableOpacity>
                {showDataInstalacao && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={dataInstalacao}
                    mode="date"
                    is24Hour
                    display="spinner"
                    onChange={changeInstalacaoDate}
                  />
                )}
                <TouchableOpacity
                  onPress={displayInstalacaoPicker}
                  style={{ flexDirection: 'row' }}
                >
                  <Input
                    label="Data de instalação:"
                    placeholderTextColor="#686868"
                    value={moment(dataInstalacao).format('DD/MM/YYYY')}
                    inputContainerStyle={styles.inputMedio}
                    errorMessage={errorDataInstalacao}
                    errorStyle={styles.errorStyle}
                    disabled
                  />
                  <MaterialCommunityIcons
                    name="calendar"
                    size={30}
                    style={styles.logoInputMedio}
                  />
                </TouchableOpacity>
                {showEmprestimo && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={fimEmprestimo}
                    mode="date"
                    is24Hour
                    display="spinner"
                    onChange={changeEmprestimoDate}
                  />
                )}
                <TouchableOpacity
                  onPress={displayEmprestimoPicker}
                  style={{ flexDirection: 'row' }}
                >
                  <Input
                    label="Fim de Empréstimo:"
                    placeholderTextColor="#686868"
                    value={moment(fimEmprestimo).format('DD/MM/YYYY')}
                    inputContainerStyle={styles.inputMedio}
                    errorMessage={errorFimEmprestimo}
                    errorStyle={styles.errorStyle}
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
