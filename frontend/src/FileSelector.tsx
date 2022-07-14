import {FC} from 'react';
import style from './styles/FileSelector.module.scss';

type FileData = {
	key: string;
	name: string;
	type: string;
	file?: File;
	uploaded: boolean;
};

type Props = {
	fileData: FileData;
};

const FileSelector: FC<Props> = ({fileData}) => {
	
	const {name, type, file, uploaded} = fileData;
	
	let url: (string | null) = null;
	
	if (type.startsWith('image/') && file !== undefined)
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