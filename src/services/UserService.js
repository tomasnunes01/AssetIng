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
    AsyncStorage.setItem('MYUSERNAME', username);
    AsyncStorage.setItem('MYGRUPO', grupo);
    AsyncStorage.setItem('MYNOME', nome);
    AsyncStorage.setItem('MYAPELIDO', apelido);
    AsyncStorage.setItem('MYEMAIL', email);
    AsyncStorage.setItem('MYID', stringifySafe(id));
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
    await this.getUserData(data.username);
    return this.client.patch('conta/AccountUpdate', data);
  }

  async atualizarConta(data) {
    return this.client.patch('conta/AccountUpdate', data);
  }

  async listar() {
    const { data } = await this.client.get('conta/findAll');
    return data;
  }

  async findByID(id) {
    const { data } = await this.client.get('conta/findByID', {
      params: { id },
    });
    return data;
  }

  async delete(id) {
    const response = await this.client.delete('conta', {
      params: {
        id,
      },
    });
    return response.data;
  }
}

export default new UserService(Config);
