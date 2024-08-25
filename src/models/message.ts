import * as mongoose from 'mongoose';
import { visibilityPlugin } from './plugins/visibility';
const ObjectId = mongoose.Schema.Types.ObjectId;


export interface iMessage {
  _id: string;        //unique messageId
  senderId: string;
  groupId: string; //groupId reference
  content: string;    //incase of image or video, its link in string format will be saved here
  msgType?: string;       //text,  inage, video
  createdAt: string;
  updatedAt: string;
}

export const MessageSchema = new mongoose.Schema({

  senderId: { type: ObjectId, ref: "User", required: true },
  groupId: { type: ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  msgtype: { type: String },
  likes: { type: [ObjectId], default: [] }

}, { timestamps: true, versionKey: false });


// MessageSchema.plugin(visibilityPlugin);  //plugins not required in message schema
export const Message = mongoose.model('Message', MessageSchema);

