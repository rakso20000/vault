import {useState} from 'react';
import style from './LoginBox.module.css';
import LoginForm from './LoginForm';
import CreateAccountForm from './CreateAccountForm';

const LoginBox = ({setUserData}) => {
	
	const [creatingAccount, setCreatingAccount] = useState(false);
	
	return <div className={style.loginBox}>
		{!creatingAccount ?
			<LoginForm setUserData={setUserData} setCreatingAccount={setCreatingAccount} /> :
			<CreateAccountForm setUserData={setUserData} setCreatingAccount={setCreatingAccount} />
		}
	</div>;
	
};

export default LoginBox;