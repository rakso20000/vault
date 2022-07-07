import {FC, useState} from 'react';
import style from './styles/LoginBox.module.scss';
import {SetState, apiCall, classes} from './util';
import {generateSalt, hashPassword, calculateKey} from './crypto';
import TextInput from './TextInput';
import backArrow from './assets/back_arrow.svg';
import {UserData} from './App';

type Props = {
	setUserData: SetState<UserData>;
	setCreatingAccount: SetState<boolean>;
};

const CreateAccountForm : FC<Props> = ({setUserData, setCreatingAccount}) => {
	
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [passwordConfirmError, setPasswordConfirmError] = useState<string | null>(null);
	
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
		
		const salt = generateSalt();
		const hash = await hashPassword(password, salt);
		
		const {success, error} = await apiCall('POST', 'createAccount', {
			username,
			hash,
			salt
		});
		
		if (!success) {
			
			if (error === 'USERNAME_TAKEN')
				setUsernameError('Username is already taken');
			
			return;
			
		}
		
		calculateKey(password, salt);
		
		setUserData({
			isLoggedIn: true,
			username
		});
		
	};
	
	const login = () => {
		
		setCreatingAccount(false);
		
	};
	
	return <>
		<button className={classes(style.button, style.backButton)} onClick={login}><img src={backArrow} alt="Back" /></button>
		<p className={style.prompt}>Create account</p>
		<p className={style.label}>Username</p>
		<TextInput value={[username, setUsername]} errorMessage={[usernameError, setUsernameError]} onSubmit={createAccount} />
		<p className={style.label}>Password</p>
		<TextInput value={[password, setPassword]} errorMessage={[passwordError, setPasswordError]} type="password" onSubmit={createAccount} />
		<p className={style.label}>Confirm password</p>
		<TextInput value={[passwordConfirm, setPasswordConfirm]} errorMessage={[passwordConfirmError, setPasswordConfirmError]} type="password" onSubmit={createAccount} />
		<button className={style.button} onClick={createAccount}>Create account</button>
	</>;
	
};

export default CreateAccountForm;