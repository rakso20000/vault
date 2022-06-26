import {useState, useRef} from 'react';
import './Login.css';

const Login = ({setUserData}) => {
	
	const [usernameError, setUsernameError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	
	const usernameRef = useRef();
	const passwordRef = useRef();
	
	const login = () => {
		
		const username = usernameRef.current.value;
		const password = passwordRef.current.value;
		
		setUsernameError('');
		setPasswordError('');
		
		if (username === '')
			setUsernameError('Please enter a username');
		
		if (password === '')
			setPasswordError('Please enter a password');
		
		if (username === '' || password === '')
			return;
		
		setUserData({
			isLoggedIn: true,
			username
		});
		
	};
	
	const keydown = event => {
		
		if (event.key === 'Enter')
			login();
		
	};
	
	return (
		<div className="loginForm">
			<p className="prompt">Login</p>
			<p className="label">Username</p>
			<input type="text" ref={usernameRef} onKeyDown={keydown} className={usernameError ? "errorInput" : "input"} />
			{usernameError ? <p className="errorMessage">{usernameError}</p> : null}
			<p className="label">Password</p>
			<input type="password" ref={passwordRef} onKeyDown={keydown} className={passwordError ? "errorInput" : "input"} />
			{passwordError ? <p className="errorMessage">{passwordError}</p> : null}
			<button className="button" onClick={login}>Login</button>
		</div>
	);
	
};

export default Login;