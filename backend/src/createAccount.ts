import {addEndpoint} from './endpoints';
import {db} from './db';
import {UnprocessableEntity} from 'http-errors';

type Args = {
	username: string;
	hash: string;
	salt: string;
};

addEndpoint<Args>('createAccount', 'PUT', {
	username: 'string',
	hash: 'base64',
	salt: 'base64'
}, async ({username, hash, salt}) => {
	
	const user = await db.oneOrNone(`
		INSERT INTO users (
			name,
			password_hash,
			password_salt
		) VALUES (
			$1,
			$2,
			$3
		) ON CONFLICT DO NOTHING;
	`, [
		username,
		hash,
		salt
	]);
	
	if (user === null)
		throw new UnprocessableEntity('USERNAME_TAKEN');
	
});