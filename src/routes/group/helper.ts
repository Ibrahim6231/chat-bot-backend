import StandardError from 'standard-error';
import { Status } from "../../enum/httpStatus";

const validateGroupFields = ({ name, usersId }: any) => {
    if (!name?.trim()) {
        throw new StandardError({ message: 'Group name is required', code: Status.UNPROCESSABLE_ENTITY });
    }

    if (!usersId?.length) {
        throw new StandardError({ message: 'Group members are missing', code: Status.UNPROCESSABLE_ENTITY });
    } else {
        for (let memberId of usersId) {
            if (typeof memberId !== "string" || !memberId?.trim()?.length) {
                throw new StandardError({ message: 'Invalid member Id', code: Status.UNPROCESSABLE_ENTITY });
            }
        }
    }
};


export {
    validateGroupFields
}