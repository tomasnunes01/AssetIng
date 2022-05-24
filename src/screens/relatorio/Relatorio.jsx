import 'react-native-gesture-handler';
import * as React from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import PropTypes from 'prop-types';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../theme';
import MenuButton from '../../components/button.component';

const logo = require('../../../assets/logo2.png');

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.button.background,
    padding: '1.5%',
    borderRadius: 100,
    marginBottom: 7,
    width: '30%',
  },
  text: {
    color: 'ivory',
    fontSize: 14,
    fontWeight: theme.fontWeights.bold,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 85 : 60,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
});

export default function RelatorioScreen({ navigation }) {
  RelatorioScreen.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    navigation: PropTypes.object.isRequired,
  };

  const HTMLfimDeEmprestimo = `
      <html lang="pt-pt">
          <head>
              <meta charset="utf-8">
              <title>Relatório</title>
          </head>
          <body>
              <table border="1" cellpadding="10" cellspacing="0" align="center">
                  <thead>
                      <tr>
                          <th>Número de Série</th>
                          <th>Marca</th>
                          <th>Modelo</th>
                          <th>CPU</th>
                          <th>RAM</th>
                          <th>Disco</th>
                          <th>Local</th>
                          <th>Utilizador</th>
                          <th>Fim de empréstimo</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>'.$nr_serie.'</td>
                          <td>'.$marca.'</td>
                          <td>'.$modelo.'</td>
                          <td>'.$cpu.'</td>
                          <td>'.$ram.'</td>
                          <td>'.$hdd.'</td>
                          <td>'.$morada.'</td>
                          <td>'.$nome.'</td>
                          <td>'.$emprestimo.'<br></td>
                      </tr>
                  </tbody>
              </table>
          </body>
      </html>
    `;
  const createPDF = async () => {
    const options = {
      html: HTMLfimDeEmprestimo,
      fileName: 'Asseting - Relatório',
      directory: 'Download',
      base64: true,
    };

    const file = await RNHTMLtoPDF.convert(options);
    Alert.alert(
      'Successfully Exported',
      `Path:${file.filePath}`,
      [{ text: 'Cancel', style: 'cancel' }, { text: 'Open' }],
      { cancelable: true },
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            flex: 1,
          }}
          onPress={() => navigation.openDrawer()}
        >
          <MenuButton />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 5,
          marginTop: -170,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image source={logo} style={{ marginBottom: 20 }} />
        <TouchableOpacity style={styles.button} onPress={createPDF}>
          <Text style={styles.text}>Gerar Relatório</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
