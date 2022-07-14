import {FC, useEffect, useState} from 'react';
import {apiCall, classes, showError, State, useAsyncEffect} from './util';
import {encryptText, decryptText} from './crypto';
import style from './styles/Sidebar.module.scss';
import FolderSelector from './FolderSelector';
import TextInput from './TextInput';
import {UserData} from './App';
import {Folder} from './Main';
import menuIcon from './assets/menu.svg';
import backIcon from './assets/back_arrow.svg';

type Props = {
	userData: UserData;
	selectedFolderState: State<Folder | null>;
};

const Sidebar: FC<Props> = ({userData, selectedFolderState: [selectedFolder, setSelectedFolder]}) => {
	
	const [folders, setFolders] = useState<Folder[]>([]);
	const [folderName, setFolderName] = useState('');
	const [folderNameError, setFolderNameError] = useState<string | null>(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	
	useAsyncEffect(async () => {
		
		let cipherFolderNames: string[];
		
		try {
			
			cipherFolderNames = await apiCall('POST', 'getFolders', {
				username: userData.username
			});
			
		} catch (error) {
			
			console.error(error);
			showError('Unknown error occurred trying to load folders');
			
			return;
			
		}
		
		const folders: Folder[] = await Promise.all(cipherFolderNames.map(async (cipherFolderName: string) => ({
			originalKey: cipherFolderName,
			key: cipherFolderName,
			name: await decryptText(cipherFolderName)
		})));
		
		setFolders(folders);
		
	}, [userData]);
	
	console.log('a');
	
	useEffect(() => {
		
		console.log('b');
		
		setIsSidebarOpen(selectedFolder === null);
		
	}, [selectedFolder]);
	
	const addFolder = async () => {
		
		if (folderName === '') {
			
			setFolderNameError('Please enter a folder name');
			return;
			
		}
		
		if (folders.some(folder => folder.name === folderName)) {
			
			setFolderNameError('Duplicate folder name');
			return;
			
		}
		
		const cipherFolderName = await encryptText(folderName);
		
		try {
			
			await apiCall('PUT', 'addFolder', {
				username: userData.username,
				cipherFolderName
			});
			
		} catch (error) {
			
			console.error(error);
			showError('Unknown error occurred trying to create folder');
			
			return;
			
		}
		
		setFolderName('');
		
		const folder: Folder = {
			originalKey: cipherFolderName,
			key: cipherFolderName,
			name: folderName
		};
		
		setFolders(prevFolders => [...prevFolders, folder]);
		
	};
	
	const openSidebar = () => {
		
		setIsSidebarOpen(true);
		
	};
	
	const closeSidebar = () => {
		
		setIsSidebarOpen(false);
		
	};
	
	return <>
		<button className={style.sidebarButton} onClick={openSidebar}>
			<img className={style.icon} src={menuIcon} alt="Sidebar" />
		</button>
		<div className={classes(style.sidebar, isSidebarOpen ? style.open : null)}>
			<button className={classes(style.sidebarButton, style.sidebarBackButton)} onClick={closeSidebar}>
				<img className={style.icon} src={backIcon} alt="Close" />
			</button>
			{folders.map(folder =>
				<FolderSelector key={folder.originalKey} folder={folder} setFolders={setFolders} selectedFolderState={[selectedFolder, setSelectedFolder]} />
			)}
			<p className={style.label}>Add folder:</p>
			<div className={style.addFolder}>
				<div className={style.input}>
					<TextInput value={[folderName, setFolderName]} errorMessage={[folderNameError, setFolderNameError]} onSubmit={addFolder} />
				</div>
				<button className={style.button} onClick={addFolder}>Add</button>
			</div>
		</div>
	</>;
	
};

export default Sidebar;