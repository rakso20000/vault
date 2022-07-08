import {useState} from 'react';
import style from './styles/App.module.scss';
import LoginBox from './LoginBox';
import Main from './Main';
import Prompt, {PromptData} from './Prompt';
import {updatePromptDataAdder} from './util';

type UserData = {
	isLoggedIn: boolean;
	username?: string;
};

declare global {
	let setter: any;
}

const App = () => {
	
	const [userData, setUserData] = useState<UserData>({
		isLoggedIn: false
	});
	
	const [promptDataQueue, setPromptDataQueue] = useState<PromptData[]>([]);
	
	updatePromptDataAdder((promptData: PromptData) => {
		
		const newPromptDataQueue = promptDataQueue.slice();
		newPromptDataQueue.push(promptData);
		setPromptDataQueue(newPromptDataQueue);
		
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
		{promptDataQueue.length !== 0 ?
			<Prompt promptDataQueueState={[promptDataQueue, setPromptDataQueue]} /> : null
		}
	</>;
	
};

export type {
	UserData
};

export default App;