import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "../../util/Config";
import stringifySafe from "react-native/Libraries/Utilities/stringifySafe";

class UserService {
    async registar(data){
        return axios({
            url: Config.API_URL+"conta/registar",
            method: "POST",
            timeout: Config.TIMEOUT_REQUEST,
            data: data,
            headers: Config.HEADER_REQUEST
        }).then((response) => {
            return Promise.resolve(response)
        }).catch((error) => {
            return Promise.reject(error)
        })
    }

    async getUserData(data){
        await axios.get(Config.API_URL + 'conta/getUserData', {
                params: {
                    username: data
                }
            })
            .then(function (response) {
                AsyncStorage.setItem("GRUPO", response.data.grupo)
                AsyncStorage.setItem("NOME", response.data.nome)
                AsyncStorage.setItem("APELIDO", response.data.apelido)
                AsyncStorage.setItem("EMAIL", response.data.email)
                AsyncStorage.setItem("ID", stringifySafe(response.data.id))
                AsyncStorage.setItem("USERNAME", data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async login(data) {
        return axios({
            url: Config.API_URL + "conta/login",
            method: "POST",
            timeout: Config.TIMEOUT_REQUEST,
            data: data,
            headers: Config.HEADER_REQUEST
        }).then(async (response) => {
            await this.getUserData(data.username)
            AsyncStorage.setItem("TOKEN", response.data.access_token)
            return Promise.resolve(response)
        }).catch((error) => {
            return Promise.reject(error)
        })
    }

    async atualizar(data){
        return axios({
            url: Config.API_URL+"conta/myAccountUpdate",
            method: "PATCH",
            timeout: Config.TIMEOUT_REQUEST,
            data: data,
            headers: Config.HEADER_REQUEST
        }).then(async (response) => {
            await this.getUserData(data.username)
            return Promise.resolve(response)
        }).catch((error) => {
            return Promise.reject(error)
        })
    }
}

const userService = new UserService()
export default userService
