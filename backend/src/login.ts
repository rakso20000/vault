import {addEndpoint} from './endpoints';
import {db} from './db';
import {NotFound, Unauthorized} from 'http-errors';

type Args = {
	username: string;
	hash: string;
};

addEndpoint<Args>('login', 'POST', {
	username: 'string',
	hash: 'base64'
}, async ({username, hash}) => {
	
	const user = await db.oneOrNone(`
		SELECT password_hash FROM users WHERE
			name = $1;
	`, [
		username
	]);
	
	if (user === null)
		throw new NotFound('UNKNOWN_USER');
	
	if (user.password_hash !== hash)
		throw new Unauthorized('INCORRECT_PASSWORD');
	
});