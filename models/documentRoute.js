import api from "../routes/api.js";
import * as dotenv from "dotenv";

dotenv.config()

// creats the logic that fetches the html document
async function getDocument(url) {

    try {
        const response = await api.get(url).then(resp => {
            console.log("Response status: ", resp.status);
            return resp.data;
        });

        return {success: true, data:response};
    }
    catch (error) {
        console.log(error);
        return {success: false, error};
    }

}

export default getDocument;