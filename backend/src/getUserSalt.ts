import {addEndpoint} from './endpoints';
import {db} from './db';
import {NotFound} from 'http-errors';

type Args = {
	username: string;
};

addEndpoint<Args>('getUserSalt', 'POST', {
	username: 'string'
}, async ({username}) => {
	
	const user = await db.oneOrNone(`
		SELECT password_salt FROM users WHERE
			name = $1;
	`, [
		username
	]);
	
	if (user === null)
		throw new NotFound('UNKNOWN_USER');
	
	return user.password_salt;
	
});