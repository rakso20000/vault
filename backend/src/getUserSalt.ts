import {addEndpoint} from './endpoints';
import {dbClient} from './dbClient';

type Args = {
	username: string;
};

addEndpoint<Args>('getUserSalt', 'POST', async ({username}) => {
	
	const response = await dbClient.query(`
		SELECT password_salt FROM users WHERE
			name = $1;
	`, [
		username
	]);
	
	if (response.rowCount === 0)
		return {
			success: false,
			error: 'UNKNOWN_USER'
		};
	
	const salt = response.rows[0].password_salt;
	
	return {
		success: true,
		salt
	};
	
});