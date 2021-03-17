import http from 'http';
const socket = require('socket.io');

export default (http: http.Server) => {
	const io = socket(http);

	io.on('connection', function (socket: any) {
		socket.on('DIALOGS:JOIN', (dialogId: string) => {
			socket.dialogId = dialogId;
			socket.join(dialogId);
		});
		socket.on('DIALOGS:TYPING', (obj: any) => {
			socket.broadcast.emit('DIALOGS:TYPING', obj);
		});
	});

	return io;
};
