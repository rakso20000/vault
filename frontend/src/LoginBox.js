import {useState} from 'react';
import './LoginBox.css';
import LoginForm from './LoginForm';
import CreateAccountForm from './CreateAccountForm';

const LoginBox = ({setUserData}) => {
	
	const [creatingAccount, setCreatingAccount] = useState(false);
	
	return <div className="loginBox">
		{!creatingAccount ?
			<LoginForm setUserData={setUserData} setCreatingAccount={setCreatingAccount} /> :
			<CreateAccountForm setUserData={setUserData} setCreatingAccount={setCreatingAccount} />
		}
	</div>;
	
};

export default LoginBox;