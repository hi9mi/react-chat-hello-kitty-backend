import express from 'express';
import { UserModel } from '../models/';

export default function updateLastSeen(req: express.Request, res: express.Response, next: express.NextFunction) {
	UserModel.findOneAndUpdate({ _id: '603b99128124d01c4c6b196e' }, { last_seen: new Date() }, { new: true }, () => {});

	next();
}
