import http from 'http';
const socket = require('socket.io');

export default (http: http.Server) => {
	const io = socket(http);

	io.on('connection', function (socket: any) {
		//
	});

	return io;
};
