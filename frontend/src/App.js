import {useState} from 'react';
import style from './App.module.css';
import LoginBox from './LoginBox';
import Main from './Main';

const App = () => {
	
	const [userData, setUserData] = useState({
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

export default App;