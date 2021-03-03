import mongoose, { Document, Schema } from 'mongoose';

export interface IDialog extends Document {
	partner: string;
	author: string;
	messages: [string];
}

const DialogSchema = new Schema(
	{
		partner: { type: Schema.Types.ObjectId, ref: 'User' },
		author: { type: Schema.Types.ObjectId, ref: 'User' },
		lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
	},
	{
		timestamps: true,
	},
);

const DialogModel = mongoose.model<IDialog>('Dialog', DialogSchema);

export default DialogModel;
