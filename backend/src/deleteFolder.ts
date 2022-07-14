import {addEndpoint} from './endpoints';
import {db} from './db';
import {LargeObjectManager} from 'pg-large-object';

type Args = {
	cipherFolderName: string;
};

addEndpoint<Args>('deleteFolder', 'DELETE', {
	cipherFolderName: 'base64'
}, async ({cipherFolderName}) => {
	
	await db.tx(async tx => {
		
		const files = await tx.manyOrNone<{oid: number}>(`
			SELECT oid FROM files WHERE
				folder = (SELECT id FROM folders WHERE
					cipher_name = $1);
		`, [
			cipherFolderName
		]);
		
		console.log(files);
		
		const largeObjectManager = new LargeObjectManager({pgPromise: tx});
		
		await Promise.all(files.map(file => largeObjectManager.unlinkAsync(file.oid)));
		
		await tx.none(`
			DELETE FROM folders WHERE
					cipher_name = $1;
		`, [
			cipherFolderName
		]);
		
	});
	
});