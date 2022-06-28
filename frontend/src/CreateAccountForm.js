import {useState} from 'react';
import './LoginBox.css';
import {apiCall} from './util.js';
import TextInput from './TextInput';
import backArrow from './assets/back_arrow.svg';

const CreateAccountForm = ({setUserData, setCreatingAccount}) => {
	
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	
	const [usernameError, setUsernameError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	const [passwordConfirmError, setPasswordConfirmError] = useState(null);
	
	const clearErrors = () => {
		
		if (usernameError)
			setUsernameError(null);
		
		if (passwordError)
			setPasswordError(null);
		
		if (passwordConfirmError)
			setPasswordError(null);
		
	}
	
	const createAccount = async () => {
		
		clearErrors();
		
		if (username === '')
			setUsernameError('Please enter a username');
		
		if (password === '')
			setPasswordError('Please enter a password');
		else if (passwordConfirm === '')
			setPasswordConfirmError('Please confirm your password');
		else if (password !== passwordConfirm)
			setPasswordConfirmError('Passwords must match');
		
		if (username === '' || password === '' || password !== passwordConfirm)
			return;
		
		const {success, error} = await apiCall('POST', 'createAccount', {
			username,
			password
		});
		
		if (success) {
			
			setUserData({
				isLoggedIn: true,
				username
			});
			
		} else {
			
			if (error === 'USERNAME_TAKEN')
				setUsernameError('Username is already taken');
			
		}
		
	};
	
	const login = () => {
		
		setCreatingAccount(false);
		
	};
	
	return <>
		<button className="button backButton" onClick={login}><img src={backArrow}  alt="Back" /></button>
		<p className="prompt">Create account</p>
		<p className="label">Username</p>
		<TextInput value={username} setValue={setUsername} errorMessage={usernameError} setErrorMessage={setUsernameError} onSubmit={createAccount} />
		<p className="label">Password</p>
		<TextInput value={password} setValue={setPassword} errorMessage={passwordError} setErrorMessage={setPasswordError} type="password" onSubmit={createAccount} />
		<p className="label">Confirm password</p>
		<TextInput value={passwordConfirm} setValue={setPasswordConfirm} errorMessage={passwordConfirmError} setErrorMessage={setPasswordConfirmError} type="password" onSubmit={createAccount} />
		<button className="button" onClick={createAccount}>Create account</button>
	</>;
	
};

export default CreateAccountForm;