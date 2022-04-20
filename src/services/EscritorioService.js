import axios from "axios";
import Config from "../../util/Config";

class EscritorioService {

    async findAll(){
        // alguém esqueceu-se de retornar a payload
        const { data } = await axios.get(Config.API_URL + 'escritorio/findAll');
        return data;
    }
}
const escritorioService = new EscritorioService()
export default escritorioService
