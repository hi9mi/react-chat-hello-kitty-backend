import config from 'config';
import jwt from 'jsonwebtoken';

export default function verifyJWToken(token: string) {
	return new Promise((resolve: any, reject: any) => {
		jwt.verify(token, config.get('jwtSecret'), (err, decodedData) => {
			if (err || !decodedData) {
				return reject(err);
			}
			resolve(decodedData);
		});
	});
}
