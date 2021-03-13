import { differenceInMinutes } from 'date-fns';
import mongoose, { Document, Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { generatePasswordHash } from '../utils/index';

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
      validate: [isEmail, "Invalid email"],
      unique: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    avatar: String,
    confirm_hash: String,
    last_seen: {
      type: Date,
      default: new Date()
    }
  },
  {
    timestamps: true
  }
);

UserSchema.virtual("isOnline").get(function(this: any, Date: any) {
  return differenceInMinutes(new Date().toISOString(), this.last_seen) < 5;
});

UserSchema.set("toJSON", {
  virtuals: true
});

UserSchema.pre("save", function(next) {
  const user: IUser = this;

  if (!user.isModified("password")) return next();

  generatePasswordHash(user.password)
    .then(hash => {
      user.password = String(hash);
      generatePasswordHash(+new Date() + '').then(confirmHash => {
        user.confirm_hash = String(confirmHash);
        next();
      });
    })
    .catch(err => {
      next(err);
    });
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
