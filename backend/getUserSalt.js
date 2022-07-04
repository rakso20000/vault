import {addEndpoint} from './endpoints.js';
import {dbClient} from './dbClient.js';

addEndpoint('getUserSalt', 'POST', async ({username}) => {
	
	const response = await dbClient.query(`
		SELECT password_salt FROM users WHERE
			username = $1;
	`, [
		username
	]);
	
	if (response.rowCount === 0)
		return {
			success: false,
			error: 'UNKNOWN_USER'
		};
	
	const salt = response.rows[0].password_salt;
	
	console.log(response.rows);
	
	return {
		success: true,
		salt
	};
	
});