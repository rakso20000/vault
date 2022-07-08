import {addEndpoint} from './endpoints';
import {dbClient} from './dbClient';

type Args = {
	cipherFolderName: string;
};

addEndpoint<Args>('deleteFolder', 'POST', async ({cipherFolderName}) => {
	
	await dbClient.query(`
		DELETE FROM folders
		WHERE
			cipher_name = $1;
	`, [
		cipherFolderName
	]);
	
	return {
		success: true
	};
	
});