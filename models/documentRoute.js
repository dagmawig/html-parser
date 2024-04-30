import api from "../routes/api.js";
import * as dotenv from "dotenv";

dotenv.config()

async function getDocument(webLink) {

    try {
        const response = await api.get(webLink).then(resp => {
            console.log("Response status: ", resp.status);
            return resp.data;
        });

        return response;
    }
    catch (error) {
        console.log(error)
    }

}

export default getDocument;