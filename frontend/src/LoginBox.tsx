import {FC, useState} from 'react';
import style from './LoginBox.module.css';
import LoginForm from './LoginForm';
import CreateAccountForm from './CreateAccountForm';
import {SetState} from './util';
import {UserData} from './App';

type Props = {
	setUserData: SetState<UserData>;
};

const LoginBox: FC<Props> = ({setUserData}) => {
	
	const [creatingAccount, setCreatingAccount] = useState(false);
	
	return <div className={style.loginBox}>
		{!creatingAccount ?
			<LoginForm setUserData={setUserData} setCreatingAccount={setCreatingAccount} /> :
			<CreateAccountForm setUserData={setUserData} setCreatingAccount={setCreatingAccount} />
		}
	</div>;
	
};

export default LoginBox;