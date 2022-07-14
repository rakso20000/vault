import {FC} from 'react';
import style from './styles/FileSelector.module.scss';
import {apiCall, SetState, showError, useAsyncEffect} from './util';
import {decryptData} from './crypto';
import fileIcon from './assets/file.svg';
import loadingIcon from './assets/loading_spinner.svg';

type FileData = {
	key: string;
	name: string;
	type: string;
	data?: Blob;
	origin: 'server' | 'client';
	isLoading: boolean
};

type Props = {
	fileData: FileData;
	setFiles: SetState<FileData[]>;
};

const FileSelector: FC<Props> = ({fileData: {key, name, type, data, origin, isLoading}, setFiles}) => {
	
	const showPreview = type.startsWith('image/');
	
	useAsyncEffect(async () => {
		
		if (!showPreview || !isLoading || origin === 'client')
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
	
	if (showPreview && data !== undefined)
		url = URL.createObjectURL(data);
	
	return <div className={style.main}>
		<div className={style.imageContainer}>
			{!showPreview ?
				<img className={style.imagePreview} src={fileIcon} alt="" /> :
				url == null ?
					<img className={style.imagePreview} src={loadingIcon} alt="" /> :
					<img className={style.imagePreview} src={url}  alt="" />
			}
		</div>
		<p className={style.label}>{origin === 'server' || !isLoading ? name : 'Uploading'}</p>
	</div>;
	
};

export type {
	FileData
};

export default FileSelector;