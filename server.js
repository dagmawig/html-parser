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

app.use(cors({ origin: "*" }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGO_URI);

let db = mongoose.connection;

db.once("open", () => console.log("connected to database"));

db.on("error", console.error.bind(console, "MongoDB connection error:"));


router.get("/getJSONDoc", (req, res) => {
    const { webLink } = req.params;

    let newData = new Data();
    const responsePromose = JSON_Format(webLink);
    Promise.resolve(responsePromose).then(response => {
        console.log(response);

        if(response.success) {
            newData.documentJSON = response.data;
            newData.save().then(doc => {
                res.json({success: true, data: doc})
            }).catch(error=>res.json({success: false, error}))
        }
        else res.json(response);
    })
})



app.use("/", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));