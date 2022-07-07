import http from 'node:http';
import {getEndpoint} from './endpoints';
import {initDB} from './dbClient';
import {IncomingMessage, RequestListener, ServerResponse} from 'http';

import './getUserSalt';
import './login';
import './createAccount';
import './getFolders';
import './addFolder';
import './renameFolder';

const port = 14151;

const readBody = (req: IncomingMessage) => new Promise((resolve, reject) => {
	
	let body = '';
	
	req.on('data', data => {
		
		if (body.length > 65536)
			reject(new Error('Request is too large'));
		
		body += data;
		
	});
	
	req.on('end', () => resolve(JSON.parse(body)));
	
});

const handleAPIRequest = async (req: IncomingMessage, res: ServerResponse) => {
	
	const endpointName = req?.url?.slice(5);
	
	if (!endpointName)
		return;
	
	if (!req.method)
		return;
	
	const endpoint = getEndpoint(endpointName, req.method);
	const body = await readBody(req);
	
	const response = await endpoint?.(body);
	
	res.setHeader('Cache-Control', 'no-store');
	res.setHeader('Content-type', 'application/json');
	
	res.end(JSON.stringify(response));
	
};

const handleRequest: RequestListener = async (req, res) => {
	
	if (req?.url?.startsWith('/api/'))
		await handleAPIRequest(req, res);
	else
		res.end('TODO');
	
};

const init = async () => {
	
	await initDB();
	
	const server = http.createServer(handleRequest);
	server.listen(port, '0.0.0.0');
	
	console.log(`Started server on port ${port}`);
	
};

init().catch(error => {
	
	if (error.stack)
		console.error(error.stack);
	
	console.error(error);
	
	process.exit(1);
	
});