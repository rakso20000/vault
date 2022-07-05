import {addEndpoint} from './endpoints.js';
import {dbClient} from './dbClient.js';

addEndpoint('getFolders', 'POST', async ({username}) => {
	
	const result = await dbClient.query(`
		SELECT cipher_name FROM folders WHERE
			owner = $1
		ORDER BY id;
	`, [
		username
	]);
	
	const cipherFolderNames = result.rows.map(row => row.cipher_name);
	
	return {
		success: true,
		cipherFolderNames
	};
	
});