import jwt from 'jsonwebtoken';
import StandardError from 'standard-error';
import validator from 'validator';
import { INVITE_TOKEN_EXPIRY } from '../../constants/common';
import { Status } from '../../enum/httpStatus';
import { EmailService } from '../../services/email';
import { Invite } from '../../models/inviteUsers';
import { InviteStatus } from '../../enum/modelsEnum';

const FRONTEND_URL = process.env.FRONTEND_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const inviteUsersHelper = async ({ email, role }) => {

  //create invite token
  const inviteTokenPayload = {
    email,
    role,
    expires: +new Date() + INVITE_TOKEN_EXPIRY,
  }
  const token = jwt.sign(inviteTokenPayload, JWT_SECRET);


  //create invite entry in DB
  const inviteData = {
    ...inviteTokenPayload,
    token,
    status: InviteStatus.PENDING,
  }
  const isExistInvite = await Invite.findOne({ email }).lean();
  if (isExistInvite) {
    await Invite.findByIdAndUpdate(isExistInvite._id, inviteData, { new: true })
  } else {
    await Invite.create(inviteData)
  }


  //create invite mail data
  const host = `${FRONTEND_URL}`;
  const link = `${host}/register?inviteToken=${token}`;
  const mailData = { email, link };

  const emailService = new EmailService();
  await emailService.inviteUserEmail(mailData);

  return {
    message: `Mail with invite sent successfully`,
    link
  };
}



export {
  inviteUsersHelper,
}