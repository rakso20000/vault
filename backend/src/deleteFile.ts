import {addEndpoint} from './endpoints';
import {db} from './db';
import {LargeObjectManager} from 'pg-large-object';

type Args = {
	cipherFileName: string;
};

addEndpoint<Args>('deleteFile', 'DELETE', {
	cipherFileName: 'base64'
}, async ({cipherFileName}) => {
	
	await db.tx(async tx => {
		
		const {oid} = await tx.one<{oid: number}>(`
			DELETE FROM files WHERE
				cipher_name = $1
				RETURNING oid;
		`, [
			cipherFileName
		]);
		
		const largeObjectManager = new LargeObjectManager({pgPromise: tx});
		
		await largeObjectManager.unlinkAsync(oid);
		
	});
	
});