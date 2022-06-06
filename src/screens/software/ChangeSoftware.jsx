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
import { Picker } from '@react-native-picker/picker';
import { ThemeProvider } from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native-gesture-handler';
import { theme } from '../../theme';
import {
  FormButton,
  FormButtonView,
} from '../../components/login-form.component';
import ComputadorService from '../../services/ComputadorService';
import MenuButton from '../../components/button.component';
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

export default function ChangeSoftware({ navigation }) {
  ChangeSoftware.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    navigation: PropTypes.object.isRequired,
  };
  const { colors } = useTheme();

  const [id, setID] = useState(null);
  const [nrSerie, setNrSerie] = useState(null);
  const [fabricante, setFabricante] = useState(null);
  const [versao, setVersao] = useState(null);
  const [descricao, setDescricao] = useState(null);
  const [chave, setChave] = useState(null);
  const [codTipoSoftware, setCodTipoSoftware] = useState(null);
  const [codLicenca, setCodLicenca] = useState(null);
  const [computador, setComputador] = useState(null);
  const [validade, setValidade] = useState(new Date());
  const [showValidade, setShowValidade] = useState(false);
  const [errorNrSerie, setErrorNrSerie] = useState(null);
  const [errorFabricante, setErrorFabricante] = useState(null);
  const [errorVersao, setErrorVersao] = useState(null);
  const [errorDescricao, setErrorDescricao] = useState(null);
  const [errorChave, setErrorChave] = useState(null);
  const [displaymode, setMode] = useState('date');
  const [isLoading, setLoading] = useState(false);
  const [isRendering, setRendering] = useState(true);
  const [tipoSoftwareList, setTipoSoftwareList] = useState([]);
  const [licencaList, setLicencaList] = useState([]);
  const [computadorList, setComputadorList] = useState([]);

  const scrollViewRef = React.createRef();
  const nrSerieInput = React.createRef();
  const fabricanteInput = React.createRef();
  const versaoInput = React.createRef();
  const chaveInput = React.createRef();
  const codTipoSoftwareInput = React.createRef();
  const licencaInput = React.createRef();
  const computadorInput = React.createRef();
  const descricaoInput = React.createRef();

  const reNrSerie = /[a-zA-Z0-9]{1,30}/;
  const reVarChar20 = /[\w\s]{1,20}/;
  const reVarChar45 = /[\w\s]{1,45}/;
  const reVarChar100 = /[\w\s]{0,100}/;

  useEffect(async () => {
    AsyncStorage.getItem('ID').then((fromAsyncId) => {
      SoftwareService.listarTipos().then((response) => {
        setTipoSoftwareList(response);
      });
      SoftwareService.listarLicencas().then((response) => {
        setLicencaList(response);
      });
      ComputadorService.findAll().then((response) => {
        setComputadorList(response);
      });
      setID(fromAsyncId);
      SoftwareService.findByID(fromAsyncId).then((response) => {
        setNrSerie(response.nr_serie);
        setFabricante(response.fabricante);
        setVersao(response.versao);
        setDescricao(response.descricao);
        setChave(response.chave);
        setCodTipoSoftware(response.cod_tipo_software.cod_tipo);
        setCodLicenca(response.cod_tipo_licenca.cod_tipo);
        setComputador(response.computador.nr_serie);
        setValidade(response.validade);
        setRendering(false);
      });
    });
  }, []);

  const changeValidadeDate = (event, selectedDate) => {
    const currentDate = selectedDate || validade;
    setValidade(currentDate);
    if (Platform.OS === 'android') {
      setShowValidade(false);
    }
  };
  const showModeValidade = (currentMode) => {
    if (showValidade) {
      setShowValidade(false);
    } else {
      setShowValidade(true);
    }
    setMode(currentMode);
  };
  const displayValidadePicker = () => {
    showModeValidade('date');
  };
  const validar = () => {
    let erro = false;

    setErrorNrSerie(null);
    setErrorFabricante(null);
    setErrorVersao(null);
    setErrorDescricao(null);
    setErrorChave(null);

    if (!reNrSerie.test(String(nrSerie)) || nrSerie == null) {
      setErrorNrSerie('O número de série é obrigatório');
      erro = true;
      nrSerieInput.current.shake();
      nrSerieInput.current.focus();
    }
    if (!reVarChar20.test(String(fabricante)) && fabricante !== null) {
      setErrorFabricante('Caracteres especiais não são aceites');
      erro = true;
      fabricanteInput.current.shake();
      fabricanteInput.current.focus();
    } else if (fabricante == null) {
      setErrorFabricante('O campo fabricante é obrigatório');
      erro = true;
      fabricanteInput.current.shake();
      fabricanteInput.current.focus();
    }
    if (!reVarChar20.test(String(versao)) && versao !== null) {
      setErrorVersao('Caracteres especiais não são aceites');
      erro = true;
      versaoInput.current.shake();
      versaoInput.current.focus();
    } else if (versao == null) {
      setErrorVersao('O campo versao é obrigatório');
      erro = true;
      versaoInput.current.shake();
      versaoInput.current.focus();
    }
    if (!reVarChar100.test(String(descricao)) && descricao !== null) {
      setErrorDescricao('Caracteres especiais não são aceites');
      erro = true;
      descricaoInput.current.shake();
      descricaoInput.current.focus();
    }
    if (!reVarChar45.test(String(chave)) && chave !== null) {
      setErrorChave('Caracteres especiais não são aceites');
      erro = true;
      chaveInput.current.shake();
      chaveInput.current.focus();
    }
    if (!codTipoSoftware && !erro) {
      erro = true;
      codTipoSoftwareInput.current.focus();
    }
    if (!codLicenca && !erro) {
      erro = true;
      licencaInput.current.focus();
    }
    return !erro;
  };

  const guardar = () => {
    if (validar()) {
      setLoading(true);

      const data = {
        id,
        nr_serie: nrSerie,
        fabricante,
        versao,
        descricao,
        chave,
        cod_tipo_software: codTipoSoftware,
        cod_tipo_licenca: codLicenca,
        computador,
        validade,
      };

      SoftwareService.atualizar(data)
        .then((response) => {
          setLoading(false);
          const titulo = response.data.status ? 'Sucesso' : 'Erro';
          Alert.alert(titulo, response.data.mensagem);
          if (response.data.status) {
            setNrSerie(null);
            setFabricante(null);
            setVersao(null);
            setDescricao(null);
            setChave(null);
            setCodTipoSoftware(null);
            setCodLicenca(null);
            setComputador(null);
            setValidade(new Date());
            navigation.goBack();
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
          <Text style={styles.text_header}>Alterar Software</Text>
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
                  ref={nrSerieInput}
                  maxLength={45}
                />
                <Input
                  placeholder="Fabricante"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setFabricante(value);
                    setErrorFabricante(null);
                  }}
                  value={fabricante}
                  inputContainerStyle={styles.input}
                  errorMessage={errorFabricante}
                  errorStyle={styles.errorStyle}
                  ref={fabricanteInput}
                  maxLength={20}
                />
                <Input
                  placeholder="Versão"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setVersao(value);
                    setErrorVersao(null);
                  }}
                  value={versao}
                  inputContainerStyle={styles.input}
                  errorMessage={errorVersao}
                  errorStyle={styles.errorStyle}
                  ref={versaoInput}
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
                  placeholder="Chave"
                  placeholderTextColor="#686868"
                  onChangeText={(value) => {
                    setChave(value);
                    setErrorChave(null);
                  }}
                  value={chave}
                  inputContainerStyle={styles.input}
                  errorMessage={errorChave}
                  errorStyle={styles.errorStyle}
                  ref={chaveInput}
                  maxLength={45}
                />
                <View style={styles.pickerView}>
                  <Text style={styles.labelPicker}>Tipo de Software:</Text>
                  <Picker
                    selectedValue={codTipoSoftware}
                    onValueChange={(itemValue) => setCodTipoSoftware(itemValue)}
                    mode="dropdown"
                    style={styles.picker}
                    ref={codTipoSoftwareInput}
                  >
                    {!codTipoSoftware && <Picker.Item label="Selecione ..." />}
                    {tipoSoftwareList.map((item) => (
                      <Picker.Item
                        label={item.tipo}
                        value={item.cod_tipo}
                        key={item.cod_tipo}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={styles.pickerView}>
                  <Text style={styles.labelPicker}>Tipo de Licença:</Text>
                  <Picker
                    selectedValue={codLicenca}
                    onValueChange={(itemValue) => setCodLicenca(itemValue)}
                    mode="dropdown"
                    style={styles.picker}
                    ref={licencaInput}
                  >
                    {!codLicenca && <Picker.Item label="Selecione ..." />}
                    {licencaList.map((item) => (
                      <Picker.Item
                        label={item.tipo}
                        value={item.cod_tipo}
                        key={item.cod_tipo}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={styles.pickerView}>
                  <Text style={styles.labelPicker}>Computador:</Text>
                  <Picker
                    selectedValue={computador}
                    onValueChange={(itemValue) => setComputador(itemValue)}
                    mode="dropdown"
                    style={styles.picker}
                    ref={computadorInput}
                  >
                    <Picker.Item label="Selecione ..." value={null} />
                    {computadorList.map((item) => (
                      <Picker.Item
                        label={`${item.marca} ${item.modelo}: ${item.nr_serie}`}
                        value={item.nr_serie}
                        key={item.nr_serie}
                      />
                    ))}
                  </Picker>
                </View>
                {showValidade && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={validade}
                    mode={displaymode}
                    is24Hour
                    display="spinner"
                    onChange={changeValidadeDate}
                  />
                )}
                <TouchableOpacity
                  onPress={displayValidadePicker}
                  style={{ flexDirection: 'row' }}
                >
                  <Input
                    label="Validade:"
                    placeholderTextColor="#686868"
                    value={moment(validade).format('DD/MM/YYYY')}
                    inputContainerStyle={styles.inputMedio}
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
