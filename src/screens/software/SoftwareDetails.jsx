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

export default function SoftwareDetails({ navigation }) {
  SoftwareDetails.propTypes = {
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
  const [validade, setValidade] = useState(new Date());
  const [isRendering, setRendering] = useState(true);

  useEffect(async () => {
    AsyncStorage.getItem('ID').then((fromAsyncId) => {
      SoftwareService.findByID(fromAsyncId).then((response) => {
        setNrSerie(response.nr_serie);
        setFabricante(response.fabricante);
        setVersao(response.versao);
        setDescricao(response.descricao);
        setChave(response.chave);
        setCodTipoSoftware(response.cod_tipo_software.tipo);
        setCodLicenca(response.cod_tipo_licenca.tipo);
        setComputador(
          `${response.computador.marca} ${response.computador.modelo}: ${response.computador.nr_serie}`,
        );
        setValidade(response.validade);
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
          <Text style={styles.text_header}>Detalhes do Software</Text>
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
                  label="Fabricante"
                  value={fabricante}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Versão"
                  value={versao}
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
                  label="Chave"
                  value={chave}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Tipo de Software"
                  value={codTipoSoftware}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Tipo de Licença"
                  value={codLicenca}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <Input
                  label="Computador"
                  value={computador}
                  inputContainerStyle={styles.input}
                  disabled
                />
                <TouchableOpacity style={{ flexDirection: 'row' }}>
                  <Input
                    label="Validade"
                    value={moment(validade).format('DD/MM/YYYY')}
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
