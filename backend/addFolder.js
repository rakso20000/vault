import {addEndpoint} from './endpoints.js';
import {dbClient} from './dbClient.js';

addEndpoint('addFolder', 'POST', async ({username, cipherFolderName}) => {
	
	const result = await dbClient.query(`
		INSERT INTO folders (
			owner,
			cipher_name
		) VALUES (
			$1,
			$2
		) ON CONFLICT DO NOTHING;
	`, [
		username,
		cipherFolderName
	]);
	
	if (result.rowCount === 0)
		return {
			success: false,
			error: 'FOLDER_NAME_DUPLICATE'
		};
	
	return {
		success: true
	};
	
});