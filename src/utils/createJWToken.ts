import config from 'config';
import jwt from 'jsonwebtoken';
import { reduce } from 'lodash';

export default function createJWToken(user: any) {
	let token = jwt.sign(
		{
			data: reduce(
				user,
				(result: any, value, key) => {
					if (key !== 'password') {
						result[key] = value;
					}

					return result;
				},
				{},
			),
		},
		config.get('jwtSecret'),
		{
			expiresIn: config.get('maxAge'),
			algorithm: 'HS256',
		},
	);

	return token;
}
