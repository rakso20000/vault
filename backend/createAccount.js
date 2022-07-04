import {addEndpoint} from './endpoints.js';
import {dbClient} from './dbClient.js';

addEndpoint('createAccount', 'POST', async ({username, hash, salt}) => {
	
	const result = await dbClient.query(`
		INSERT INTO users (
			username,
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
	
	if (result.rowCount === 0)
		return {
			success: false,
			error: 'USERNAME_TAKEN'
		};
	
	return {
		success: true
	};
	
});