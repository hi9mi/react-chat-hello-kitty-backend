import express from 'express';
import { verifyJWToken } from '../utils/index';

export default function updateLastSeen(req: any, res: express.Response, next: express.NextFunction) {
	if (req.path === '/user/login' || req.path === '/user/registration') {
		return next();
	}

	const token: any = req.headers.token;
	verifyJWToken(token)
		.then((user: any) => {
			req.user = user.data._doc;
			next();
		})
		.catch(() => {
			res.status(400).json({ message: 'Invalid auth token provided.' });
		});
}
