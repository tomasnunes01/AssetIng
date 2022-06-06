import axios from 'axios';
import Config from '../../util/Config';

class SoftwareService {
  constructor(config) {
    const { API_URL: baseURL } = config;
    this.client = axios.create({ baseURL });
  }

  async listarTipos() {
    const { data } = await this.client.get('software/listTypes');
    return data;
  }

  async listarLicencas() {
    const { data } = await this.client.get('software/listLicenses');
    return data;
  }

  async findTypeByID(id) {
    const { data } = await this.client.get('software/findTypeByID', {
      params: {
        id,
      },
    });
    return data;
  }

  async registar(data) {
    const req = await this.client.post('software/registar', data);
    return req;
  }

  async findAll() {
    const { data } = await this.client.get('software/findAll');
    return data;
  }

  async delete(id) {
    const response = await this.client.delete('software', {
      params: {
        id,
      },
    });
    return response.data;
  }

  async atualizar(data) {
    return this.client.patch('software/atualizar', data);
  }

  async findByID(id) {
    const { data } = await this.client.get('software/findByID', {
      params: {
        id,
      },
    });
    return data;
  }
}
export default new SoftwareService(Config);
