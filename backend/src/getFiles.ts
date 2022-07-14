import {addEndpoint} from './endpoints';
import {db} from './db';

type Args = {
	cipherFolderName: string;
};

addEndpoint<Args>('getFiles', 'POST', {
	cipherFolderName: 'base64'
}, async ({cipherFolderName}) => {
	
	const files = await db.manyOrNone(`
		SELECT
			cipher_name,
			cipher_type
		FROM files WHERE
			folder = (SELECT id FROM folders WHERE
				cipher_name = $1);
	`, [
		cipherFolderName
	]);
	
	return files.map(file => ({
		name: file.cipher_name,
		type: file.cipher_type
	}));
	
});