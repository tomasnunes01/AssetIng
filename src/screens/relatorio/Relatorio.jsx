import 'react-native-gesture-handler';
import * as React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../theme';
import MenuButton from '../../components/button.component';

const logo = require('../../../assets/logo.png');

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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Gerar Relatório</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
