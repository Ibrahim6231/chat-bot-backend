//external
import mongoose from 'mongoose';
import StandardError from 'standard-error';
import express from 'express';

//internal
import { Status } from '../../enum/httpStatus';
import { validateMessageFields } from './helper';
import { Message } from '../../models/message';


export class MessageRoutes {

    public static createMessage = async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
        try {
            const { content, groupId, messageType } = req.body;
            const senderId = req.user?._id;

            if (typeof content !== "string" || !content.length) {
                throw new StandardError({ message: "Invalid message content type", code: Status.UNPROCESSABLE_ENTITY });
            }
            if (!senderId || !groupId) {
                throw new StandardError({ message: "Sender & Group Id are required", code: Status.UNPROCESSABLE_ENTITY });
            }

            const savedMessage = await Message.create({
                content,
                senderId,
                groupId,
                messageType
            });


            const resObj = {
                data: savedMessage,
            };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error.code || Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }


    public static getMessageByGroup = async (
        req: express.Request | any,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const groupId = req.params.id;

            const data = await Message.aggregate([
                {
                    $match: { groupId: mongoose.Types.ObjectId(groupId) }
                },
                {
                    $sort: { createdAt: 1 }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'senderId',
                        foreignField: '_id',
                        as: 'senderDetails'
                    }
                },
                {
                    $unwind: '$senderDetails'
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            _id: '$_id',
                            groupId: '$groupId',
                            content: '$content',
                            msgtype: '$msgtype',
                            likes: '$likes',
                            createdAt: '$createdAt',
                            senderId: '$senderDetails._id',
                            sName: '$senderDetails.name.first',
                            sEmail: '$senderDetails.email',
                        }
                    }
                }
            ])

            //need to add more logic for pagination & limit, i.e. to send only limited msgs, not entire
            const resObj = { data };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error.code || Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }

    public static updateMessage = async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
        try {
            const { content, likeIncrement } = req.body;
            const messageId = req.params.id;
            const senderId = req.user?._id;


            if (!senderId) {
                throw new StandardError({ message: "Sender Id is required", code: Status.UNPROCESSABLE_ENTITY });
            }
            if (content && (typeof content !== "string" || !content.length)) {
                throw new StandardError({ message: "Invalid message content type", code: Status.UNPROCESSABLE_ENTITY });
            }

            if (likeIncrement && ![1, -1].includes(likeIncrement)) {
                throw new StandardError({ message: "Invalid likeIncrement format", code: Status.UNPROCESSABLE_ENTITY });
            }

            let savedMessage = null;
            if (likeIncrement) {
                const likeUpdateQuery = likeIncrement === 1
                    ? { $addToSet: { likes: senderId } }    //to prevent multiple likes from same user
                    : { $pull: { likes: senderId } }

                savedMessage = await Message.findByIdAndUpdate(
                    messageId,
                    likeUpdateQuery,
                    { new: true }
                ).lean();
            } else {
                savedMessage = await Message.findByIdAndUpdate(
                    messageId,
                    { content: content },
                    { new: true }
                ).lean()
            }

            const resObj = {
                data: savedMessage,
            };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error.code || Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }

    public static deleteById = async (req: express.Request | any, res: express.Response, next: express.NextFunction) => {
        try {
            const messageId = req.params.messageId;
            const senderIdOnMsg = req.params.senderId;
            const userId = req.user?._id;   //As I have already added req.user in req during authentication middleware


            if (!senderIdOnMsg || !messageId) {
                throw new StandardError({ message: "Sender Id is required", code: Status.UNPROCESSABLE_ENTITY });
            }
            if (senderIdOnMsg != userId) {
                throw new StandardError({ message: "You are not authorized to delete this Message", code: Status.UNAUTHORIZED });
            }

            const deletedMsg = await Message.findByIdAndDelete(messageId).lean();

            if (!deletedMsg) {
                throw new StandardError({ message: "Chat message not found", code: Status.NOT_FOUND })
            }

            const resObj = { data: deletedMsg };
            return res.status(Status.OK).send(resObj);
        } catch (error) {
            return res.status(error.code || Status.INTERNAL_SERVER).send({ message: error.message });
        }
    }
}
