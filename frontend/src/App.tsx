import {useState} from 'react';
import style from './App.module.scss';
import LoginBox from './LoginBox';
import Main from './Main';

type UserData = {
	isLoggedIn: boolean;
	username?: string;
};

const App = () => {
	
	const [userData, setUserData] = useState<UserData>({
		isLoggedIn: false
	});
	
	return <>
		<div className={style.title}>
			Vault - {userData.isLoggedIn ? userData.username : 'Login'}
		</div>
		<div className={style.content}>
			{!userData.isLoggedIn ?
				<LoginBox setUserData={setUserData} /> :
				<Main userData={userData} />
			}
		</div>
	</>;
	
};

export type {
	UserData
};

export default App;