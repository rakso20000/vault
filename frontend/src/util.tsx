import {Dispatch, SetStateAction, useEffect} from 'react';
import {PromptData} from './Prompt';

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

let addPromptData: (promptData: PromptData) => void;

const updatePromptDataAdder = (adder: (promptData: PromptData) => void) => {
	
	addPromptData = adder;
	
};

const displayMessage = (title: string, message: string, buttonText: string) => new Promise<boolean>(resolve => {
	
	addPromptData({
		title,
		message,
		buttonText,
		callback: resolve
	});
	
});

export type {
	SetState,
	State
};

export {
	apiCall,
	useAsyncEffect,
	classes,
	updatePromptDataAdder,
	displayMessage
};