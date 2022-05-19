import axios from 'axios';
import Config from '../../util/Config';

class ComputadorService {
  constructor(config) {
    const { API_URL: baseURL } = config;
    this.client = axios.create({ baseURL });
  }

  async listarTipos() {
    const { data } = await this.client.get('escritorio/findAll');
    return data;
  }
}
export default new ComputadorService(Config);
