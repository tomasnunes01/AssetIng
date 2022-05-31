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
import { theme } from '../../theme';
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
    marginTop: -30,
    paddingBottom: 30,
  },
  footer: {
    flex: 4,
    backgroundColor: theme.colors.container.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.title,
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

export default class ListUsers extends React.Component {
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
      UserService.listar()
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
      return UserService.listar()
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
          AsyncStorage.setItem('ID', item.id.toString());
          navigation.navigate('AccountDetails');
        }}
        style={styles.rowFront}
        underlayColor="#D3D3D3"
      >
        <View key={item.id}>
          <Text style={styles.listItem}>
            {item.nome} {item.apelido}
          </Text>
          <Text style={styles.sublistItem}>
            {item.username} - {item.email} - {item.grupo}
          </Text>
        </View>
      </TouchableHighlight>
    );
    const renderHiddenItem = ({ item }) => (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backLeftBtn]}
          onPress={() => {
            AsyncStorage.setItem('ID', item.id.toString());
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
            UserService.delete(item.id).then((response) => {
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
            barStyle="light-content"
          />
          <View style={styles.header}>
            <Text style={styles.text_header}>Contas</Text>
          </View>
          <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            {isRendering && (
              <ActivityIndicator
                color={theme.colors.button.background}
                size="large"
              />
            )}
            {!isRendering && isAdmin && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: -15,
                    alignSelf: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={20}
                    style={{ flex: 3.5, marginBottom: 5, marginLeft: 10 }}
                  />
                  <Text style={{ flex: 4, fontWeight: theme.fontWeights.bold }}>Swipe</Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    style={{ flex: 1, marginRight: -10 }}
                  />
                </View>
                <SwipeListView
                  data={dataSource}
                  renderItem={renderItem}
                  renderHiddenItem={renderHiddenItem}
                  leftOpenValue={75}
                  rightOpenValue={-75}
                />
              </>
            )}
            {!isRendering && !isAdmin && (
              <SwipeListView
                data={dataSource}
                renderItem={renderItem}
                disableLeftSwipe
                disableRightSwipe
              />
            )}
          </Animatable.View>
        </KeyboardAvoidingView>
      </ThemeProvider>
    );
  }
}
ListUsers.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  navigation: PropTypes.object.isRequired,
};
