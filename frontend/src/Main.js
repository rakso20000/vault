import {useState} from 'react';
import style from './Main.module.css';
import Sidebar from './Sidebar';

const Main = ({userData}) => {
	
	const [selectedFolder, setSelectedFolder] = useState(null);
	
	return <div className={style.main}>
		<div className={style.sidebar}>
			<Sidebar userData={userData} setSelectedFolder={setSelectedFolder} />
		</div>
		<div className={style.content}>
			{selectedFolder}
		</div>
	</div>;
	
};

export default Main;