import * as dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { logger } from './services/logging/logging';
import routes from './routes';


const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3001;

app.use(cors());

let imagesFolder = process.env.IMAGE_FOLDER;
if(process.env.NODE_ENV === 'development'){ // Use local folder if on dev environment 
    imagesFolder = path.join(__dirname, process.env.IMAGE_FOLDER);
}

app.use(express.static(imagesFolder));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//app.use(allowedRequestMiddleware); // Defend against trace attacks
app.use(cookieParser());

app.set('trust proxy', 1)

app.use('/', routes);


server.listen(port, ()=>{
    logger.log('info',`Server started on port: ${port}!`);
    logger.log('info',`Environment:${process.env.NODE_ENV}`);
    logger.log('info',`Static path: ${imagesFolder}`);
});

function allowedRequestMiddleware(allowedRequestMiddleware: any) {
    throw new Error("Function not implemented.");
}
