import axios from "axios";
import Config from "../../util/Config";

class EscritorioService {

    async findAll(){
        const { data } = await axios.get(Config.API_URL + 'escritorio/findAll');
        return data;
    }

    async findOne(cod_escritorio){
        const { data } = await axios.get(Config.API_URL + 'escritorio/findOne',{
            params: {
                cod_escritorio: cod_escritorio
            }
        });
        return data;
    }
}
const escritorioService = new EscritorioService()
export default escritorioService
