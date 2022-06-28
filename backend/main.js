import http from 'node:http';
import {getHandler} from './endpoints.js';

import './login.js';
import './createAccount.js';

const port = 14151;

const readBody = req => new Promise((resolve, reject) => {
	
	let body = '';
	
	req.on('data', data => {
		
		if (body.length > 65536)
			reject(new Error('Request is too large'));
		
		body += data;
		
	});
	
	req.on('end', () => resolve(JSON.parse(body)));
	
});

const handleAPIRequest = async (req, res) => {
	
	const endpointName = req.url.slice(5);
	
	const handler = getHandler(endpointName, req.method);
	const body = await readBody(req);
	
	const response = await handler(body);
	
	res.setHeader('Cache-Control', 'no-store');
	res.setHeader('Content-type', 'application/json');
	
	res.end(JSON.stringify(response));
	
};

const handleRequest = async (req, res) => {
	
	if (req.url.startsWith('/api/'))
		await handleAPIRequest(req, res);
	else
		res.end('TODO');
	
};

const server = http.createServer(handleRequest);
server.listen(port, '0.0.0.0');

console.log(`Started server on port ${port}`);