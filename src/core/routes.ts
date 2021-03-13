import cors from 'cors';
import express from 'express';
import { DialogController, MessageController, UserController } from '../controllers/index';
import { checkAuth, updateLastSeen } from '../middleware/index';
import { loginValidation, registrationValidation } from '../utils/validations';


const createRoutes = (app: any, io: any) => {
	const User = new UserController(io);
	const Dialog = new DialogController(io);
	const Messages = new MessageController(io);

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(checkAuth);
	app.use(updateLastSeen);
	app.use(cors());

	app.get('/user/me', User.getMe);
	app.get('/user/registration/successful', User.verify);
	app.post('/user/registration', registrationValidation, User.create);
	app.post('/user/login', loginValidation, User.login);
	app.get('/user/:id', User.show);	
	app.delete('/user/:id', User.delete);


	app.get('/dialogs', Dialog.index);
	app.post('/dialogs', Dialog.create);
	app.delete('/dialogs/:id', Dialog.delete);

	app.get('/messages', Messages.index);
	app.post('/messages', Messages.create);
	app.delete('/messages/:id', Messages.delete);
};

export default createRoutes;
