import {addEndpoint} from './endpoints.js';
import {dbClient} from './dbClient.js';

addEndpoint('getFolders', 'POST', async ({username}) => {
	
	const result = await dbClient.query(`
		SELECT name FROM folders WHERE
			owner = $1
		ORDER BY id;
	`, [
		username
	]);
	
	const folders = result.rows.map(row => row.name);
	
	return {
		success: true,
		folders
	};
	
});