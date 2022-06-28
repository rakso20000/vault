import {useState} from 'react';
import './App.css';
import LoginBox from './LoginBox';

const App = () => {
	
	const [userData, setUserData] = useState({
		isLoggedIn: false
	});
	
	return <>
		<div className="title">
			Vault - {userData.isLoggedIn ? userData.username : 'Login'}
		</div>
		{!userData.isLoggedIn ? <LoginBox setUserData={setUserData} /> : null}
	</>;
	
};

export default App;