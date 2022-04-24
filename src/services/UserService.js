import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import stringifySafe from 'react-native/Libraries/Utilities/stringifySafe';
import Config from '../../util/Config';

class UserService {
  constructor(config) {
    const {
      API_URL: baseURL,
      TIMEOUT_REQUEST: timeout,
      HEADER_REQUEST: headers,
    } = config;
    this.client = axios.create({
      baseURL,
      timeout,
      headers,
    });
  }

  async registar(data) {
    const req = await this.client.post('conta/registar', data);
    return req.data;
  }

  async getUserData(username) {
    const {
      data: { grupo, nome, apelido, email, id },
    } = await this.client.get('conta/getUserData', {
      params: {
        username,
      },
    });
    AsyncStorage.setItem('USERNAME', username);
    AsyncStorage.setItem('GRUPO', grupo);
    AsyncStorage.setItem('NOME', nome);
    AsyncStorage.setItem('APELIDO', apelido);
    AsyncStorage.setItem('EMAIL', email);
    AsyncStorage.setItem('ID', stringifySafe(id));
  }

  async login(data) {
    const { username } = data;
    const {
      data: { access_token: accessToken },
    } = await this.client.post('conta/login', data);

    await this.getUserData(username);
    AsyncStorage.setItem('TOKEN', accessToken);
  }

  async atualizar(data) {
    const { username } = await this.client.patch('conta/myAccountUpdate', data);
    return this.getUserData(username);
  }

  async listar() {
    const { data } = await this.client.get('conta/findAll');
    return data;
  }
}

export default new UserService(Config);
