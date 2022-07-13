import http from 'node:http';
import {EndpointArguments, getEndpoint} from './endpoints';
import {initDB} from './dbClient';
import {IncomingMessage, RequestListener, ServerResponse} from 'http';
import createHttpError, {
	BadRequest, HttpError,
	InternalServerError,
	isHttpError, MethodNotAllowed, NotFound,
	UnsupportedMediaType
} from 'http-errors';
import {Form} from 'multiparty';

import './getUserSalt';
import './login';
import './createAccount';
import './getFolders';
import './addFolder';
import './renameFolder';
import './deleteFolder';

const port = 14151;

const parseForm = (req: IncomingMessage, expectedArgs: EndpointArguments) => new Promise<object>((resolve, reject) => {
	
	const args: {[name: string]: string} = {};
	let rejected = false;
	
	const form = new Form();
	
	form.on('field', (name, value) => {
		
		if (rejected)
			return;
		
		if (expectedArgs[name] === undefined) {
			
			form.emit('error', new BadRequest(`unexpected parameter ${name}`));
			return;
			
		}
		
		switch (expectedArgs[name]) {
			case 'base64':
				if (/^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{3}=|[A-Za-z\d+/]{2}==)?$/.test(value))
					break;
				
				form.emit('error', new BadRequest(`expected parameter ${name} of type base64`));
				return;
		}
		
		if (Array.isArray(value) && value.length === 1)
			value = value[0];
		
		args[name] = value;
		
	});
	
	form.on('error', error => {
		
		if (rejected)
			return;
		
		rejected = true;
		reject(error);
		
	});
	
	form.on('close', () => {
		
		for (const name in expectedArgs)
			if (args[name] === undefined) {
				
				reject(new BadRequest(`expected parameter ${name} of type ${expectedArgs[name]}`));
				return;
				
			}
		
		resolve(args);
		
	});
	
	form.parse(req);
	
});

const handleAPIRequest = async (req: IncomingMessage, res: ServerResponse) => {
	
	if (!req.url)
		throw new InternalServerError('url expected');
	
	if (!req.method)
		throw new InternalServerError('method expected');
	
	const contentType = req.headers['content-type']?.split(';')?.[0];
	
	if (contentType !== 'multipart/form-data')
		throw new UnsupportedMediaType('content-type must be "application/json" or "multipart/form-data"');
	
	const endpointName = req.url.slice(5);
	const endpoint = getEndpoint(endpointName);
	
	if (endpoint === null)
		throw new NotFound(`${endpointName} not found`);
	
	if (req.method !== endpoint.method)
		throw new MethodNotAllowed(`${endpoint.name} expects ${endpoint.method} requests`)
	
	const args = await parseForm(req, endpoint.args);
	const response = await endpoint.callback(args);
	
	res.setHeader('Cache-Control', 'no-store');
	res.setHeader('Content-type', 'application/json');
	
	if (response !== undefined)
		res.end(JSON.stringify(response));
	else
		res.end();
	
};

const handleRequest: RequestListener = async (req, res) => {
	
	if (req?.url?.startsWith('/api/')) {
		
		try {
			
			await handleAPIRequest(req, res);
			
		} catch (error: (HttpError | any)) {
			
			const httpError: HttpError = isHttpError(error) ? error : createHttpError(500, 'internal server error', error);
			
			if (httpError.statusCode >= 500)
				console.error(httpError.stack)
			
			const message = httpError.statusCode < 500 ? httpError.message : 'internal server error';
			
			res.statusCode = httpError.statusCode;
			res.setHeader('Content-type', 'text/plain');
			res.end(message);
			
		}
		
	} else
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