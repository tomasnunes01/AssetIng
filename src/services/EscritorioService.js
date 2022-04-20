import axios from "axios";
import Config from "../../util/Config";

class EscritorioService {

    async findAll(){
        await axios.get(Config.API_URL + 'escritorio/findAll')
            .then((response) => {
                console.log(JSON.stringify(response.data))
                return JSON.stringify(response.data)
            })
            .catch(function (error) {
                console.log(error)
                return error
            });
    }
}
const escritorioService = new EscritorioService()
export default escritorioService
