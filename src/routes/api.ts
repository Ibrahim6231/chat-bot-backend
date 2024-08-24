import * as express from "express";
import { AuthRouter } from "./auth";
import { Middleware } from "../services/middleware";
import { GroupRouter } from "./group";
import { AdminRouter } from "./admin";
// import { valiadateTokenInDetail } from "./admin/helper";

//test
{
    // valiadateTokenInDetail()
}


export const api = express.Router();

//👉open routes
api.use("/auth", new AuthRouter().router);

//👉completely authenticated routes
api.use(new Middleware().authenticateUser);     //login check
api.use("/group", new GroupRouter().router);

//Only admin routes
api.use(new Middleware().authenticateAdmin);    //admin check
api.use("/admin", new AdminRouter().router);


