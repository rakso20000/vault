import {Dispatch, SetStateAction, useEffect} from 'react';
import {PromptData} from './Prompt';

type SetState<T> = Dispatch<SetStateAction<T>>;
type State<T> = [T, SetState<T>];

const apiCall = async (method: string, name: string, data: object, file?: Uint8Array) => {
	
	const formData = new FormData();
	
	for (const [key, value] of Object.entries(data))
		formData.set(key, value);
	
	if (file) {
		
		const blob = new Blob([file]);
		formData.set('uploadedFileData', blob);
		
	}
	
	const response = await fetch(`/api/${name}`, {
		method,
		body: formData
	});
	
	if (!response.ok)
		throw await response.text();
	
	switch (response.headers.get('Content-type')) {
		case 'application/json':
			return response.json();
		case 'application/octet-stream':
			return response.arrayBuffer();
		default:
			return;
	}
	
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

const showError = (error: string) => {
	
	//TODO show proper error
	alert(error);
	
};

export type {
	SetState,
	State
};

export {
	apiCall,
	useAsyncEffect,
	classes,
	updatePromptDataAdder,
	displayMessage,
	showError
};