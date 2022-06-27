import {useState} from 'react';
import './App.css';
import Login from './Login.js';

const App = () => {
	
	const [userData, setUserData] = useState({
		isLoggedIn: false
	});
	
	return (
		<>
			<div className="title">
				Vault - {userData.isLoggedIn ? userData.username : "Login"}
			</div>
			{!userData.isLoggedIn ? <Login setUserData={setUserData} /> : null}
		</>
	);
	
};

export default App;