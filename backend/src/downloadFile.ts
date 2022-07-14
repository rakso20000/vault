import {addEndpoint} from './endpoints';
import {db} from './db';
import {LargeObjectManager} from 'pg-large-object';

type Args = {
	cipherFileName: string;
};

addEndpoint<Args>('downloadFile', 'POST', {
	cipherFileName: 'base64'
}, async ({cipherFileName}) => {
	
	let file: Buffer | null = null;
	
	await db.tx(async tx => {
		
		const {oid} = await tx.one<{oid: number}>(`
			SELECT oid FROM files WHERE
				cipher_name = $1;
		`, [
			cipherFileName
		]);
		
		const largeObjectManager = new LargeObjectManager({pgPromise: tx});
		
		const [_, stream] = await largeObjectManager.openAndReadableStreamAsync(oid);
		
		file = await new Promise<Buffer>((resolve, reject) => {
			
			const data = new Array<any>();
			
			stream.on('data', chunk => data.push(chunk));
			stream.on('end', () => resolve(Buffer.concat(data)));
			stream.on('error', reject);
			
		});
		
	});
	
	return file;
	
});