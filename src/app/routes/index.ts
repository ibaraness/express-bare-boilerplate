import express, { NextFunction, Request, Response } from "express";
import { logger } from "../services/logging/logging";
import { fromPath } from "pdf2pic";
import path from "path";
import fs from "fs";
import pdfPoppler from "./pdf-convert";

const router = express.Router();

declare module 'express-session' {
    export interface SessionData {
        user: { [key: string]: any };
    }
}

export const sampleMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try {
        if(false){
            throw new Error('User is not logged in!');
        }
        next();
    }catch(e) {
        logger.error(e.message);
        res.status(401).send("Unauthorized!")
    }
}

router.get("/", sampleMiddleware, async (req: any, res) => {
    try {
      res.send({"message":"connected to server"});
    } catch (e) {
      logger.log("error", e.message);
      res.status(500).send(e.message);
    }
  });



router.get("/convert-pdf", async (req: Request, res: Response) => {
    const imagesFolder = path.join(__dirname, '../../../public/');
    const pdf = path.join(__dirname, '../../../public/1.pdf');
    const options = {
        density: 100,
        saveFilename: "1_image",
        savePath: imagesFolder,
        format: "png",
        width: 600,
        height: 600
    };

    try {
        // Check if file exist
        const isFileExist = fs.existsSync(pdf);
        logger.log("info", pdf);
        const convert = fromPath(pdf, options);
        await convert(1);
        res.send({"fileExist":isFileExist});
    }catch(e){
        logger.log("error", e.message);
            res.status(500).send(e.message);
        }
});

router.use('/', pdfPoppler);

export default router;