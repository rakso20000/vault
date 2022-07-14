import {FC} from 'react';
import style from './styles/FileSelector.module.scss';
import {apiCall, SetState, showError, useAsyncEffect} from './util';
import {decryptData} from './crypto';

type FileData = {
	key: string;
	name: string;
	type: string;
	data?: Blob;
	uploaded: boolean;
	downloaded: boolean;
};

type Props = {
	fileData: FileData;
	setFiles: SetState<FileData[]>;
};

const FileSelector: FC<Props> = ({fileData: {key, name, type, data, uploaded, downloaded}, setFiles}) => {
	
	useAsyncEffect(async () => {
		
		if (downloaded || !type.startsWith('image/'))
			return;
		
		try {
			
			const cipherFileData = await apiCall('POST', 'downloadFile', {
				cipherFileName: key
			});
			
			const decryptedData = await decryptData(cipherFileData);
			
			const data = new Blob([decryptedData], {type});
			
			setFiles(prevFiles => prevFiles.map(file => file.key === key ? {...file, downloaded: true, data} : file));
			
		} catch (error) {
			
			console.error(error);
			showError('Unknown error occurred trying to download file');
			
		}
		
	}, [key]);
	
	let url: (string | null) = null;
	
	if (type.startsWith('image/') && data !== undefined)
		url = URL.createObjectURL(data);
	
	return <div className={style.main}>
		<div className={style.imageContainer}>
			{url !== null ?
				<img className={style.imagePreview} src={url}  alt=""/> : null
			}
		</div>
		<p className={style.label}>{uploaded ? name : 'Uploading'}</p>
	</div>;
	
};

export type {
	FileData
};

export default FileSelector;