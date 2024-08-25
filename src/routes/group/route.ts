//external
import StandardError from 'standard-error';
import express from 'express';

//internal
import { Status } from '../../enum/httpStatus';
import { validateGroupFields } from './helper';
import { Group } from '../../models/group';


export class GroupRoutes {

    public static createGroup = async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
        try {
            const { name, usersId } = req.body;
            const userId = req.user?._id;   //also include group creator in userlist
            usersId.push(String(userId));

            validateGroupFields(req.body);

            const groupCreated = await Group.create({
                name,
                members: usersId
            });


            const resObj: any = {
                data: groupCreated,
            };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error.code || Status.SERVICE_UNAVAILABLE).send({ message: error.message });
        }
    }

    public static getAllGroupsList = async (
        req: express.Request | any,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const userId = req.user?._id;
            
            const data = await Group.find({members: {$in: [userId]}}).select({name: 1}).lean();
            const resObj: any = { data };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error.code || Status.SERVICE_UNAVAILABLE).send({ message: error.message });
        }
    }
}
