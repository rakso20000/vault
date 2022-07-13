type Callback<Arguments> = (args: Arguments) => (Promise<any>);

type EndpointArguments = {
	[name: string]: ('string' | 'base64' | 'file');
};

type Endpoint = {
	name: string;
	method: string;
	args: EndpointArguments;
	callback: Callback<any>;
};

const endpoints: Endpoint[] = [];

const addEndpoint = <T extends object>(name: string, method: string, args: EndpointArguments, callback: Callback<T>) => {
	
	if (getEndpoint(name) !== null)
		throw new Error(`Endpoint ${name} already exists`);
	
	endpoints.push({
		name,
		method,
		args,
		callback
	});
	
};

const getEndpoint = (name: string): Endpoint | null => {
	
	return endpoints.find(endpoint => endpoint.name === name) ?? null;
	
};

export type {
	EndpointArguments
};

export {
	addEndpoint,
	getEndpoint
};