//import * as mongoose from "mongoose";
import {log} from "util";

const express = require('express');
const cors =require('cors');
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');

export const {Schema, model} = require('mongoose');
const mongoose = require('mongoose');
const routerAuth = require('./router/auth-router');
const routerContent = require('./router/content-router');
const routerUsers = require('./router/users-router');

const errorMiddleware = require('./middleware/error-middleware');

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}
const PORT = process.env.PORT || 4001;
const app = express();

app.use(cors({
    credentials: true,
    origin: process.env.API_CLIENT_URL
}));
app.use(cookieParser());
app.use(express.json());
app.use(errorMiddleware);
app.use(fileUpload({}));


//const uri = process.env.DB_URL;
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//const dbCollection = client.db("db1").collection("c1");

//ROUTES
app.use('/auth', routerAuth);
app.use('/content', routerContent);
app.use('/users', routerUsers)

const start = async () => {

    try {
        /*client.connect(async (err:any) => {
            if (err) console.log('Server.ts / start / comment / DB connetion error from DbCheck3/client.connect=', err);
            else console.log('Server.ts / start / comment / Successful connection to MOngoAtlas DB.')
        });*/

        await mongoose.connect(process.env.DB_URL2, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1
        }).then(() => console.log('mongoose connection OK')).catch((err:any) => console.log('monggose err=', err))

        //const collection = client.db("db1").collection("c1");
        /*const result = await dbCollection.insertOne({email: "222@334444444444.com", password: "222"});
        console.log('result111=', result)*/
        //await DbCheck3();

        app.listen( PORT,  () => console.log('The server has started on port ', PORT));
    } catch (e) {
        console.log('DB CONNECTION ERROR from server.ts/start, error:', e);
    }
}

start();

