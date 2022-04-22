import axios from 'axios';
import Config from '../../util/Config';

class EscritorioService {
  constructor(config) {
    const { API_URL: baseURL } = config;
    this.client = axios.create({ baseURL });
  }

  async findAll() {
    const { data } = await this.client.get('escritorio/findAll');
    return data;
  }

  async findOne(id) {
    const { data } = await this.client.get('escritorio/findOne', {
      params: {
        cod_escritorio: id,
      },
    });
    return data;
  }
}
export default new EscritorioService(Config);
