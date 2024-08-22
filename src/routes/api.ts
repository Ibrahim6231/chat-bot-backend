import * as express from "express";
import { AuthRouter } from "./auth";
import { Middleware } from "../services/middleware";


export const api = express.Router();

//👉open routes
api.use("/auth", new AuthRouter().router);


//👉partially authenticated & partically open routes



//👉completely authenticated routes
api.use(new Middleware().authenticateUser); //authentication
