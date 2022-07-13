import {addEndpoint} from './endpoints';
import {db} from './db';
import {LargeObjectManager} from 'pg-large-object';
import {type} from 'os';

type Args = {
	cipherFolderName: string;
	cipherFileName: string;
	cipherFileType: string;
	file: Buffer;
};

addEndpoint<Args>('uploadFile', 'PUT', {
	cipherFolderName: 'base64',
	cipherFileName: 'base64',
	cipherFileType: 'base64',
	file: 'file'
}, async ({cipherFolderName, cipherFileName, cipherFileType, file}) => {
	
	await db.tx(async tx => {
		
		const {id: folderID} = await tx.one<{id: number}>(`
			SELECT id FROM folders WHERE
				cipher_name = $1
		`, [
			cipherFolderName
		]);
		
		const largeObjectManager = new LargeObjectManager({pgPromise: tx});
		
		const [oid, stream] = await largeObjectManager.createAndWritableStreamAsync();
		
		await new Promise((resolve, reject) => {
			
			stream.on('finish', resolve);
			stream.on('error', reject);
			
			stream.end(file);
			
		});
		
		await tx.one(`
			INSERT INTO files (
				folder,
				cipher_name,
				cipher_type,
				oid
			) VALUES (
				$1,
				$2,
				$3,
				$4
			) RETURNING id;
		`, [
			folderID,
			cipherFileName,
			cipherFileType,
			oid
		]);
		
		console.log('Created file with id ', oid);
		
	});
	
});