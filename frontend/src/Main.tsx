import {FC, useState} from 'react';
import style from './styles/Main.module.scss';
import Sidebar from './Sidebar';
import {UserData} from './App';
import FileArea from './FileArea';

type Folder = {
	originalKey: string;
	key: string;
	name: string;
}

type Props = {
	userData: UserData
};

const Main: FC<Props> = ({userData}) => {
	
	const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
	
	return <>
		<div className={style.sidebar}>
			<Sidebar userData={userData} selectedFolderState={[selectedFolder, setSelectedFolder]} />
		</div>
		<div className={style.content}>
			{selectedFolder !== null ?
				<FileArea key={selectedFolder.originalKey} folder={selectedFolder} /> : null
			}
		</div>
	</>;
	
};

export type {
	Folder
};

export default Main;