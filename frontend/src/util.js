const apiCall = async (method, name, data) => {
	
	const response = await fetch(`/api/${name}`, {
		method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	
	return response.json();
	
};

export {
	apiCall
};