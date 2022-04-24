import React, { useState, useEffect } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import { useTheme } from 'react-native-paper';
import { ThemeProvider } from 'styled-components/native';
import SwipeView from 'react-native-swipeview';
import { theme } from '../theme';
import UserService from '../services/UserService';

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
    backgroundColor: '#fff',
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
  list: {
    marginVertical: -50,
    paddingVertical: 10,
  },
  listItem: {
    fontSize: theme.fontSizes.h6,
    fontWeight: theme.fontWeights.bold,
    paddingTop: 10,
    paddingLeft: 5,
  },
  sublistItem: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.regular,
    marginBottom: 25,
    paddingLeft: 5,
  },
});

export default function ListUsers({ navigation }) {
  ListUsers.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    navigation: PropTypes.object.isRequired,
  };

  const { colors } = useTheme();

  const [isRendering, setRendering] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  useEffect(async () => {
    try {
      const response = await UserService.listar();
      setDataSource(response);
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
          <Text style={styles.text_header}>Contas</Text>
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
          {isRendering && <ActivityIndicator color="#28a745" size="large" />}
          {!isRendering && (
            <View style={[{ paddingVertical: 20 }]}>
              <FlatList
                data={dataSource}
                keyExtractor={({ id }, index) => id}
                style={styles.list}
                renderItem={({ item }) => (

                  <View 
                    key={item.id}
                    /*leftOpenValue = {100}
                    rightOpenValue = {100}
                    onSwipedLeft={() => console.log("deleted")}
                    swipeDuration = {300}
                    swipeToOpenPercent = {40}*/
                  >
                    <Text style={styles.listItem}>
                      {item.nome} {item.apelido}
                    </Text>
                    <Text style={styles.sublistItem}>
                      {item.username} - {item.email} - {item.grupo}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
        </Animatable.View>
      </KeyboardAvoidingView>
    </ThemeProvider>
  );
}
