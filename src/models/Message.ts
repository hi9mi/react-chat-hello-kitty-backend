import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
	text: string;
	unread: { type: boolean; default: boolean };
	dialog: string;
}

const MessageSchema = new Schema(
	{
		text: { type: Schema.Types.String, require: true },
		dialog: { type: Schema.Types.ObjectId, require: true, ref: 'Dialogs' },
		unread: { type: Boolean, default: false },
		user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
	},
	{
		timestamps: true,
	},
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
