import {useState} from 'react';
import './Main.css';
import Sidebar from './Sidebar';

const Main = ({userData}) => {
	
	const [selectedFolder, setSelectedFolder] = useState(null);
	
	return <div className="main">
		<div className="sidebar">
			<Sidebar userData={userData} setSelectedFolder={setSelectedFolder} />
		</div>
		<div className="folder">
			{selectedFolder}
		</div>
	</div>;
	
};

export default Main;