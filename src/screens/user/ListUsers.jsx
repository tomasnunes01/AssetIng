import React from 'react';
import {
  View,
  Platform,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { Text } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { ThemeProvider } from 'styled-components/native';
import SwipeView from 'react-native-swipeview';
import { SwipeListView } from 'react-native-swipe-list-view';
import { theme } from '../../theme';
import UserService from '../../services/UserService';
import colors from '../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#28a745',
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
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
});

export default class ListUsers extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: [],
      isRendering: true,
    };
  }

  componentDidMount() {
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
  }

  render() {
    const { isRendering, dataSource } = this.state;
    const renderItem = ({ item }) => (
      <TouchableHighlight
        onPress={() => console.log('You touched me')}
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
    const renderHiddenItem = (data, rowMap) => (
      <View style={styles.rowBack}>
        <Text>Left</Text>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          // onPress={() => closeRow(rowMap, data.item.key)}
        >
          <Text style={styles.backTextWhite}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          // onPress={() => deleteRow(rowMap, data.item.key)}
        >
          <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
    return (
      <ThemeProvider theme={theme}>
        <KeyboardAvoidingView
          behaviour={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <StatusBar backgroundColor="#28a745" barStyle="light-content" />
          <View style={styles.header}>
            <Text style={styles.text_header}>Contas</Text>
          </View>
          <Animatable.View animation="fadeInUpBig" style={styles.footer}>
            {isRendering && <ActivityIndicator color="#28a745" size="large" />}
            {!isRendering && (
              /* <View style={[{ paddingVertical: 20 }]}>
                <FlatList
                  data={dataSource}
                  keyExtractor={({ id }) => id}
                  style={styles.list}
                  renderItem={({ item }) => (
                    <SwipeView
                      key={item.id}
                      rightOpenValue={100}
                      onSwipedLeft={() => alert('deleted')}
                      swipeDuration={300}
                      swipeToOpenPercent={40}
                      renderVisibleContent={() => (
                        <View>
                          <Text style={styles.listItem}>
                            {item.nome} {item.apelido}
                          </Text>
                          <Text style={styles.sublistItem}>
                            {item.username} - {item.email} - {item.grupo}
                          </Text>
                        </View>
                      )}
                    />
                  )}
                />
              </View> */
              <SwipeListView
                data={dataSource}
                /* renderItem={({ item }) => (
                  <View key={item.id}>
                    <Text style={styles.listItem}>
                      {item.nome} {item.apelido}
                    </Text>
                    <Text style={styles.sublistItem}>
                      {item.username} - {item.email} - {item.grupo}
                    </Text>
                  </View>
                )} */
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-75}
              />
            )}
          </Animatable.View>
        </KeyboardAvoidingView>
      </ThemeProvider>
    );
  }
}
