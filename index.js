import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import Data from "./DB/data.js";
import * as dotenv from "dotenv";
import JSON_Format from "./models/parseHTML.js";
import serverless from 'serverless-http';

dotenv.config();

const API_PORT = 3001;

const router = express.Router();

const app = express();

// allow app request from any domain
app.use(cors({ origin: "*" }));

// bodyParser, parse the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//disabled the code block below until mongodb connection string is provided as an environment variable.
/*
mongoose.set('strictQuery', false)

// connect our back end code with the Mongo database
mongoose.connect(process.env.MONGO_URI);

let db = mongoose.connection;

// connecting to DB
db.once("open", () => console.log("connected to database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

*/





// define the GET route
router.get("/getJSONDoc", (req, res) => {
    const { url } = req.params;

    console.warn("fetching parsed HTML doc...");

    let newData = new Data();

    const responsePromose = JSON_Format(url);

    Promise.resolve(responsePromose).then(response => {
        console.log(response);

        if (response.success) {
            // disabled the code block below until a mongo connection string is provided as an environment variable
            /*
            console.warn("saving data to MongoDB...");

            newData.documentJSON = response.data;

            newData.save().then(doc => {
                console.warn("saved data to MongoDB...")
                res.json({ success: true, data: doc })
            }).catch(error => res.json({ success: false, error }));
            */
           res.json({response});
        }
        else {
            console.warn("failed fetcing parsed doc", response.error);

            res.json(response);
        }
    })
});

router.get("/", (req, res) => {
    res.json({success: false, message: "please use 'getJSONDoc' endpoint"})
})


// append /api for our http requests
app.use("/", router);

// launch server into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

// export handler for AWS lambda funciton
// export const handler = serverless(app);