import { check } from 'express-validator';

const loginValidation = [
	check('email').isEmail(),
	check('username').isLength({ min: 3 }),
	check('password').isLength({ min: 3 }),
];

export default loginValidation;
