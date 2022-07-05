import {useState} from 'react';
import {apiCall, useAsyncEffect} from './util';
import style from './Sidebar.module.css';
import Folder from './Folder';
import TextInput from './TextInput';

const Sidebar = ({userData, setSelectedFolder}) => {
	
	const [folders, setFolders] = useState([]);
	const [folderName, setFolderName] = useState('');
	const [folderNameError, setFolderNameError] = useState('');
	
	useAsyncEffect(async () => {
		
		const {folders} = await apiCall('POST', 'getFolders', {
			username: userData.username
		});
		
		setFolders(folders);
		
	}, [userData]);
	
	const addFolder = async () => {
		
		if (folderName === '') {
			
			setFolderNameError('Please enter a folder name');
			return;
			
		}
		
		const {success, error} = await apiCall('POST', 'addFolder', {
			username: userData.username,
			folder: folderName
		});
		
		if (!success) {
			
			if (error === 'FOLDER_NAME_DUPLICATE')
				setFolderNameError('Folder already exists');
			
			return;
			
		}
		
		setFolders([...folders, folderName]);
		
	};
	
	return <>
		{folders.map(folder => <Folder key={folder} folder={folder} setSelected={setSelectedFolder} />)}
		<p className={style.label}>Add folder:</p>
		<TextInput value={folderName} setValue={setFolderName} errorMessage={folderNameError} setErrorMessage={setFolderNameError} onSubmit={addFolder} />
		<button onClick={addFolder}>Add folder</button>
	</>
	
};

export default Sidebar;