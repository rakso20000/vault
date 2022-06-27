import {useState, useRef} from 'react';
import {apiCall} from './util.js';
import './Login.css';

const Login = ({setUserData}) => {
	
	const [usernameError, setUsernameError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	
	const usernameRef = useRef();
	const passwordRef = useRef();
	
	const login = async () => {
		
		const username = usernameRef.current.value;
		const password = passwordRef.current.value;
		
		if (usernameError)
			setUsernameError('');
		
		if (passwordError)
			setPasswordError('');
		
		if (username === '')
			setUsernameError('Please enter a username');
		
		if (password === '')
			setPasswordError('Please enter a password');
		
		if (username === '' || password === '')
			return;
		
		const {success, error} = await apiCall('POST', 'login', {
			username,
			password
		});
		
		if (success) {
			
			setUserData({
				isLoggedIn: true,
				username
			})
			
		} else {
			
			if (error === 'UNKNOWN_USER')
				setUsernameError('Unknown user');
			else if (error === 'INCORRECT_PASSWORD')
				setPasswordError('Incorrect password');
			
		}
		
	};
	
	const keydownUsername = event => {
		
		if (usernameError)
			setUsernameError(null);
		
		if (event.key === 'Enter')
			login();
		
	};
	
	const keydownPassword = event => {
		
		if (passwordError)
			setPasswordError(null);
		
		if (event.key === 'Enter')
			login();
		
	};
	
	return (
		<div className="loginForm">
			<p className="prompt">Login</p>
			<p className="label">Username</p>
			<input type="text" ref={usernameRef} onKeyDown={keydownUsername} className={usernameError ? "errorInput" : "input"} />
			{usernameError ? <p className="errorMessage">{usernameError}</p> : null}
			<p className="label">Password</p>
			<input type="password" ref={passwordRef} onKeyDown={keydownPassword} className={passwordError ? "errorInput" : "input"} />
			{passwordError ? <p className="errorMessage">{passwordError}</p> : null}
			<button className="button" onClick={login}>Login</button>
		</div>
	);
	
};

export default Login;