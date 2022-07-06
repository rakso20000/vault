import {Dispatch, SetStateAction, useEffect} from 'react';

type SetState<T> = Dispatch<SetStateAction<T>>;
type State<T> = [T, SetState<T>];

const apiCall = async (method: string, name: string, data: object) => {
	
	const response = await fetch(`/api/${name}`, {
		method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	
	return response.json();
	
};

const useAsyncEffect = (asyncEffect: () => Promise<void>, dependencies: any[]) => {
	
	useEffect(() => {
		
		asyncEffect().catch(console.error)
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);
	
};

const classes = (...classNames: (string | null)[]) => {
	
	return classNames.filter(className => className !== null).join(' ')
	
};

export type {
	SetState,
	State
};

export {
	apiCall,
	useAsyncEffect,
	classes
};