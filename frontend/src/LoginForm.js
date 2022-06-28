import {useState} from 'react';
import './LoginBox.css';
import {apiCall} from './util.js';
import TextInput from './TextInput';

const LoginForm = ({setUserData, setCreatingAccount}) => {
	
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	
	const [usernameError, setUsernameError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	
	const clearErrors = () => {
		
		if (usernameError)
			setUsernameError(null);
		
		if (passwordError)
			setPasswordError(null);
		
	}
	
	const login = async () => {
		
		clearErrors();
		
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
	
	const createAccount = () => {
		
		setCreatingAccount(true);
		
	};
	
	return <>
		<p className="prompt">Login</p>
		<p className="label">Username</p>
		<TextInput value={username} setValue={setUsername} errorMessage={usernameError} setErrorMessage={setUsernameError} onSubmit={login} />
		<p className="label">Password</p>
		<TextInput value={password} setValue={setPassword} errorMessage={passwordError} setErrorMessage={setPasswordError} type="password" onSubmit={login} />
		<button className="button" onClick={login}>Login</button>
		<hr />
		<button className="button switchButton" onClick={createAccount}>Create account</button>
	</>;
	
};

export default LoginForm;