import {addEndpoint} from './endpoints';
import {db} from './dbClient';

type Args = {
	username: string;
};

addEndpoint<Args>('getFolders', 'POST', {
	username: 'string'
}, async ({username}) => {
	
	const folders = await db.manyOrNone(`
		SELECT cipher_name FROM folders WHERE
			owner = $1
		ORDER BY id;
	`, [
		username
	]);
	
	return folders.map(folder => folder.cipher_name);
	
});