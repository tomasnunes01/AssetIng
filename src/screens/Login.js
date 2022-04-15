import React, {useState, Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {ActivityIndicator, useTheme } from 'react-native-paper';
import { FormButton, FormButtonView } from '../components/login-form.component';
import { ThemeProvider } from "styled-components/native";
import { theme } from "../theme";
import userService from "../services/UserService";


export const SignInScreen = ({navigation}) => {

    const { colors } = useTheme();

    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [isLoading, setLoading] = useState(false)


    const entrar = () => {
        let data = {
            username: username,
            password: password
        }
        setLoading(true)

        userService.login(data)
            .then((response) => {
                setLoading(false)
                navigation.reset({
                    index: 0,
                    routes: [{name: "Home"}]
                })
            })
            .catch((error) => {
                Alert.alert("As credenciais são inválidas",
                    "Valide as credenciais e tente novamente")
                setLoading(false)
            })

    }

    const addUser = () => {
        navigation.navigate("AddUser")
    }

    return (
        <ThemeProvider theme={theme}>
            <View style={styles.container}>
                <StatusBar backgroundColor='#28a745' barStyle="light-content"/>
                <View style={styles.header}>
                    <Text style={styles.text_header}>Bem vindo!</Text>
                </View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={styles.footer}
                >
                    <Text style={[styles.text_footer
                    ]}>Username</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color={colors.text}
                            size={20}
                        />
                        <TextInput
                            placeholder="Introduza o username"
                            placeholderTextColor="#686868"
                            onChangeText={value => setUsername(value)}
                            maxLength={16}
                            style={[styles.textInput]}
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={[styles.text_footer, {
                        color: colors.text,
                        marginTop: 35
                    }]}>Palavra-Passe</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color={colors.text}
                            size={20}
                        />
                        <TextInput
                            placeholder="Introduza a palavra-passe"
                            placeholderTextColor="#686868"
                            onChangeText={value => setPassword(value)}
                            secureTextEntry={true}
                            style={[styles.textInput]}
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity>
                        <Text style={{color: '#009387', marginTop: 15}}>Esqueceu-se da palavra-passe?</Text>
                    </TouchableOpacity>
                    <View style={{alignItems: 'center', flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                        {isLoading &&
                            <ActivityIndicator color={"#28a745"} size={'large'}/>
                        }
                        {!isLoading &&
                            <TouchableOpacity
                                style={{width: '65%', marginBottom: '3%'}}
                                onPress={() => entrar()}
                            >
                                <FormButtonView>
                                    <FormButton>
                                        Entrar
                                    </FormButton>
                                </FormButtonView>
                            </TouchableOpacity>
                        }
                    </View>
                </Animatable.View>
            </View>
        </ThemeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#28a745'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
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
        fontSize: theme.fontSizes.title
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -5,
        paddingLeft: 10,
        color: '#000000',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
});
