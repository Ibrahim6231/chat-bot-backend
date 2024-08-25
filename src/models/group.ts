import * as mongoose from 'mongoose';
import { visibilityPlugin } from './plugins/visibility';
const ObjectId = mongoose.Schema.Types.ObjectId;

export interface iGroup {
  name: string; //group name
  members: Array<string>;
  createdAt: string;
  updatedAt: string;
}

export const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: {
    type: [{ type: ObjectId }],
    default: []
  }
}, { timestamps: true, versionKey: false });


GroupSchema.plugin(visibilityPlugin);
export const Group = mongoose.model('Group', GroupSchema);

