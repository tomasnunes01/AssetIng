import React from 'react';
import {
  View,
  Platform,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from 'react-native';
import { Text } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EscritorioService from '../../services/EscritorioService';
import { theme } from '../../theme';
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
    flex: 20,
    backgroundColor: theme.colors.container.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.title,
    flex: 6,
    marginTop: -2,
  },
  list: {
    marginVertical: -50,
    paddingVertical: 10,
  },
  listItem: {
    fontSize: theme.fontSizes.h6,
    fontWeight: theme.fontWeights.bold,
    paddingLeft: 5,
  },
  sublistItem: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.regular,
    paddingLeft: 5,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: theme.colors.container.background,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    borderRadius: 100,
    marginHorizontal: 1,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 100,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  backLeftBtn: {
    backgroundColor: theme.colors.button.yellow,
    left: 0,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
});

export default class ListEscritorio extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: [],
      isRendering: true,
      isAdmin: false,
    };
  }

  componentDidMount() {
    let grupo = null;
    const { navigation } = this.props;

    AsyncStorage.getItem('MYGRUPO').then((result) => {
      grupo = result;
      if (grupo === 'Administrador') {
        grupo = true;
      } else {
        grupo = false;
      }
      this.setState({
        isRendering: true,
        isAdmin: grupo,
      });
    });
    this.focusSubscription = navigation.addListener('focus', () => {
      this.setState({ isRendering: true });
      EscritorioService.findAll()
        .then((data) => {
          this.setState({
            dataSource: data,
            isRendering: false,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    });
  }

  componentWillUnmount() {
    this.focusSubscription();
  }

  render() {
    const { isRendering, dataSource, isAdmin } = this.state;
    const { navigation } = this.props;

    const updateList = () => {
      return EscritorioService.findAll()
        .then((data) => {
          this.setState({
            dataSource: data,
            isRendering: false,
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    };

    const renderItem = ({ item }) => (
      <TouchableHighlight
        onPress={() => {
          AsyncStorage.setItem('ID', item.cod_escritorio.toString());
          console.log(item.cod_escritorio);
          // navigation.navigate('EscritorioDetails');
        }}
        style={styles.rowFront}
        underlayColor="#D3D3D3"
      >
        <View>
          <Text style={styles.listItem}>{item.morada}</Text>
          <Text style={styles.sublistItem}>{item.tipo}</Text>
        </View>
      </TouchableHighlight>
    );
    const renderHiddenItem = ({ item }) => (
      <View style={styles.rowBack} key={item.cod_escritorio}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backLeftBtn]}
          onPress={() => {
            AsyncStorage.setItem('ID', item.cod_escritorio.toString());
            navigation.navigate('ChangeUserAccount');
          }}
        >
          <Text>
            <MaterialCommunityIcons name="account-edit" size={25} />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() =>
            EscritorioService.delete(item.cod_escritorio).then((response) => {
              const titulo = response.status ? 'Sucesso' : 'Erro';
              Alert.alert(titulo, response.mensagem);
              if (response.status) {
                this.setState({ isRendering: true });
                updateList();
              }
            })
          }
        >
          <Text style={styles.backTextWhite}>
            <MaterialCommunityIcons name="trash-can-outline" size={25} />
          </Text>
        </TouchableOpacity>
      </View>
    );
    return (
      <ThemeProvider theme={theme}>
        <KeyboardAvoidingView
          behaviour={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <StatusBar
            backgroundColor={theme.colors.container.header}
            barStyle="light"
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
            <Text style={styles.text_header}>Escritórios</Text>
          </View>
          <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            {isRendering && (
              <ActivityIndicator
                color={theme.colors.button.background}
                size="large"
              />
            )}
            {!isRendering && isAdmin && (
              <SwipeListView
                data={dataSource}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-75}
                keyExtractor={(item, index) => index.toString()}
              />
            )}
            {!isRendering && !isAdmin && (
              <SwipeListView
                data={dataSource}
                renderItem={renderItem}
                disableLeftSwipe
                disableRightSwipe
                keyExtractor={(item, index) => index.toString()}
              />
            )}
          </Animatable.View>
        </KeyboardAvoidingView>
      </ThemeProvider>
    );
  }
}
ListEscritorio.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};
