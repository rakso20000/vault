import {addEndpoint} from './endpoints.js';
import {dbClient} from './dbClient.js';

addEndpoint('createAccount', 'POST', async ({username, password}) => {
	
	const result = await dbClient.query(`
		INSERT INTO users (
			username,
			password
		) VALUES (
			$1,
			$2
		) ON CONFLICT DO NOTHING;
	`, [
		username,
		password
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