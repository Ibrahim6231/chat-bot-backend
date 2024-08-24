import * as mongoose from 'mongoose';

export const InviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum : ['Admin', 'User'],
      default: 'User'
    },
    token: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Cancelled", "Pending", "Accepted"],
      default: "Pending",
    }
  },
  { timestamps: true }
);

export const Invite = mongoose.model('Invite', InviteSchema);