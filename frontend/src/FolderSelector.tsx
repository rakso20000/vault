import {FC} from 'react';
import style from './styles/FolderSelector.module.scss'
import {Folder} from './Main';
import {classes, SetState} from './util';
import edit from './assets/edit.svg';
import cross from './assets/cross.svg';

type Props = {
	folder: Folder;
	setSelected: SetState<Folder | null>;
	isSelected: boolean;
};

const FolderSelector: FC<Props> = ({folder, setSelected, isSelected}) => {
	
	const select = () => {
		
		setSelected(folder);
		
	};
	
	return <div className={classes(style.folder, isSelected ? style.selected : null)}>
		<button className={style.folderButton} onClick={select}>{folder.name}</button>
		<div className={style.background}></div>
		<button className={style.iconButton}><img className={style.icon} src={edit} alt="Edit" /></button>
		<button className={classes(style.iconButton, style.deleteButton)}><img className={style.icon} src={cross} alt="Delete" /></button>
	</div>;
	
};

export default FolderSelector;