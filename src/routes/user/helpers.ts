import { User } from "../../models/user"


export class UserHelper{

    public static findById = async (userId: string) => {
        return User.findById(userId).lean();
    } 
}