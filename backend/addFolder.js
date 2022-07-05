import {addEndpoint} from './endpoints.js';
import {dbClient} from './dbClient.js';

addEndpoint('addFolder', 'POST', async ({username, folder}) => {
	
	const result = await dbClient.query(`
		INSERT INTO folders (
			owner,
			name
		) VALUES (
			$1,
			$2
		) ON CONFLICT DO NOTHING;
	`, [
		username,
		folder
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