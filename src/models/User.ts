import { differenceInMinutes } from 'date-fns';
import mongoose, { Document, Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { generatePasswordHash } from '../utils';

export interface IUser extends Document {
	email?: string;
	username?: string;
	password?: any;
	confirmed?: boolean;
	avatar?: string;
	confirm_hash?: string;
	last_seen?: Date;
}

const UserSchema = new Schema(
	{
		email: {
			type: String,
			require: true,
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

UserSchema.virtual('isOnline').get(function (this: any, Date: any) {
	return differenceInMinutes(new Date().toISOString(), this.last_seen) < 5;
});

UserSchema.set('toJSON', {
	virtuals: true,
});

UserSchema.pre('save', async function (next) {
	const user: any = this;

	if (!user.isModified('password')) {
		return next();
	}

	user.password = await generatePasswordHash(user.password);
	user.confirm_hash = await generatePasswordHash(new Date().toString());
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
