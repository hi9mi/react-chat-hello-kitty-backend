import express from 'express';
import socket from 'socket.io';
import { MessageModel } from '../models/index';

class MessageController {
	io: socket.Server;

	constructor(io: socket.Server) {
		this.io = io;
	}
	index(req: express.Request, res: express.Response) {
		const dialogId: any = req.query.dialog;
		MessageModel.find({ dialog: dialogId })
			.populate(['dialog'])
			.exec(function (err: any, messages: any) {
				console.log(err);
				if (err) {
					return res.status(404).json({
						message: 'Messages not found',
					});
				}
				return res.json(messages);
			});
	}

	// show(req: express.Request, res: express.Response) {
	// 	const id: string = req.params.id;
	// 	MessageModel.findById(id, (err: any, user: any) => {
	// 		if (err) {
	// 			return res.status(404).json({
	// 				message: 'User not found',
	// 			});
	// 		}
	// 		res.json(user);
	// 	});
	// }

	create(req: any, res: express.Response) {
		const userId = req.user._id;

		const postData = {
			text: req.body.text,
			dialog: req.body.dialog_id,
			user: userId,
		};
		const message = new MessageModel(postData);
		message
			.save()
			.then((obj: any) => {
				res.send(obj);
			})
			.catch((reason: any) => {
				res.json(reason);
			});
	}

	delete(req: express.Request, res: express.Response) {
		const id: string = req.params.id;
		MessageModel.findOneAndRemove({ _id: id })
			.then((message) => {
				if (message) {
					res.json({
						message: `Message deleted`,
					});
				}
			})
			.catch(() => {
				res.status(404).json({
					message: 'Message not found',
				});
			});
	}
}

export default MessageController;
