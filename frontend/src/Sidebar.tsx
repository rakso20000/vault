import {FC, useState} from 'react';
import {apiCall, SetState, useAsyncEffect} from './util';
import {encryptText, decryptText} from './crypto';
import style from './Sidebar.module.css';
import FolderSelector from './FolderSelector';
import TextInput from './TextInput';
import {UserData} from './App';
import {Folder} from './Main';

type Props = {
	userData: UserData;
	setSelectedFolder: SetState<Folder | null>;
};

const Sidebar: FC<Props> = ({userData, setSelectedFolder}) => {
	
	const [folders, setFolders] = useState<Folder[]>([]);
	const [folderName, setFolderName] = useState('');
	const [folderNameError, setFolderNameError] = useState<string | null>(null);
	
	useAsyncEffect(async () => {
		
		const {cipherFolderNames} = await apiCall('POST', 'getFolders', {
			username: userData.username
		});
		
		const folders: Folder[] = await Promise.all(cipherFolderNames.map(async (cipherFolderName: string) => ({
			key: cipherFolderName,
			name: await decryptText(cipherFolderName)
		})));
		
		setFolders(folders);
		
	}, [userData]);
	
	const addFolder = async () => {
		
		if (folderName === '') {
			
			setFolderNameError('Please enter a folder name');
			return;
			
		}
		
		const cipherFolderName = await encryptText(folderName);
		
		const {success, error} = await apiCall('POST', 'addFolder', {
			username: userData.username,
			cipherFolderName
		});
		
		if (!success) {
			
			if (error === 'FOLDER_NAME_DUPLICATE')
				setFolderNameError('FolderSelector already exists');
			
			return;
			
		}
		
		const folder: Folder = {
			key: cipherFolderName,
			name: folderName
		};
		
		setFolders([...folders, folder]);
		
	};
	
	return <>
		{folders.map(folder => <FolderSelector key={folder.key} folder={folder} setSelected={setSelectedFolder} />)}
		<p className={style.label}>Add folder:</p>
		<TextInput value={[folderName, setFolderName]} errorMessage={[folderNameError, setFolderNameError]} onSubmit={addFolder} />
		<button onClick={addFolder}>Add folder</button>
	</>
	
};

export default Sidebar;