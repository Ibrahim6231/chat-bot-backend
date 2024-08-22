//external imports
import jwt from "jsonwebtoken";
import express from 'express';

//internal files
import { Status } from '../enum/httpStatus';
import StandardError from 'standard-error';
import { envConfig } from '../config/config';
import { UserHelper } from '../routes/user/helpers';


export class Middleware {
    static JWT_SECRET: string = envConfig.JWT_SECRET || 'i am secret key';

    public authenticateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {

            const token = req.headers.authorization;
            if (!token) throw new StandardError({ code: Status.UNAUTHORIZED, message: "token required" });

            const decode: any = jwt.verify(token, Middleware.JWT_SECRET, (err, decoded) => {
                if (err) return false
                else return decoded
            });


            if (!decode) throw new StandardError({ code: Status.UNAUTHORIZED, message: "invalid token" });

            const user = await UserHelper.findById(decode.id);
            if (!user) {
                throw new StandardError({ message: 'Invalid credentials, Enter correct email & password', code: Status.NOT_FOUND });
            }

            //@ts-ignore
            req.user = user;
            next();
        } catch (error: any) {
            return res.status(error.code || 500).send({ status: false, message: error.message })
        }
    }
}