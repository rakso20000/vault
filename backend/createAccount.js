import {addEndpoint} from './endpoints.js';

addEndpoint('createAccount', 'POST', ({username, password}) => {
	
	if (username === 'david')
		return {
			success: false,
			error: 'USERNAME_TAKEN'
		};
	
	return {
		success: true
	};
	
});