import {addEndpoint} from './endpoints';
import {dbClient} from './dbClient';

type Args = {
	oldCipherFolderName: string;
	newCipherFolderName: string;
};

addEndpoint<Args>('renameFolder', 'POST', async ({oldCipherFolderName, newCipherFolderName}) => {
	
	await dbClient.query(`
		UPDATE folders SET
			cipher_name = $1
		WHERE
			cipher_name = $2;
	`, [
		newCipherFolderName,
		oldCipherFolderName
	]);
	
	return {
		success: true
	};
	
});