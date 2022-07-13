import {addEndpoint} from './endpoints';
import {db} from './dbClient';
import {UnprocessableEntity} from 'http-errors';

type Args = {
	username: string;
	cipherFolderName: string;
};

addEndpoint<Args>('addFolder', 'PUT', {
	username: 'string',
	cipherFolderName: 'base64'
}, async ({username, cipherFolderName}) => {
	
	const result = await db.oneOrNone(`
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
	
	if (result !== null)
		throw new UnprocessableEntity('FOLDER_NAME_DUPLICATE');
	
});