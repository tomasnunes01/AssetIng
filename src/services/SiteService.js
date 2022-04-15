import axios from "axios";
import Config from "../../util/Config";

class SiteService {

    async getSites(){
        await axios.get(Config.API_URL + 'conta/getSites')
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
const siteService = new SiteService()
export default siteService
