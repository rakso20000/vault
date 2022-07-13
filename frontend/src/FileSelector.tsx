import {FC, useEffect} from 'react';
import style from './styles/FileSelector.module.scss';
import {Folder} from './Main';

type FileData = {
	key: string;
	name: string;
	type: string;
	file: File;
	uploaded: boolean;
};

type Props = {
	fileData: FileData;
	folder: Folder;
};

const FileSelector: FC<Props> = ({fileData, folder}) => {
	
	const {name, type, file, uploaded} = fileData;
	
	let url: (string | null) = null;
	
	if (type.startsWith('image/'))
		url = URL.createObjectURL(file);
	
	return <div className={style.main}>
		<div className={style.imageContainer}>
			{url !== null ?
				<img className={style.imagePreview} src={url} /> : null
			}
		</div>
		<p className={style.label}>{uploaded ? name : 'Uploading'}</p>
	</div>;
	
};

export type {
	FileData
};

export default FileSelector;