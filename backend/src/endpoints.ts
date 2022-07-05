type Endpoint<Arguments> = (args: Arguments) => Promise<Object>;

type EndpointData = {
	name: string;
	method: string;
	endpoint: Endpoint<any>;
};

const endpoints: EndpointData[] = [];

const addEndpoint = <T>(name: string, method: string, endpoint: Endpoint<T>) => {
	
	if (getEndpoint(name, method) !== null)
		throw new Error(`Endpoint ${method} ${name} already exists`);
	
	endpoints.push({
		name,
		method,
		endpoint
	});
	
};

const getEndpoint = (name: string, method: string): Endpoint<unknown> | null => {
	
	return endpoints.find(endpoint => endpoint.name === name && endpoint.method === method)?.endpoint ?? null;
	
};

export {
	addEndpoint,
	getEndpoint
};