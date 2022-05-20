import axios from 'axios';
import Config from '../../util/Config';

class ComputadorService {
  constructor(config) {
    const { API_URL: baseURL } = config;
    this.client = axios.create({ baseURL });
  }

  async listarTipos() {
    const { data } = await this.client.get('computador/listTypes');
    return data;
  }

  async registar(data) {
    const req = await this.client.post('computador/registar', data);
    return req;
  }

  async findAll() {
    const { data } = await this.client.get('computador/findAll');
    return data;
  }
}
export default new ComputadorService(Config);
