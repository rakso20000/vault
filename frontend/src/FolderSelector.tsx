import {ChangeEventHandler, FC, KeyboardEventHandler, useState} from 'react';
import style from './styles/FolderSelector.module.scss'
import {Folder} from './Main';
import {apiCall, classes, displayMessage, showError, State} from './util';
import editIcon from './assets/edit.svg';
import crossIcon from './assets/cross.svg';
import loadingIcon from './assets/loading_spinner.svg';
import {encryptText} from './crypto';

type Props = {
	folder: Folder;
	foldersState: State<Folder[]>;
	selectedFolderState: State<Folder | null>;
};

const FolderSelector: FC<Props> = ({folder, foldersState: [folders, setFolders], selectedFolderState: [selectedFolder, setSelectedFolder]}) => {
	
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);
	const [newFolderName, setNewFolderName] = useState(folder.name);
	
	const isSelected = folder.key === selectedFolder?.key;
	
	const select = () => {
		
		setSelectedFolder(folder);
		
	};
	
	const editFolder = () => {
		
		if (isLoading || isWaitingForConfirmation)
			return;
		
		setIsEditing(true);
		
	};
	
	const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
		
		setNewFolderName(event.target.value);
		
	};
	
	const handleFocusLost = () => {
		
		setNewFolderName(folder.name);
		setIsEditing(false);
		
	};
	
	const handleKeydown: KeyboardEventHandler<HTMLInputElement> = async event => {
		
		//prevent space from selecting folder
		if (event.key === ' ') {
			
			event.preventDefault();
			
			setNewFolderName(`${newFolderName} `);
			
		}
		
		if (event.key !== 'Enter')
			return;
		
		setIsEditing(false);
		
		if (newFolderName === folder.name)
			return;
		
		setIsLoading(true);
		
		const newKey = await encryptText(newFolderName);
		
		try {
			
			await apiCall('PATCH', 'renameFolder', {
				oldCipherFolderName: folder.key,
				newCipherFolderName: newKey
			});
			
		} catch (error) {
			
			console.error(error);
			showError('Unknown error occurred trying to rename folder');
			
			setIsLoading(false);
			return;
			
		}
		
		const newFolders = folders.slice();
		const index = newFolders.findIndex(f => f.key === folder.key);
		
		newFolders[index] = {
			originalKey: folder.originalKey,
			key: newKey,
			name: newFolderName
		};
		
		setFolders(newFolders);
		setIsLoading(false);
		
	};
	
	const deleteFolder = async () => {
		
		if (isLoading || isWaitingForConfirmation)
			return;
		
		setIsWaitingForConfirmation(true);
		
		const confirmed = await displayMessage('Delete Folder', `Are you sure you want to delete ${folder.name}?`, 'Delete');
		
		setIsWaitingForConfirmation(false);
		
		if (!confirmed)
			return;
		
		setIsLoading(true);
		
		try {
			
			await apiCall('DELETE', 'deleteFolder', {
				cipherFolderName: folder.key
			});
			
		} catch (error) {
			
			console.error(error);
			showError('Unknown error occurred trying to delete folder');
			
			setIsLoading(false);
			return;
			
		}
		
		const newFolders = folders.filter(f => f.originalKey !== folder.originalKey);
		
		setFolders(newFolders);
		
	};
	
	return <div className={classes(style.folder, isSelected ? style.selected : null)}>
		<button className={style.folderButton} onClick={select}>
			{isEditing ?
				<input className={style.folderInput} value={newFolderName} autoFocus={true} onBlur={handleFocusLost} onChange={handleChange} onKeyDown={handleKeydown} /> :
			isLoading ?
				<>
					<p className={classes(style.folderName, style.loading)}>{newFolderName}</p>
					<img className={style.loadingIcon} src={loadingIcon} alt="Loading" />
				</> :
				<p className={style.folderName}>{folder.name}</p>
			}
		</button>
		<div className={style.background} />
		<button className={style.iconButton} onClick={editFolder}>
			<img className={style.icon} src={editIcon} alt="Edit" />
		</button>
		<button className={classes(style.iconButton, style.deleteButton)} onClick={deleteFolder}>
			<img className={style.icon} src={crossIcon} alt="Delete" />
		</button>
	</div>;
	
};

export default FolderSelector;