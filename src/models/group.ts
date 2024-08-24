import * as mongoose from 'mongoose';
import { visibilityPlugin } from './plugins/visibility';
const ObjectId = mongoose.Schema.Types.ObjectId;

/*
{
  "_id": ObjectId("..."), // Unique group ID
  "name": "Group Name",   // Name of the group
  "adminId": ObjectId("..."), // Reference to the user's _id who is the admin
  "members": [
    {
      "userId": ObjectId("..."), // Reference to the user's _id
      "joinedAt": ISODate("...")  // Date when the user joined the group
    }
  ],
  "createdAt": ISODate("..."),   // Group creation date
  "updatedAt": ISODate("...")    // Last update date
}
*/
export interface iGroup {
  name: string; //group name
  adminId: string;
  members: Array<string>;
  createdAt: string;
  updatedAt: string;
}

export const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adminId: { type: ObjectId, required: true },
  members: {
    type: [{ type: ObjectId }],
    default: []
  }
}, { timestamps: true, versionKey: false });


GroupSchema.plugin(visibilityPlugin);
export const Group = mongoose.model('Group', GroupSchema);

