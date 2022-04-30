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

  async findByID(id) {
    const { data } = await this.client.get('escritorio/findByID', {
      params: {
        id,
      },
    });
    return data;
  }
}
export default new EscritorioService(Config);
