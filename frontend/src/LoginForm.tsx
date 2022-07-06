import {FC, useState} from 'react';
import style from './LoginBox.module.scss';
import {apiCall, SetState} from './util';
import {hashPassword, calculateKey} from './crypto';
import TextInput from './TextInput';
import {UserData} from './App';

type Props = {
	setUserData: SetState<UserData>;
	setCreatingAccount: SetState<boolean>;
};

const LoginForm: FC<Props> = ({setUserData, setCreatingAccount}) => {
	
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	
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
		
		let {success, error, salt} = await apiCall('POST', 'getUserSalt', {
			username
		});
		
		if (!success) {
			
			if (error === 'UNKNOWN_USER')
				setUsernameError('Unknown user');
			
			return;
			
		}
		
		const hash = await hashPassword(password, salt);
		
		({success, error} = await apiCall('POST', 'login', {
			username,
			hash
		}));
		
		if (!success) {
			
			if (error === 'UNKNOWN_USER')
				setUsernameError('Unknown user');
			else if (error === 'INCORRECT_PASSWORD')
				setPasswordError('Incorrect password');
			
			return;
			
		}
		
		calculateKey(password, salt);
		
		setUserData({
			isLoggedIn: true,
			username
		});
		
	};
	
	const createAccount = () => {
		
		setCreatingAccount(true);
		
	};
	
	return <>
		<p className={style.prompt}>Login</p>
		<p className={style.label}>Username</p>
		<TextInput value={[username, setUsername]} errorMessage={[usernameError, setUsernameError]} onSubmit={login} />
		<p className={style.label}>Password</p>
		<TextInput value={[password, setPassword]} errorMessage={[passwordError, setPasswordError]} type="password" onSubmit={login} />
		<button className={style.button} onClick={login}>Login</button>
		<hr />
		<button className={[style.button, style.switchButton].join(' ')} onClick={createAccount}>Create account</button>
	</>;
	
};

export default LoginForm;