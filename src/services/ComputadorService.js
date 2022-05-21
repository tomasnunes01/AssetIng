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

  async delete(id) {
    const response = await this.client.delete('computador', {
      params: {
        nr_serie: id,
      },
    });
    return response.data;
  }

  async atualizar(data) {
    return this.client.patch('computador/atualizar', data);
  }

  async findByID(id) {
    const { data } = await this.client.get('computador/findByID', {
      params: {
        id,
      },
    });
    return data;
  }
}
export default new ComputadorService(Config);
