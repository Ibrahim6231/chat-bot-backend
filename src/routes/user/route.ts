// NPM Dependencies
import * as express from 'express';
import * as StandardError from 'standard-error';

// Internal Dependencies
import { Status } from '../../enum/httpStatus';
import { UserHelper } from './helper';
import { User } from '../../models/user';
import { UserRole } from '../../enum/modelsEnum';

export class UserRoutes {

    public static getUsersByQuery = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const query: { page?: number, limit?: number, searchValue?: string, sort?: number } = req.query;
            const { page = 1, limit = 50, searchValue = '', sort = 1 } = query;
            const data = await UserHelper.findAll({
                page,
                limit,
                searchValue,
                sort
            });
            const resObj: any = { data };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error?.code || Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }

    public static getAllUsersNameNId = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const data = await User.find().select({ name: 1, email: 1 }).lean();
            data.forEach(ele => {
                ele.fullName = ele.name.first + (ele.name.last || "") + ` [${ele.email}]`;
                delete ele.name;
                delete ele.email;
            })
            const resObj: any = { data };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error.code || Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }

    public static updateUser = async (
        req: express.Request | any,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const { name, email, role } = req.body;
            const targetUserId = req.params.id;
            const requestMakerId = req.user?._id;
            const userRole = req.user?.role;

            if ((targetUserId == requestMakerId) || (userRole === UserRole.ADMIN)) {
                //then only authorized to update a user
            } else {
                throw new StandardError({ message: "Not authorized", code: Status.UNAUTHORIZED });
            }

            UserHelper.validateUpdateFields(req.body);

            const updateFields: any = {};
            if (name) updateFields.name = name;
            if (role) updateFields.role = role;
            if (email) updateFields.email = email;

            const updatedUser = await User.findByIdAndUpdate(
                targetUserId,
                updateFields,
                { new: true }
            );

            if (!updatedUser) {
                throw new StandardError({ message: "User not found", code: Status.NOT_FOUND });
            }

            const resObj = { data: updatedUser };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error?.code || Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }

    public static softDeleteById = async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
        try {
            const targetUserId = req.params.id;
            const requestMakerId = req.user?._id;
            const userRole = req.user?.role;

            if ((targetUserId == requestMakerId) || (userRole === UserRole.ADMIN)) {
                //then only authorized to update a user
            } else {
                throw new StandardError({ message: "Not authorized", code: Status.UNAUTHORIZED });
            }

            const userWithDeleteFlag = await User.findByIdAndUpdate(
                targetUserId,
                { isDeleted: true, isVisible: false },
                { new: true }
            );

            if (!userWithDeleteFlag) {
                throw new StandardError({ message: "User not found", code: Status.NOT_FOUND });
            }

            const resObj = { data: userWithDeleteFlag };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error?.code || Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }
}
