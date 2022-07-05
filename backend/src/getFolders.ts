import {addEndpoint} from './endpoints';
import {dbClient} from './dbClient';

type Args = {
	username: string;
};

addEndpoint<Args>('getFolders', 'POST', async ({username}) => {
	
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