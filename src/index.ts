import config from 'config';
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import createRoutes from './core/routes';
import createSocket from './core/socket';

const app = express();
const http = createServer(app);
const io = createSocket(http);

createRoutes(app, io);

io.on('connection', function (socket: any) {
	console.log('a user connected');
});

const PORT = config.get('port') || 3001;

async function start() {
	try {
		await mongoose.connect(config.get('mongoUri'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});
		http.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
	} catch (e) {
		console.log('Server error', e.message);
		process.exit(1);
	}
}

start();
