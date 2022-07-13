import {addEndpoint} from './endpoints';
import {db} from './dbClient';

type Args = {
	oldCipherFolderName: string;
	newCipherFolderName: string;
};

addEndpoint<Args>('renameFolder', 'PATCH', {
	oldCipherFolderName: 'string',
	newCipherFolderName: 'string'
}, async ({oldCipherFolderName, newCipherFolderName}) => {
	
	await db.none(`
		UPDATE folders SET
			cipher_name = $1
		WHERE
			cipher_name = $2;
	`, [
		newCipherFolderName,
		oldCipherFolderName
	]);
	
});