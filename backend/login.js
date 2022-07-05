import {addEndpoint} from './endpoints.js';
import {dbClient} from './dbClient.js';

addEndpoint('login', 'POST', async ({username, hash}) => {
	
	const response = await dbClient.query(`
		SELECT password_hash FROM users WHERE
			name = $1;
	`, [
		username
	]);
	
	if (response.rowCount === 0)
		return {
			success: false,
			error: 'UNKNOWN_USER'
		};
	
	if (response.rows[0].password_hash !== hash)
		return {
			success: false,
			error: 'INCORRECT_PASSWORD'
		};
	
	return {
		success: true
	};
	
});