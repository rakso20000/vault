const endpoints = [];

const addEndpoint = (name, method, handler) => {
	
	if (getHandler(name, method) !== null)
		throw new Error(`Endpoint ${method} ${name} already exists`);
	
	endpoints.push({
		name,
		method,
		handler
	});
	
};

const getHandler = (name, method) => {
	
	return endpoints.find(endpoint => endpoint.name === name && endpoint.method === method)?.handler ?? null;
	
};

export {
	addEndpoint,
	getHandler
};