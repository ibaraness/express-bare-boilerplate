import express, { NextFunction, Request, Response } from "express";
import { logger } from "../services/logging/logging";

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

export default router;