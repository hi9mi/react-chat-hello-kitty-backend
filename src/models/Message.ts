import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
	text: string;
	readed: any;
	dialog: string;
}

const MessageSchema = new Schema(
	{
		text: { type: Schema.Types.String, require: true },
		dialog: { type: Schema.Types.ObjectId, require: true, ref: 'Dialogs' },
		readed: { type: Boolean, default: false },
		user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
		attachments: [{ type: Schema.Types.ObjectId, ref: 'UploadFile' }],
	},
	{
		timestamps: true,
		usePushEach: true,
	},
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
