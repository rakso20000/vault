import {addEndpoint} from './endpoints.js';

addEndpoint('login', 'POST', ({username, password}) => {
	
	if (username !== 'david')
		return {
			success: false,
			error: 'UNKNOWN_USER'
		};
	
	if (password !== '1234')
		return {
			success: false,
			error: 'INCORRECT_PASSWORD'
		};
	
	return {
		success: true
	};
	
});