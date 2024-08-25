import validator from 'validator';
import StandardError from 'standard-error';
import { Status } from '../../enum/httpStatus';
import { User } from "../../models/user";
import { UserRole } from '../../enum/modelsEnum';


export class UserHelper {

    public static findAll = async ({ page = 1, limit = 50, searchValue = "", sort = 1 }: { page?: number, limit?: number, searchValue?: string, sort?: number }) => {
        const skip = (page - 1) * limit;
        const limits = Number(limit);
        const sortOrder = sort || 1
        if (searchValue.length) {
            const searchQuery = { $regex: `.*${searchValue}.*`, $options: 'i' };
            return await User.aggregate([
                {
                    $match: {
                        $and: [
                            { isDeleted: false },
                            {
                                $or: [
                                    { email: searchQuery },
                                    { "name.first": searchQuery },
                                    { "name.last": searchQuery }
                                ]
                            }
                        ]
                    },
                },
                {
                    $facet: {
                        data: [
                            {
                                $skip: skip,
                            },
                            {
                                $limit: limits,
                            },
                            { $sort: { 'name.first': sortOrder } },
                        ],
                        count: [
                            {
                                $count: 'count',
                            },
                        ],
                    },
                },
            ]);
        } else {
            return await User.aggregate([
                {
                    $match: {
                        isDeleted: false
                    }
                },
                {
                    $facet: {
                        data: [
                            {
                                $sort: { 'createdAt': sortOrder }
                            },
                            {
                                $skip: skip,
                            },
                            {
                                $limit: limits,
                            },
                        ],
                        count: [
                            {
                                $count: 'count',
                            },
                        ],
                    },
                },
            ]);
        }
    }


    public static findById = async (userId: string) => {
        return User.findById(userId).lean();
    }

    public static findOneAndDelete = async (id: string) => {
        return User.findByIdAndUpdate(id, { $set: { isDeleted: true } });
    }

    public static validateUpdateFields = ({ email, password, name, role }: any) => {

        if (role && ![UserRole.ADMIN, UserRole.USER].includes(role)) {
            throw new StandardError({ message: 'Invalid role', code: Status.UNPROCESSABLE_ENTITY });
        }
        if (name && !validator.matches(`${name.first} ${name.last}`, /^[a-zA-Z ]{2,30}$/)) {
            throw new StandardError({ message: 'Invalid name, valid Charactors include (A-Z) (a-z)', code: Status.UNPROCESSABLE_ENTITY });
        }

        if (email && !validator.isEmail(email)) {
            throw new StandardError({ message: 'Invalid email', code: Status.UNPROCESSABLE_ENTITY });
        }

        if (password && !validator.isStrongPassword(password)) {
            throw new StandardError({ message: 'Password must contain at least 8 characters, including upper and lowercase characters, a number and a special character.', code: Status.UNPROCESSABLE_ENTITY });
        }
    };
}
