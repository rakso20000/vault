import {addEndpoint} from './endpoints.js';
import {dbClient} from './dbClient.js';

addEndpoint('login', 'POST', async ({username, password}) => {
	
	const response = await dbClient.query(`
		SELECT password FROM users WHERE
			username = $1;
	`, [
		username
	]);
	
	if (response.rowCount === 0)
		return {
			success: false,
			error: 'UNKNOWN_USER'
		};
	
	if (response.rows[0].password !== password)
		return {
			success: false,
			error: 'INCORRECT_PASSWORD'
		};
	
	return {
		success: true
	};
	
});