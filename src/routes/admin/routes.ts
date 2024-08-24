//external
import validator from 'validator';
import StandardError from 'standard-error';
import express from 'express';

//internal
import { Status } from '../../enum/httpStatus';
import { inviteUsersHelper } from './helper';
import { Invite } from '../../models/inviteUsers';
import { InviteStatus, UserRole } from '../../enum/modelsEnum';


export class AdminRoutes {

  public static inviteUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      let { email, role } = req.body;

      if (!email) {
        throw new StandardError({ message: 'Email is required', code: Status.UNPROCESSABLE_ENTITY });
      }

      if (!validator.isEmail(email)) {
        throw new StandardError({ message: 'Invalid email', code: Status.UNPROCESSABLE_ENTITY });
      }

      email = email.toLowerCase();
      !role && (role = UserRole.USER);

      const data = await inviteUsersHelper({ email, role });
      res.locals.code = Status.OK;
      res.locals.res_obj = { data };

      const resObj: any = {
        code: Status.OK,
        data,
      };
      return res.status(Status.OK).send(resObj);
    } catch (error) {
      return res.status(error.code || Status.SERVICE_UNAVAILABLE).send({ message: error.message });
    }
  }

}



