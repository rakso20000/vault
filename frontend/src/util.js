import {useEffect} from 'react';

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

const useAsyncEffect = (asyncEffect, dependencies) => {
	
	useEffect(() => {
		
		asyncEffect().catch(console.error)
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);
	
};

export {
	apiCall,
	useAsyncEffect
};