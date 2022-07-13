import {addEndpoint} from './endpoints';
import {db} from './dbClient';

type Args = {
	cipherFolderName: string;
};

addEndpoint<Args>('deleteFolder', 'DELETE', {
	cipherFolderName: 'base64'
}, async ({cipherFolderName}) => {
	
	await db.none(`
		DELETE FROM folders
		WHERE
			cipher_name = $1;
	`, [
		cipherFolderName
	]);
	
});