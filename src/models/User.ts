import { check } from 'express-validator';
import mongoose, { Document, Schema } from 'mongoose';
import { generatePasswordHash } from '../utils/index';
import isEmail from 'validator/lib/isEmail';

export interface IUser extends Document {
	email: string;
	username: string;
	password: string;
	confirmed?: boolean;
	avatar?: string;
	confirm_hash?: string;
	last_seen?: Date;
}

const UserSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			validate: [isEmail, 'Invalid email'],
			unique: true,
		
		},
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		confirmed: {
			type: Boolean,
			default: false,
		},
		avatar: String,
		confirm_hash: String,
		last_seen: {
			type: Date,
			default: new Date(),
		},
	},
	{
		timestamps: true,
	},
);

UserSchema.pre('save', function (next) {
	const user: any = this;

	if (!user.isModified('password')) return next();

	generatePasswordHash(user.password)
		.then((hash: any) => {
			user.password = String(hash);
			next();
		})
		.catch((err: any) => {
			next(err);
		});
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
