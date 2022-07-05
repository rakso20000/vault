import {FC, useState} from 'react';
import style from './Main.module.css';
import Sidebar from './Sidebar';
import {UserData} from './App';

type Folder = {
	key: string;
	name: string;
}

type Props = {
	userData: UserData
};

const Main: FC<Props> = ({userData}) => {
	
	const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
	
	return <div className={style.main}>
		<div className={style.sidebar}>
			<Sidebar userData={userData} setSelectedFolder={setSelectedFolder} />
		</div>
		<div className={style.content}>
			{selectedFolder?.name}
		</div>
	</div>;
	
};

export type {
	Folder
};

export default Main;