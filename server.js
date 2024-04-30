import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import Data from "./DB/data.js";
import * as dotenv from "dotenv";
import JSON_Format from "./models/parseHTML.js";

dotenv.config();

const API_PORT = 3001;

const router = express.Router();

const app = express();

// allow app request from any domain
app.use(cors({ origin: "*" }));

// bodyParser, parse the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set('strictQuery', false)

// connect our back end code with the Mongo database
mongoose.connect(process.env.MONGO_URI);

let db = mongoose.connection;

// connecting to DB
db.once("open", () => console.log("connected to database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// define the GET route
router.get("/getJSONDoc", (req, res) => {
    const { webLink } = req.params;

    let newData = new Data();
    const responsePromose = JSON_Format(webLink);
    Promise.resolve(responsePromose).then(response => {
        console.log(response);

        if (response.success) {
            newData.documentJSON = response.data;
            newData.save().then(doc => {
                res.json({ success: true, data: doc })
            }).catch(error => res.json({ success: false, error }))
        }
        else res.json(response);
    })
})


// append /api for our http requests
app.use("/", router);

// launch server into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));