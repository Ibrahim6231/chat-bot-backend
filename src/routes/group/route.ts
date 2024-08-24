//external
import StandardError from 'standard-error';
import express from 'express';

//internal
import { envConfig } from '../../config/config';
import { Status } from '../../enum/httpStatus';
import { validateGroupFields } from './helper';
import { Group } from '../../models/group';


export class GroupRoutes {

    public static createGroup = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const { name, adminId, members } = req.body;

            validateGroupFields(req.body);

            const groupCreated = await Group.create({
                name,
                adminId,
                members
            });


            const resObj: any = {
                code: Status.OK,
                data: groupCreated,
            };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error.code || Status.SERVICE_UNAVAILABLE).send({ message: error.message });
        }
    }
}
