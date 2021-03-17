import bcrypt from 'bcrypt';
import express from 'express';
import { validationResult } from 'express-validator';
import socket from 'socket.io';
import { UserModel } from '../models';
import { createJWToken } from '../utils/index';

class UserController {
	io: socket.Server;

	constructor(io: socket.Server) {
		this.io = io;
	}
	show = (req: express.Request, res: express.Response) => {
		const id: any = req.params.id;
		UserModel.findById(id, (err: any, user: any) => {
			if (err) {
				return res.status(404).json({
					message: 'User not found',
				});
			}
			res.json(user);
		});
	};

	getMe = (req: any, res: express.Response) => {
		const id: string = req.user._id;
		UserModel.findById(id, (err: any, user: any) => {
			if (err || !user) {
				return res.status(404).json({
					message: 'User not found',
				});
			}
			res.json(user);
		});
	};

	findUsers = (req: any, res: express.Response) => {
		const query: string = req.query.query;
		UserModel.find()
			.or([{ fullname: new RegExp(query, 'i') }, { email: new RegExp(query, 'i') }])
			.then((users: any) => res.json(users))
			.catch((err: any) => {
				return res.status(404).json({
					status: 'error',
					message: err,
				});
			});
	};

	delete = (req: express.Request, res: express.Response) => {
		const id: string = req.params.id;
		UserModel.findOneAndRemove({ _id: id })
			.then((user) => {
				if (user) {
					res.json({
						message: `User ${user.username} deleted`,
					});
				}
			})
			.catch(() => {
				res.json({
					message: `User not found`,
				});
			});
	};

	create = (req: express.Request, res: express.Response) => {
		const postData = {
			email: req.body.email,
			username: req.body.username,
			password: req.body.password,
		};

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const user = new UserModel(postData);

		user
			.save()
			.then((obj: any) => {
				res.json(obj);
			})
			.catch((reason) => {
				res.json(reason);
				res.status(500).json({
					status: 'error',
					message: reason,
				});
			});
	};

	verify = (req: express.Request, res: express.Response) => {
		const hash: any = req.query.hash;

		if (!hash) {
			return res.status(422).json({ errors: 'Invalid hash' });
		}

		UserModel.findOne({ confirm_hash: hash }, (err: any, user: any) => {
			if (err || !user) {
				return res.status(404).json({
					status: 'error',
					message: 'Hash not found',
				});
			}

			user.confirmed = true;
			user.save((err: any) => {
				if (err) {
					return res.status(404).json({
						status: 'error',
						message: err,
					});
				}

				res.json({
					status: 'success',
					message: 'Аккаунт успешно подтвержден!',
				});
			});
		});
	};

	login = (req: express.Request, res: express.Response) => {
		const postData = {
			email: req.body.email,
			password: req.body.password,
		};

		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		UserModel.findOne({ email: postData.email }, (err: any, user: any) => {
			if (err || !user) {
				return res.status(404).json({
					message: 'User not found',
				});
			}

			if (bcrypt.compareSync(postData.password, user.password)) {
				const token = createJWToken(user);
				res.json({
					status: 'success',
					token,
				});
			} else {
				res.status(403).json({
					status: 'error',
					message: 'Incorrect password or email',
				});
			}
		});
	};
}

export default UserController;
